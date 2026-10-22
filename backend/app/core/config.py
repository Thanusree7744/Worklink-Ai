from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///dev.db"
    SECRET_KEY: str = "worklink-super-secret-key-change-in-production-12345"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    GEMINI_API_KEY: str | None = None
    UPLOADS_DIR: str = "./static/uploads"

    class Config:
        env_file = ".env"


settings = Settings()
