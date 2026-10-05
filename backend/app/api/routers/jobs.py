from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

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

    applicants_count = len(j.applications) if hasattr(j, 'applications') and j.applications else 0

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
        "applicants": applicants_count,
        "requiredSkills": [s.name for s in j.skills],
        "urgency": j.urgency or "medium",
        "matchScore": None
    }


def format_application_response(app: models.JobApplication) -> dict:
    worker_name = "Worker"
    worker_title = ""
    worker_avatar = None
    worker_rating = 0.0

    if app.worker:
        worker_title = app.worker.title or ""
        worker_avatar = app.worker.profile_image
        worker_rating = float(app.worker.rating or 0.0)
        if app.worker.user:
            worker_name = f"{app.worker.user.first_name or ''} {app.worker.user.last_name or ''}".strip()
            if not worker_name:
                worker_name = app.worker.user.email.split('@')[0]

    return {
        "id": str(app.id),
        "jobId": str(app.job_id),
        "workerId": str(app.worker_id),
        "workerName": worker_name,
        "workerTitle": worker_title,
        "workerAvatar": worker_avatar,
        "workerRating": worker_rating,
        "coverLetter": app.cover_letter or "",
        "proposedRate": float(app.proposed_rate or 0.0),
        "status": app.status or "pending",
        "createdAt": app.created_at.isoformat() if app.created_at else "",
        "job": format_job_response(app.job) if app.job else None
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


@router.get("/user/my-postings", response_model=List[schemas.JobResponse])
def get_my_postings(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    customer = db.query(models.Customer).filter(models.Customer.user_id == current_user.id).first()
    if not customer:
        return []
    jobs = db.query(models.Job).filter(models.Job.customer_id == customer.id).order_by(models.Job.created_at.desc()).all()
    return [format_job_response(j) for j in jobs]


@router.get("/user/my-applications", response_model=List[schemas.ApplicationResponse])
def get_my_applications(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    worker = db.query(models.Worker).filter(models.Worker.user_id == current_user.id).first()
    if not worker:
        return []
    apps = crud.list_applications_for_worker(db, worker.id)
    return [format_application_response(a) for a in apps]


@router.post("/{job_id}/apply", response_model=schemas.ApplicationResponse)
def apply_for_job(job_id: int, app_in: schemas.ApplicationCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role != 'worker':
        raise HTTPException(status_code=403, detail="Only workers can apply for jobs")
    worker = db.query(models.Worker).filter(models.Worker.user_id == current_user.id).first()
    if not worker:
        worker = models.Worker(user_id=current_user.id)
        db.add(worker)
        db.commit()
        db.refresh(worker)

    job = crud.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    app = crud.create_job_application(db, job_id=job.id, worker_id=worker.id, app_in=app_in)
    return format_application_response(app)


@router.get("/{job_id}/my-application")
def check_my_application(job_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    worker = db.query(models.Worker).filter(models.Worker.user_id == current_user.id).first()
    if not worker:
        return {"applied": False, "application": None}
    app = crud.get_worker_job_application(db, job_id, worker.id)
    if app:
        return {"applied": True, "application": format_application_response(app)}
    return {"applied": False, "application": None}


@router.get("/{job_id}/applications", response_model=List[schemas.ApplicationResponse])
def get_job_applications(job_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    job = crud.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    apps = crud.list_applications_for_job(db, job_id)
    return [format_application_response(a) for a in apps]


@router.patch("/applications/{app_id}/status", response_model=schemas.ApplicationResponse)
def update_application_status(app_id: int, status_in: schemas.ApplicationStatusUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    app = crud.get_job_application(db, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check if current user owns the job
    customer = db.query(models.Customer).filter(models.Customer.user_id == current_user.id).first()
    if not customer or app.job.customer_id != customer.id:
        if current_user.role != 'admin':
            raise HTTPException(status_code=403, detail="Not authorized to update application status")
    
    updated_app = crud.update_application_status(db, app_id, status_in.status)
    return format_application_response(updated_app)


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
