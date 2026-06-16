from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str
    first_name: Optional[str]
    last_name: Optional[str]


class UserRead(BaseModel):
    id: int
    email: EmailStr
    role: str
    first_name: Optional[str]
    last_name: Optional[str]

    class Config:
        orm_mode = True


class SkillBase(BaseModel):
    name: str


class SkillRead(SkillBase):
    id: int

    class Config:
        orm_mode = True


class WorkerCreate(BaseModel):
    title: str
    bio: str
    experience: int
    skill_level: str
    hourly_rate: float
    city: str
    state: str
    zip_code: str
    skills: List[str]


class WorkerRead(BaseModel):
    id: int
    user_id: int
    title: Optional[str]
    bio: Optional[str]
    experience: Optional[int]
    skill_level: Optional[str]
    hourly_rate: Optional[float]
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[str]
    rating: Optional[float]
    review_count: Optional[int]
    skills: List[SkillRead] = []

    class Config:
        orm_mode = True


class JobCreate(BaseModel):
    title: str
    description: str
    category: str
    budget_type: str
    budget_amount: float
    location: str
    city: str
    state: str
    zip_code: str
    urgency: str
    start_date: Optional[datetime]
    skills: List[str] = []


class JobRead(BaseModel):
    id: int
    customer_id: int
    title: str
    description: str
    category: str
    budget_type: str
    budget_amount: float
    location: str
    city: str
    state: str
    zip_code: str
    urgency: str
    start_date: Optional[datetime]
    skills: List[SkillRead] = []

    class Config:
        orm_mode = True


class ReviewCreate(BaseModel):
    job_id: int
    worker_id: int
    rating: int
    text: Optional[str]


class ReviewRead(ReviewCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
