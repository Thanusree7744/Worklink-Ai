import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.routers import auth, users, jobs, workers, recommendations, uploads, reviews, ping

app = FastAPI(title="WorkLink AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN] if settings.FRONTEND_ORIGIN else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads dir
os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(workers.router, prefix="/workers", tags=["workers"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
app.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
app.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
app.include_router(ping.router, prefix="/", tags=["ping"])

@app.get("/health")
def health():
    return {"status": "ok"}
