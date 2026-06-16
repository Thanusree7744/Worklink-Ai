from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi import Depends
import shutil
import os
from uuid import uuid4

from app.core.config import settings

router = APIRouter()


@router.post("/profile-image")
def upload_profile_image(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1]
    fname = f"{uuid4().hex}{ext}"
    dest = os.path.join(settings.UPLOADS_DIR, fname)
    try:
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()
    url = f"/static/uploads/{fname}"
    return {"url": url}
