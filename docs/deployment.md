# DeepFakeShield — Deployment & Execution Guide

## Quick Start

### 1. Backend Server
```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Runs at: `http://127.0.0.1:8000` (Swagger docs available at `http://127.0.0.1:8000/docs`).

### 2. Frontend Application
```powershell
cd frontend
npm run dev -- --host
```
Runs at: `http://localhost:5173`.

### 3. Neon PostgreSQL Configuration
To connect persistent history and operational tracking to Neon:
1. In `backend/.env`, set:
   ```env
   DATABASE_URL=postgresql://[user]:[password]@[neon-hostname].neon.tech/[dbname]?sslmode=require
   ```
2. The application automatically initializes tables (`analysis_records`, `model_registry`, `evaluation_runs`, `evaluation_metrics`) on startup.
3. If `DATABASE_URL` is omitted, the platform gracefully operates with live analysis active while indicating `Neon DB Offline` in the navigation header.
