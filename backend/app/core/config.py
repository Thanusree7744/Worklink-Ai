from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    GEMINI_API_KEY: str | None = None
    UPLOADS_DIR: str = "./static/uploads"

    class Config:
        env_file = ".env"


settings = Settings()
