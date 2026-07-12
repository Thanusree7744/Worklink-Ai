from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, schemas, models
from app.db.session import get_db
from app.core.security import verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter()


def get_user_response(user: models.User) -> dict:
    name = f"{user.first_name or ''} {user.last_name or ''}".strip()
    if not name:
        name = user.email.split('@')[0]
    
    avatar = None
    verified = False
    if user.role == 'worker' and user.worker_profile:
        avatar = user.worker_profile.profile_image
        verified = user.worker_profile.verified
    
    return {
        "id": str(user.id),
        "email": user.email,
        "name": name,
        "role": user.role,
        "avatar": avatar,
        "verified": verified
    }


@router.post("/register", response_model=schemas.AuthResponse)
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

    # Return token & user data
    access_token = create_access_token(subject=str(user.id))
    return {
        "token": access_token,
        "user": get_user_response(user)
    }


@router.post("/login", response_model=schemas.AuthResponse)
def login_json(request_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, request_data.email)
    if not user or not verify_password(request_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    # In case role check is required
    if request_data.role and user.role != request_data.role:
        raise HTTPException(status_code=400, detail=f"User is not registered as a {request_data.role}")

    access_token = create_access_token(subject=str(user.id))
    return {
        "token": access_token,
        "user": get_user_response(user)
    }


@router.post("/login-form", response_model=schemas.Token)
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    return {
        "user": get_user_response(current_user)
    }

