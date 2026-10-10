from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.endpoints import router as api_router
from app.db.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: attempt database table migration/creation if connected
    print(f"[*] Starting {settings.PROJECT_NAME} API Server...")
    init_db()
    yield
    print(f"[*] Shutting down {settings.PROJECT_NAME} API Server.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Multimodal Deepfake Detection and Forensic Analysis Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "platform": settings.PROJECT_NAME,
        "status": "ONLINE",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
