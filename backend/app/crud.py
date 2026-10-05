from sqlalchemy.orm import Session
from typing import List

from app import models, schemas
from app.core.security import get_password_hash


def create_user(db: Session, user_in: schemas.UserCreate):
    hashed = get_password_hash(user_in.password)
    user = models.User(email=user_in.email, hashed_password=hashed, role=user_in.role,
                       first_name=user_in.first_name, last_name=user_in.last_name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


from sqlalchemy import func

def get_user_by_email(db: Session, email: str):
    if not email:
        return None
    cleaned = email.strip().lower()
    return db.query(models.User).filter(func.lower(models.User.email) == cleaned).first()


def get_user(db: Session, user_id: int):
    return db.query(models.User).get(user_id)


def create_skill_if_missing(db: Session, name: str):
    s = db.query(models.Skill).filter(models.Skill.name == name).first()
    if s:
        return s
    s = models.Skill(name=name)
    db.add(s)
    db.commit()
    db.refresh(s)
    return s


def create_worker_profile(db: Session, user: models.User, worker_in: schemas.WorkerCreate):
    worker = models.Worker(user_id=user.id, title=worker_in.title, bio=worker_in.bio,
                           experience=worker_in.experience, skill_level=worker_in.skill_level,
                           hourly_rate=worker_in.hourly_rate, city=worker_in.city,
                           state=worker_in.state, zip_code=worker_in.zip_code)
    db.add(worker)
    db.commit()
    # skills
    for name in worker_in.skills:
        s = create_skill_if_missing(db, name)
        worker.skills.append(s)
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return worker


def create_job(db: Session, customer: models.Customer, job_in: schemas.JobCreate):
    job = models.Job(customer_id=customer.id, title=job_in.title, description=job_in.description,
                     category=job_in.category, budget_type=job_in.budget_type,
                     budget_amount=job_in.budget_amount, location=job_in.location,
                     city=job_in.city, state=job_in.state, zip_code=job_in.zip_code,
                     urgency=job_in.urgency, start_date=job_in.start_date)
    db.add(job)
    db.commit()
    for name in job_in.skills:
        s = create_skill_if_missing(db, name)
        job.skills.append(s)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def get_job(db: Session, job_id: int):
    return db.query(models.Job).get(job_id)


def list_jobs(db: Session, skip: int = 0, limit: int = 50):
    return db.query(models.Job).offset(skip).limit(limit).all()


def list_workers(db: Session, skip: int = 0, limit: int = 50):
    return db.query(models.Worker).offset(skip).limit(limit).all()


def get_worker(db: Session, worker_id: int):
    return db.query(models.Worker).get(worker_id)


def create_review(db: Session, review_in: schemas.ReviewCreate, customer_id: int):
    review = models.Review(job_id=review_in.job_id, worker_id=review_in.worker_id,
                           customer_id=customer_id, rating=review_in.rating, text=review_in.text)
    db.add(review)
    db.commit()
    db.refresh(review)
    # update worker rating aggregate
    worker = db.query(models.Worker).get(review.worker_id)
    if worker:
        total_rating = (worker.rating * worker.review_count) + review.rating
        worker.review_count += 1
        worker.rating = total_rating / worker.review_count
        db.add(worker)
        db.commit()
    return review


def create_job_application(db: Session, job_id: int, worker_id: int, app_in: schemas.ApplicationCreate):
    existing = db.query(models.JobApplication).filter(
        models.JobApplication.job_id == job_id,
        models.JobApplication.worker_id == worker_id
    ).first()
    if existing:
        return existing
    app = models.JobApplication(
        job_id=job_id,
        worker_id=worker_id,
        cover_letter=app_in.cover_letter,
        proposed_rate=app_in.proposed_rate or 0.0,
        status='pending'
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


def get_job_application(db: Session, app_id: int):
    return db.query(models.JobApplication).get(app_id)


def get_worker_job_application(db: Session, job_id: int, worker_id: int):
    return db.query(models.JobApplication).filter(
        models.JobApplication.job_id == job_id,
        models.JobApplication.worker_id == worker_id
    ).first()


def list_applications_for_job(db: Session, job_id: int):
    return db.query(models.JobApplication).filter(models.JobApplication.job_id == job_id).all()


def list_applications_for_worker(db: Session, worker_id: int):
    return db.query(models.JobApplication).filter(models.JobApplication.worker_id == worker_id).order_by(models.JobApplication.created_at.desc()).all()


def update_application_status(db: Session, app_id: int, status: str):
    app = db.query(models.JobApplication).get(app_id)
    if app:
        app.status = status
        # If accepted, also transition the job status to 'in_progress'
        if status == 'accepted':
            job = db.query(models.Job).get(app.job_id)
            if job:
                job.status = 'in_progress'
                db.add(job)
        db.add(app)
        db.commit()
        db.refresh(app)
    return app

