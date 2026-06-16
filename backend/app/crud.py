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


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


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
