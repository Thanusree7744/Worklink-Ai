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
        from_attributes = True


class SkillBase(BaseModel):
    name: str


class SkillRead(SkillBase):
    id: int

    class Config:
        from_attributes = True


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
        from_attributes = True


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
        from_attributes = True


class ReviewCreate(BaseModel):
    job_id: int
    worker_id: int
    rating: int
    text: Optional[str]


class ReviewRead(ReviewCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    avatar: Optional[str] = None
    verified: Optional[bool] = False

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


class WorkerResponse(BaseModel):
    id: str
    name: str
    title: str
    skills: List[str]
    rating: float
    reviewCount: int
    hourlyRate: float
    location: str
    verified: bool
    availability: str
    profileImage: Optional[str] = None
    skillLevel: str
    completedJobs: int
    bio: str
    experience: int
    distance: float = 0.0
    responseTime: str = "1 hour"
    matchScore: Optional[float] = None

    class Config:
        from_attributes = True


class JobResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    budget: float
    budgetType: str
    location: str
    postedBy: str
    postedDate: str
    status: str
    applicants: int = 0
    requiredSkills: List[str]
    urgency: str
    matchScore: Optional[float] = None

    class Config:
        from_attributes = True


class ApplicationCreate(BaseModel):
    cover_letter: Optional[str] = None
    proposed_rate: Optional[float] = 0.0


class ApplicationStatusUpdate(BaseModel):
    status: str  # accepted, rejected, withdrawn


class ApplicationResponse(BaseModel):
    id: str
    jobId: str
    workerId: str
    workerName: Optional[str] = None
    workerTitle: Optional[str] = None
    workerAvatar: Optional[str] = None
    workerRating: Optional[float] = 0.0
    coverLetter: Optional[str] = None
    proposedRate: float = 0.0
    status: str
    createdAt: str
    job: Optional[JobResponse] = None

    class Config:
        from_attributes = True



