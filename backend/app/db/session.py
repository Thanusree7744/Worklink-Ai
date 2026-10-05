from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Resolve SQLite database path to absolute backend directory path
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite"):
    backend_dir = Path(__file__).resolve().parent.parent.parent
    db_file = backend_dir / "dev.db"
    db_url = f"sqlite:///{db_file.as_posix()}"

connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
engine = create_engine(db_url, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
