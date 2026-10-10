import os
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "DeepFakeShield"
    API_V1_STR: str = "/api"
    # Neon PostgreSQL database URL
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    # Upload limits
    MAX_FILE_SIZE_BYTES: int = 50 * 1024 * 1024  # 50 MB
    
    # Allowed formats
    ALLOWED_AUDIO_EXTENSIONS: List[str] = [".wav", ".mp3", ".ogg", ".flac", ".m4a"]
    ALLOWED_VIDEO_EXTENSIONS: List[str] = [".mp4", ".mov", ".avi", ".webm"]
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".webp"]
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

settings = Settings()
