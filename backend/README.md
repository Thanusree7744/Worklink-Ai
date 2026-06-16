Backend for WorkLink AI

Quick start (development):

1. Copy `.env.example` to `.env` and update values.
2. Create a virtualenv and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate  # or .\.venv\Scripts\activate on Windows
pip install -r requirements.txt
```

3. Initialize the database (Postgres running and DATABASE_URL set):

```bash
python -m app.init_db
```

4. Run the server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
