import time
from typing import Generator, Optional, Dict, Any
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

Base = declarative_base()

engine = None
SessionLocal = None

def get_engine():
    global engine, SessionLocal
    if engine is not None:
        return engine
    
    url = settings.DATABASE_URL
    if not url:
        return None
    
    # Ensure proper dialect for PostgreSQL
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
        
    connect_args = {}
    if "postgresql" in url:
        # Neon requires SSL
        if "sslmode" not in url:
            connect_args["sslmode"] = "require"
            
    try:
        engine = create_engine(
            url,
            connect_args=connect_args,
            pool_pre_ping=True,
            pool_recycle=300,
        )
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        return engine
    except Exception as e:
        print(f"[DB] Error creating engine: {e}")
        return None

def get_db() -> Generator[Optional[Session], None, None]:
    get_engine()
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_db_health() -> Dict[str, Any]:
    url = settings.DATABASE_URL
    if not url:
        return {
            "status": "DISCONNECTED",
            "connected": False,
            "provider": "Neon PostgreSQL",
            "message": "DATABASE_URL environment variable is not configured. Add your rotated Neon PostgreSQL connection string to backend/.env",
            "latency_ms": None,
        }
        
    eng = get_engine()
    if not eng:
        return {
            "status": "ERROR",
            "connected": False,
            "provider": "Neon PostgreSQL",
            "message": "Failed to initialize SQLAlchemy database engine.",
            "latency_ms": None,
        }
        
    try:
        t0 = time.time()
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        latency = round((time.time() - t0) * 1000, 2)
        return {
            "status": "READY",
            "connected": True,
            "provider": "Neon PostgreSQL",
            "message": "Successfully connected and verified Neon PostgreSQL via SELECT 1",
            "latency_ms": latency,
        }
    except Exception as e:
        return {
            "status": "DISCONNECTED",
            "connected": False,
            "provider": "Neon PostgreSQL",
            "message": f"Connection check failed: {str(e)}",
            "latency_ms": None,
        }

def init_db():
    """Create database tables if engine is connected"""
    eng = get_engine()
    if eng:
        try:
            Base.metadata.create_all(bind=eng)
            print("[DB] Tables created or verified successfully.")
            return True
        except Exception as e:
            print(f"[DB] Failed to create tables: {e}")
            return False
    return False
