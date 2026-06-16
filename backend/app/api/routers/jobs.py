from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db_dep, get_current_user
from app import crud, schemas, models
from app.db.session import get_db

router = APIRouter()


@router.post("/", response_model=schemas.JobRead)
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
    return job


@router.get("/{job_id}", response_model=schemas.JobRead)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = crud.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/", response_model=List[schemas.JobRead])
def list_jobs(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.list_jobs(db, skip=skip, limit=limit)
