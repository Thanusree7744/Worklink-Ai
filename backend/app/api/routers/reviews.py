from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db_dep, get_current_user
from app import crud, schemas
from app.db.session import get_db

router = APIRouter()


@router.post("/", response_model=schemas.ReviewRead)
def create_review(review_in: schemas.ReviewCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # only customers can leave reviews
    if current_user.role != 'customer':
        raise HTTPException(status_code=403, detail="Only customers can post reviews")
    review = crud.create_review(db, review_in, customer_id=current_user.id)
    return review
