from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from sqlalchemy.orm import Session

from app.db.session import get_db
from app import crud, schemas

router = APIRouter()


@router.get("/{worker_id}", response_model=schemas.WorkerRead)
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    w = crud.get_worker(db, worker_id)
    if not w:
        raise HTTPException(status_code=404, detail="Worker not found")
    return w


@router.get("/", response_model=List[schemas.WorkerRead])
def search_workers(q: str | None = Query(None), skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    workers = crud.list_workers(db, skip=skip, limit=limit)
    if q:
        ql = q.lower()
        workers = [w for w in workers if (w.title and ql in w.title.lower()) or (w.user and ql in (w.user.first_name or '').lower())]
    return workers
