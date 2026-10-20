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
    print(f"[AUTH] Login attempt for email: '{request_data.email}'")
    user = crud.get_user_by_email(db, request_data.email)
    if not user:
        print(f"[AUTH] User '{request_data.email}' not found in database.")
        raise HTTPException(status_code=400, detail="User not found with this email.")
    
    is_valid = verify_password(request_data.password, user.hashed_password)
    print(f"[AUTH] User '{user.email}' found (role: {user.role}). Password valid: {is_valid}")
    if not is_valid:
        raise HTTPException(status_code=400, detail="Incorrect password.")

    access_token = create_access_token(subject=str(user.id))
    print(f"[AUTH] Login successful for '{user.email}' ({user.role})")
    return {
        "token": access_token,
        "user": get_user_response(user)
    }


@router.post("/firebase-login", response_model=schemas.AuthResponse)
def firebase_login(request_data: schemas.FirebaseLoginRequest, db: Session = Depends(get_db)):
    email = request_data.email.strip().lower()
    user = crud.get_user_by_email(db, email)
    role = request_data.role or "customer"
    
    if not user:
        # Create user for first-time Google/Firebase login
        parts = (request_data.name or email.split("@")[0]).strip().split(" ", 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ""
        
        user_in = schemas.UserCreate(
            email=email,
            password=f"firebase_{request_data.firebase_uid or 'oauth'}",
            role=role,
            first_name=first_name,
            last_name=last_name
        )
        user = crud.create_user(db, user_in)
        
        if role == 'worker':
            worker = models.Worker(
                user_id=user.id,
                profile_image=request_data.avatar,
                title="Professional Specialist",
                bio="WorkLink professional specialist.",
                experience=1,
                skill_level="intermediate",
                hourly_rate=45.0,
                city="New York",
                state="NY",
                zip_code="10001"
            )
            db.add(worker)
            db.commit()
            db.refresh(worker)
        elif role == 'customer':
            customer = models.Customer(user_id=user.id)
            db.add(customer)
            db.commit()
            db.refresh(customer)
    
    access_token = create_access_token(subject=str(user.id))
    print(f"[AUTH] Firebase login successful for '{user.email}' ({user.role})")
    return {
        "token": access_token,
        "user": get_user_response(user)
    }



@router.get("/debug-accounts")
def debug_accounts(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return [{"id": u.id, "email": u.email, "role": u.role, "name": f"{u.first_name} {u.last_name}"} for u in users]


@router.post("/seed")
def seed_endpoint():
    from app.seed_db import seed
    seed()
    return {"status": "success", "message": "Database seeded with demo accounts"}


@router.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    return {
        "user": get_user_response(current_user)
    }


