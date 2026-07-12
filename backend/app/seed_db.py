from app.db.session import SessionLocal
from app import models
from app.core.security import get_password_hash
from datetime import datetime

def seed():
    print("Seeding database...")
    db = SessionLocal()
    
    # Clean up existing data in order of dependency
    db.query(models.worker_skill_association).delete()
    db.query(models.job_skill_association).delete()
    db.query(models.Review).delete()
    db.query(models.Notification).delete()
    db.query(models.Job).delete()
    db.query(models.Worker).delete()
    db.query(models.Customer).delete()
    db.query(models.Skill).delete()
    db.query(models.User).delete()
    db.commit()

    # Create Skills
    skills = {}
    skill_names = ["Plumbing", "Pipe Installation", "Emergency Repairs", "Electrical Wiring", "Solar Installation", "Home Automation"]
    for name in skill_names:
        s = models.Skill(name=name)
        db.add(s)
        db.commit()
        db.refresh(s)
        skills[name] = s

    # Create Customer User
    customer_pwd = get_password_hash("securepassword123")
    customer_user = models.User(
        email="customer@example.com",
        hashed_password=customer_pwd,
        role="customer",
        first_name="Jane",
        last_name="Smith"
    )
    db.add(customer_user)
    db.commit()
    db.refresh(customer_user)

    customer_profile = models.Customer(
        user_id=customer_user.id,
        company_name="Acme Home Services",
        address="123 Main St",
        city="Brooklyn",
        state="NY",
        zip_code="11201"
    )
    db.add(customer_profile)
    db.commit()
    db.refresh(customer_profile)

    # Create Worker User (Sarah)
    sarah_pwd = get_password_hash("securepassword123")
    sarah_user = models.User(
        email="worker@example.com",
        hashed_password=sarah_pwd,
        role="worker",
        first_name="Sarah",
        last_name="Johnson"
    )
    db.add(sarah_user)
    db.commit()
    db.refresh(sarah_user)

    sarah_profile = models.Worker(
        user_id=sarah_user.id,
        title="Professional Plumber",
        bio="Licensed plumber with 10+ years of experience. Specialized in residential and commercial plumbing repairs.",
        experience=10,
        skill_level="expert",
        hourly_rate=75.0,
        city="Brooklyn",
        state="NY",
        zip_code="11201",
        rating=4.9,
        review_count=127,
        completed_jobs=245,
        verified=True,
        profile_image="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    )
    sarah_profile.skills.append(skills["Plumbing"])
    sarah_profile.skills.append(skills["Pipe Installation"])
    sarah_profile.skills.append(skills["Emergency Repairs"])
    db.add(sarah_profile)
    db.commit()

    # Create Worker User (Michael)
    michael_pwd = get_password_hash("securepassword123")
    michael_user = models.User(
        email="michael@example.com",
        hashed_password=michael_pwd,
        role="worker",
        first_name="Michael",
        last_name="Chen"
    )
    db.add(michael_user)
    db.commit()
    db.refresh(michael_user)

    michael_profile = models.Worker(
        user_id=michael_user.id,
        title="Certified Electrician",
        bio="Master electrician specializing in modern home automation and solar installations.",
        experience=12,
        skill_level="expert",
        hourly_rate=85.0,
        city="Manhattan",
        state="NY",
        zip_code="10001",
        rating=4.8,
        review_count=98,
        completed_jobs=189,
        verified=True,
        profile_image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    )
    michael_profile.skills.append(skills["Electrical Wiring"])
    michael_profile.skills.append(skills["Solar Installation"])
    michael_profile.skills.append(skills["Home Automation"])
    db.add(michael_profile)
    db.commit()

    # Create Jobs
    job1 = models.Job(
        customer_id=customer_profile.id,
        title="Leaky Pipe Repair in Kitchen",
        description="Our kitchen sink pipe has a slow leak and needs immediate repair or replacement.",
        category="Plumbing",
        budget_type="fixed",
        budget_amount=150.0,
        location="Brooklyn, NY",
        city="Brooklyn",
        state="NY",
        zip_code="11201",
        urgency="high",
        start_date=datetime.utcnow(),
        status="open"
    )
    job1.skills.append(skills["Plumbing"])
    job1.skills.append(skills["Emergency Repairs"])
    db.add(job1)

    job2 = models.Job(
        customer_id=customer_profile.id,
        title="Install Smart Light Switches",
        description="Need a certified electrician to replace 6 standard switches with smart dimmer switches.",
        category="Electrical",
        budget_type="hourly",
        budget_amount=60.0,
        location="Manhattan, NY",
        city="Manhattan",
        state="NY",
        zip_code="10001",
        urgency="medium",
        start_date=datetime.utcnow(),
        status="open"
    )
    job2.skills.append(skills["Electrical Wiring"])
    job2.skills.append(skills["Home Automation"])
    db.add(job2)
    db.commit()

    db.close()
    print("Done seeding database.")

if __name__ == "__main__":
    seed()
