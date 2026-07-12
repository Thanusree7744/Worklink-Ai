from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db_dep, get_current_user
from app import crud, schemas, models
from app.db.session import get_db

router = APIRouter()


def format_job_response(j: models.Job) -> dict:
    posted_by = "Acme Corp"
    if j.customer:
        if j.customer.company_name:
            posted_by = j.customer.company_name
        elif j.customer.user:
            posted_by = f"{j.customer.user.first_name or ''} {j.customer.user.last_name or ''}".strip()
            if not posted_by:
                posted_by = j.customer.user.email.split('@')[0]

    return {
        "id": str(j.id),
        "title": j.title or "",
        "description": j.description or "",
        "category": j.category or "Other",
        "budget": float(j.budget_amount or 0.0),
        "budgetType": j.budget_type or "fixed",
        "location": j.location or "Remote",
        "postedBy": posted_by,
        "postedDate": j.created_at.isoformat() if j.created_at else "",
        "status": j.status or "open",
        "applicants": 0,
        "requiredSkills": [s.name for s in j.skills],
        "urgency": j.urgency or "medium",
        "matchScore": None
    }


@router.post("/", response_model=schemas.JobResponse)
def create_job(job_in: schemas.JobCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # only customers can post
    if current_user.role != 'customer':
        raise HTTPException(status_code=403, detail="Only customers can post jobs")
    # ensure customer profile exists (or create minimal)
    customer = db.query(models.Customer).filter(models.Customer.user_id == current_user.id).first()
    if not customer:
        customer = models.Customer(user_id=current_user.id)
        db.add(customer)
        db.commit()
        db.refresh(customer)
    job = crud.create_job(db, customer, job_in)
    return format_job_response(job)


@router.get("/{job_id}", response_model=schemas.JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = crud.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return format_job_response(job)


@router.get("/", response_model=List[schemas.JobResponse])
def list_jobs(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    jobs = crud.list_jobs(db, skip=skip, limit=limit)
    return [format_job_response(j) for j in jobs]

