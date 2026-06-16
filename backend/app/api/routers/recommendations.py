from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import math

from app.db.session import get_db
from app import crud, models, schemas

router = APIRouter()


def skill_match_score(job: models.Job, worker: models.Worker) -> float:
    job_skills = {s.name.lower() for s in job.skills}
    worker_skills = {s.name.lower() for s in worker.skills}
    if not job_skills:
        return 0.0
    match = len(job_skills & worker_skills) / len(job_skills)
    return match


def location_score(job: models.Job, worker: models.Worker) -> float:
    # approximate: if same city -> 1.0, else 0.0
    if job.city and worker.city and job.city.lower() == worker.city.lower():
        return 1.0
    return 0.0


def rating_score(worker: models.Worker) -> float:
    return (worker.rating or 0.0) / 5.0


def experience_score(worker: models.Worker) -> float:
    # normalize experience up to 20 years
    return min(worker.experience or 0, 20) / 20.0


@router.get("/job/{job_id}")
def recommend_for_job(job_id: int, db: Session = Depends(get_db)):
    job = crud.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    workers = crud.list_workers(db, skip=0, limit=200)
    scored = []
    for w in workers:
        s_skill = skill_match_score(job, w)
        s_loc = location_score(job, w)
        s_rating = rating_score(w)
        s_exp = experience_score(w)
        score = 0.4 * s_skill + 0.3 * s_loc + 0.2 * s_rating + 0.1 * s_exp
        scored.append((w, score, {'skill': s_skill, 'loc': s_loc, 'rating': s_rating, 'exp': s_exp}))
    scored.sort(key=lambda x: x[1], reverse=True)
    results = []
    for w, sc, breakdown in scored[:50]:
        results.append({
            'worker_id': w.id,
            'score': sc,
            'breakdown': breakdown,
            'worker': {
                'id': w.id,
                'title': w.title,
                'rating': w.rating,
                'review_count': w.review_count,
            }
        })
    return {'job_id': job.id, 'recommendations': results}
