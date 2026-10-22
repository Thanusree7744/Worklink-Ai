# ⚡ WorkLink AI

> **AI-Powered Workforce & Job Matching Platform**  
> An intelligent on-demand platform designed to connect skilled trade workers (plumbers, electricians, HVAC technicians, carpenters) with customers and contractors. Features instant role-based access, real-time messaging, AI job recommendations, and full lifecycle hiring workflows.

---

## 🛠️ Tools & Technologies Used

### **Frontend**
- **Core Framework**: React 18, TypeScript, Vite
- **Styling & UI**: Tailwind CSS, Radix UI Primitives, Lucide React Icons
- **Animations & Effects**: Motion, Canvas Confetti
- **Data Visualization**: Recharts
- **Authentication & Real-Time**: Firebase Auth (Google 1-Click Login & Email/Password), Cloud Firestore (Live Messaging & Sync)

### **Backend**
- **Framework**: FastAPI (High-performance Python ASGI web framework)
- **Server**: Uvicorn
- **ORM & Data Modeling**: SQLAlchemy 2.0, Alembic
- **Validation**: Pydantic v2
- **Security & Tokens**: Passlib (Bcrypt), Python-JOSE (JWT tokens)
- **Database**: SQLite (Local development) / PostgreSQL (Production)
- **Documentation**: Swagger UI (`/docs`) & ReDoc (`/redoc`)

### **DevOps & Workflow**
- Git & GitHub
- Docker & Docker Compose

---

## 💻 Commands to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/Thanusree7744/Worklink-Ai.git
cd Worklink-Ai
```

---

### 2. Run the Backend (FastAPI)

Open a terminal in the root folder and navigate to `backend`:

#### On Windows:
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m app.init_db
python -m app.seed_db
uvicorn app.main:app --reload --port 8000
```

#### On macOS / Linux:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 -m app.init_db
python3 -m app.seed_db
uvicorn app.main:app --reload --port 8000
```

Backend will be running at: `http://localhost:8000`  
Interactive API Docs: `http://localhost:8000/docs`

---

### 3. Run the Frontend (React + Vite)

Open a **separate** terminal window and navigate to `frontend`:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at: `http://localhost:5173`

---

## 🔑 Demo Login Accounts

Pre-seeded accounts are available immediately on `http://localhost:5173/login`:

| Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Worker** | Sarah Johnson | `worker@example.com` | `securepassword123` | Professional Plumber, Brooklyn NY |
| **Worker** | Michael Chen | `michael@example.com` | `securepassword123` | Certified Electrician, Manhattan NY |
| **Customer** | Jane Smith | `customer@example.com` | `securepassword123` | Acme Home Services, Post & Hire |
| **Admin** | System Admin | `admin@example.com` | `securepassword123` | Platform Analytics & Management |

> **Google Sign-In**: You can also click **"Sign in with Google"** directly on the login page for 1-click authentication.

---

## 📄 License

Distributed under the MIT License.
