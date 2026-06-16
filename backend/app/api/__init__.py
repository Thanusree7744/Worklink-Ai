from fastapi import APIRouter

from .routers import auth, users, jobs, workers, recommendations, uploads, reviews

router = APIRouter()
