from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.api.deps import get_current_user
from app import crud, models, schemas
from app.api.routers.workers import format_worker_response
from app.api.routers.jobs import format_job_response

router = APIRouter()


def skill_match_score(job: models.Job, worker: models.Worker) -> float:
    job_skills = {s.name.lower() for s in job.skills}
    worker_skills = {s.name.lower() for s in worker.skills}
    if not job_skills:
        return 0.0
    match = len(job_skills & worker_skills) / len(job_skills)
    return match


def location_score(job: models.Job, worker: models.Worker) -> float:
    if job.city and worker.city and job.city.lower() == worker.city.lower():
        return 1.0
    return 0.0


def rating_score(worker: models.Worker) -> float:
    return (worker.rating or 0.0) / 5.0


def experience_score(worker: models.Worker) -> float:
    return min(worker.experience or 0, 20) / 20.0


@router.get("/jobs", response_model=List[schemas.JobResponse])
def recommend_jobs_for_current_user(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    worker = db.query(models.Worker).filter(models.Worker.user_id == current_user.id).first()
    jobs = crud.list_jobs(db, limit=50)
    
    if not worker:
        formatted = []
        for j in jobs:
            fj = format_job_response(j)
            fj["matchScore"] = 85.0
            formatted.append(fj)
        return formatted

    scored = []
    for j in jobs:
        s_skill = skill_match_score(j, worker)
        s_loc = location_score(j, worker)
        score = 0.6 * s_skill + 0.4 * s_loc
        match_percentage = int(score * 100)
        match_percentage = max(50, min(100, match_percentage))
        
        fj = format_job_response(j)
        fj["matchScore"] = float(match_percentage)
        scored.append((fj, match_percentage))
    
    scored.sort(key=lambda x: x[1], reverse=True)
    return [x[0] for x in scored]


@router.get("/workers", response_model=List[schemas.WorkerResponse])
def recommend_workers_for_current_user(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    customer = db.query(models.Customer).filter(models.Customer.user_id == current_user.id).first()
    workers = crud.list_workers(db, limit=50)
    
    if not customer:
        formatted = []
        for w in workers:
            fw = format_worker_response(w)
            fw["matchScore"] = 85.0
            formatted.append(fw)
        return formatted

    customer_jobs = db.query(models.Job).filter(models.Job.customer_id == customer.id).all()
    scored = []
    for w in workers:
        max_score = 0.0
        if customer_jobs:
            for j in customer_jobs:
                s_skill = skill_match_score(j, w)
                s_loc = location_score(j, w)
                s_rating = rating_score(w)
                s_exp = experience_score(w)
                score = 0.4 * s_skill + 0.3 * s_loc + 0.2 * s_rating + 0.1 * s_exp
                if score > max_score:
                    max_score = score
        else:
            max_score = 0.5 * rating_score(w) + 0.5 * experience_score(w)

        match_percentage = int(max_score * 100)
        match_percentage = max(50, min(100, match_percentage))
        
        fw = format_worker_response(w)
        fw["matchScore"] = float(match_percentage)
        scored.append((fw, match_percentage))
        
    scored.sort(key=lambda x: x[1], reverse=True)
    return [x[0] for x in scored]


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
        match_percentage = int(sc * 100)
        match_percentage = max(50, min(100, match_percentage))
        fw = format_worker_response(w)
        fw["matchScore"] = float(match_percentage)
        results.append({
            'worker_id': w.id,
            'score': sc,
            'breakdown': breakdown,
            'worker': fw
        })
    return {'job_id': job.id, 'recommendations': results}

