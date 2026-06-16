from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db_dep, get_current_user
from app import crud, schemas

router = APIRouter()


@router.get("/me", response_model=schemas.UserRead)
def read_me(current_user=Depends(get_current_user)):
    return current_user
