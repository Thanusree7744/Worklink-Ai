import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.session import engine, SessionLocal
from app import models
from app.seed_db import seed
from app.api.routers import auth, users, jobs, workers, recommendations, uploads, reviews, ping

app = FastAPI(title="WorkLink AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN] if settings.FRONTEND_ORIGIN else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Ensure database tables exist
    models.Base.metadata.create_all(bind=engine)
    # Check if database has users; if not, seed automatically
    db = SessionLocal()
    try:
        user_count = db.query(models.User).count()
        if user_count == 0:
            print("[STARTUP] Database is empty. Seeding initial demo data...")
            seed()
            print("[STARTUP] Demo data seeded successfully.")
    except Exception as e:
        print(f"[STARTUP] Error checking/seeding database: {e}")
    finally:
        db.close()


# Ensure uploads dir
os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(workers.router, prefix="/api/workers", tags=["workers"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["reviews"])
app.include_router(ping.router, prefix="/api", tags=["ping"])


@app.get("/health")
def health():
    return {"status": "ok"}
