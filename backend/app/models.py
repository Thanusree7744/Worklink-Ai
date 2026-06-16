from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Table,
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


worker_skill_association = Table(
    'worker_skill_association',
    Base.metadata,
    Column('worker_id', ForeignKey('workers.id'), primary_key=True),
    Column('skill_id', ForeignKey('skills.id'), primary_key=True),
)

job_skill_association = Table(
    'job_skill_association',
    Base.metadata,
    Column('job_id', ForeignKey('jobs.id'), primary_key=True),
    Column('skill_id', ForeignKey('skills.id'), primary_key=True),
)


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(32), nullable=False)  # 'worker','customer','admin'
    first_name = Column(String(120))
    last_name = Column(String(120))
    phone = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    worker_profile = relationship('Worker', back_populates='user', uselist=False)
    customer_profile = relationship('Customer', back_populates='user', uselist=False)


class Worker(Base):
    __tablename__ = 'workers'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True)
    title = Column(String(255))
    bio = Column(Text)
    experience = Column(Integer, default=0)
    skill_level = Column(String(50))
    hourly_rate = Column(Float, default=0.0)
    city = Column(String(100))
    state = Column(String(50))
    zip_code = Column(String(20))
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    profile_image = Column(String(512), nullable=True)

    user = relationship('User', back_populates='worker_profile')
    skills = relationship('Skill', secondary=worker_skill_association, back_populates='workers')
    completed_jobs = Column(Integer, default=0)


class Customer(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True)
    company_name = Column(String(255))
    address = Column(String(255))
    city = Column(String(100))
    state = Column(String(50))
    zip_code = Column(String(20))

    user = relationship('User', back_populates='customer_profile')


class Skill(Base):
    __tablename__ = 'skills'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, index=True)
    workers = relationship('Worker', secondary=worker_skill_association, back_populates='skills')
    jobs = relationship('Job', secondary=job_skill_association, back_populates='skills')


class Job(Base):
    __tablename__ = 'jobs'
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    title = Column(String(255))
    description = Column(Text)
    category = Column(String(100))
    budget_type = Column(String(50))
    budget_amount = Column(Float, default=0.0)
    location = Column(String(255))
    city = Column(String(100))
    state = Column(String(50))
    zip_code = Column(String(20))
    urgency = Column(String(50))
    start_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default='open')

    skills = relationship('Skill', secondary=job_skill_association, back_populates='jobs')


class Review(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True)
    job_id = Column(Integer, ForeignKey('jobs.id'))
    worker_id = Column(Integer, ForeignKey('workers.id'))
    customer_id = Column(Integer, ForeignKey('customers.id'))
    rating = Column(Integer)
    text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    type = Column(String(100))
    data = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
