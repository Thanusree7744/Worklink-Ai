# ⚡ WorkLink AI

> **AI-Powered On-Demand Job Matching & Workforce Platform**  
> Connect skilled trade workers (plumbers, electricians, HVAC, carpenters) with customers and contractors seamlessly. Features real-time AI job recommendations, live chat, application tracking, and role-based dashboards.

---

## 🚀 System Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Real-Time & Auth**: Firebase Auth (Google 1-Click Login & Email/Password), Cloud Firestore (Live Chat & Data Sync)
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy, Pydantic, Alembic
- **Database**: SQLite (Zero-config out of the box for dev) / PostgreSQL (Production ready)
- **API Documentation**: Interactive Swagger UI (`/docs`) & ReDoc (`/redoc`)

---

## 📋 Prerequisites

Before running the project on any OS (Windows, macOS, or Linux), make sure you have:

1. **Node.js** (v18.x or later) & **npm** (v9.x or later) - [Download Node.js](https://nodejs.org/)
2. **Python** (v3.10 or later) & **pip** - [Download Python](https://www.python.org/)
3. **Git** - [Download Git](https://git-scm.com/)

---

## ⚡ Quick Start Guide (Run on Any System)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Thanusree7744/Worklink-Ai.git
cd Worklink-Ai
```

---

### Step 2: Backend Setup (FastAPI)

Open a terminal in the project root and navigate to the `backend` folder:

#### On Windows (PowerShell or Command Prompt):
```powershell
cd backend

# 1. Create a Python virtual environment
python -m venv .venv

# 2. Activate virtual environment
.\.venv\Scripts\activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Copy environment configuration
copy .env.example .env

# 5. Initialize & seed the database with demo accounts
python -m app.init_db
python -m app.seed_db

# 6. Start the FastAPI backend server
uvicorn app.main:app --reload --port 8000
```

#### On macOS / Linux (Terminal / Bash):
```bash
cd backend

# 1. Create a Python virtual environment
python3 -m venv .venv

# 2. Activate virtual environment
source .venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Copy environment configuration
cp .env.example .env

# 5. Initialize & seed the database with demo accounts
python3 -m app.init_db
python3 -m app.seed_db

# 6. Start the FastAPI backend server
uvicorn app.main:app --reload --port 8000
```

The backend API is now running at `http://localhost:8000`.  
Explore interactive API documentation at: `http://localhost:8000/docs`

---

### Step 3: Frontend Setup (React + Vite)

Open a **new** terminal window and navigate to the `frontend` folder:

#### On Windows / macOS / Linux:
```bash
cd frontend

# 1. Install frontend dependencies
npm install

# 2. Create the .env configuration file
# (On Windows PowerShell: copy .env.example .env)
# (On macOS/Linux: cp .env.example .env)
cp .env.example .env

# 3. Start the Vite development server
npm run dev
```

The frontend application will start at: `http://localhost:5173`

---

## 🔑 Demo Credentials

You can test every role immediately using these pre-seeded demo accounts on `http://localhost:5173/login`:

| Role | Name | Email | Password | Access / Features |
| :--- | :--- | :--- | :--- | :--- |
| **Worker** | Sarah Johnson | `worker@example.com` | `securepassword123` | Worker Dashboard, Job Search, Application Status, Profile |
| **Worker** | Michael Chen | `michael@example.com` | `securepassword123` | Certified Electrician profile, Proposals, Live Chat |
| **Customer** | Jane Smith | `customer@example.com` | `securepassword123` | Post New Jobs, View Applicants, Hire Workers |
| **Admin** | System Admin | `admin@example.com` | `securepassword123` | Platform Analytics, Manage Users, Manage Jobs |

> **Google Sign-In**: You can also click **"Sign in with Google"** on the login page to authenticate directly with your Google account.

---

## ⚙️ Environment Variables Reference

### Frontend (`frontend/.env`)

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:8000/api

# Feature Flags
VITE_ENABLE_MOCK_DATA=false
VITE_DEBUG_MODE=false
VITE_ENV=development

# Firebase & Firestore Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=worklink-ai-dda70.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=worklink-ai-dda70
VITE_FIREBASE_STORAGE_BUCKET=worklink-ai-dda70.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Backend (`backend/.env`)

```env
# Database URL (SQLite default for zero-setup local dev)
DATABASE_URL=sqlite:///dev.db

# Security & Tokens
SECRET_KEY=worklink-super-secret-key-change-in-production-12345
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Frontend Origin for CORS
FRONTEND_ORIGIN=http://localhost:5173
UPLOADS_DIR=./static/uploads

# Optional AI Key (for enhanced recommendation scoring)
GEMINI_API_KEY=
```

---

## 🔥 Firebase & Firestore Setup (Optional / Custom Firebase)

If you connect your own Firebase project:

1. Enable **Authentication**:
   - In Firebase Console &rarr; **Authentication** &rarr; Enable **Google** and **Email/Password**.
2. Enable **Firestore Database**:
   - In Firebase Console &rarr; **Firestore Database** &rarr; Create Database.
   - Set Security Rules under **Rules**:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }
     ```

---

## 🐳 Docker Setup (Alternative 1-Command Startup)

If you have Docker and Docker Compose installed:

```bash
# Build and run backend container
cd backend
docker-compose up --build
```

---

## 📁 Project Directory Structure

```text
Worklink-Ai/
├── README.md               # Main project documentation & setup guide
├── DEMO_CREDENTIALS.md     # Demo login credentials
├── backend/                # FastAPI backend service
│   ├── app/
│   │   ├── api/            # API endpoints & routers (auth, jobs, workers, etc.)
│   │   ├── core/           # Security, config & settings
│   │   ├── db/             # Database session & models
│   │   ├── models.py       # SQLAlchemy database models
│   │   ├── schemas.py      # Pydantic schemas & validations
│   │   ├── init_db.py      # Database table initialization script
│   │   └── seed_db.py      # Seed script for demo accounts & jobs
│   ├── requirements.txt    # Python package dependencies
│   ├── Dockerfile          # Backend container file
│   └── dev.db              # Local SQLite database
└── frontend/               # React + Vite frontend application
    ├── src/
    │   ├── app/
    │   │   ├── pages/      # Application views & dashboards
    │   │   ├── components/ # Reusable UI design system components
    │   │   ├── contexts/   # AuthContext & State management
    │   │   └── services/   # Firebase client, Firestore sync & API client
    ├── package.json        # Node dependencies & build scripts
    └── vite.config.ts      # Vite configuration
```

---

## 🛠️ Common Troubleshooting

- **`npm` execution policy error on Windows**:  
  Run terminal commands using `cmd.exe /c "npm install"` or run PowerShell as Administrator and execute `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **Port 8000 already in use**:  
  Run `uvicorn app.main:app --reload --port 8001` and update `VITE_API_BASE_URL=http://localhost:8001/api` in `frontend/.env`.
- **CORS Errors**:  
  Ensure `FRONTEND_ORIGIN=http://localhost:5173` matches the port where your Vite server runs.

---

## 📄 License

Distributed under the MIT License. Built with ❤️ for tradespeople and clients worldwide.
