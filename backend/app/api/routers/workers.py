from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from sqlalchemy.orm import Session

from app.db.session import get_db
from app import crud, schemas, models

router = APIRouter()


def format_worker_response(w: models.Worker) -> dict:
    name = "Anonymous"
    if w.user:
        name = f"{w.user.first_name or ''} {w.user.last_name or ''}".strip()
        if not name:
            name = w.user.email.split('@')[0]

    location = f"{w.city or ''}, {w.state or ''}".strip(", ")
    if not location:
        location = "Remote"

    return {
        "id": str(w.id),
        "name": name,
        "title": w.title or "",
        "skills": [s.name for s in w.skills],
        "rating": float(w.rating or 0.0),
        "reviewCount": int(w.review_count or 0),
        "hourlyRate": float(w.hourly_rate or 0.0),
        "location": location,
        "verified": bool(w.verified),
        "availability": "available",
        "profileImage": w.profile_image or "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        "skillLevel": w.skill_level or "expert",
        "completedJobs": int(w.completed_jobs or 0),
        "bio": w.bio or "",
        "experience": int(w.experience or 0),
        "distance": 1.5,
        "responseTime": "1 hour",
        "matchScore": None
    }


@router.get("/{worker_id}", response_model=schemas.WorkerResponse)
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    w = crud.get_worker(db, worker_id)
    if not w:
        raise HTTPException(status_code=404, detail="Worker not found")
    return format_worker_response(w)


@router.get("/", response_model=List[schemas.WorkerResponse])
def search_workers(q: str | None = Query(None), skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    workers = crud.list_workers(db, skip=skip, limit=limit)
    formatted = [format_worker_response(w) for w in workers]
    if q:
        ql = q.lower()
        formatted = [
            fw for fw in formatted 
            if ql in fw["title"].lower() 
            or ql in fw["name"].lower() 
            or any(ql in s.lower() for s in fw["skills"])
        ]
    return formatted

