from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, schemas, models
from app.db.session import get_db
from app.core.security import verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=schemas.UserRead)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, user_in)

    # create associated profile depending on role
    if user_in.role == 'worker':
        # create an empty worker profile (frontend will PATCH with details)
        worker = models.Worker(user_id=user.id)
        db.add(worker)
        db.commit()
        db.refresh(worker)
    elif user_in.role == 'customer':
        customer = models.Customer(user_id=user.id)
        db.add(customer)
        db.commit()
        db.refresh(customer)

    return user


@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}
