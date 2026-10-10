from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Depends
from typing import Optional, List
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.schemas.analysis import (
    AnalysisResponse, SystemHealthResponse, DatabaseHealthResponse,
    ModelInfo, HistoryListResponse, HistoryItemResponse
)
from app.db.database import check_db_health, get_engine, SessionLocal
from app.db.models import AnalysisRecord, ModelRegistry
from app.services.analysis_service import analysis_service
from app.evaluation.eval_service import evaluation_service

router = APIRouter()

# ----------------- Health & Status -----------------
@router.get("/health", response_model=SystemHealthResponse)
def get_health():
    db_health = check_db_health()
    return SystemHealthResponse(
        status="HEALTHY" if db_health["connected"] else "DEGRADED",
        api_ready=True,
        database=DatabaseHealthResponse(**db_health),
        detectors={
            "audio": "READY (WavLM-SpoofHead-v1.4)",
            "video": "READY (FaceForensics-EfficientNet-B4)",
            "image": "READY (ForensicVision-ResNet50-v2.1)",
            "fusion": "READY (CrossAttention-AVFusion-v1.3)"
        },
        timestamp=datetime.now(timezone.utc)
    )

@router.get("/health/database", response_model=DatabaseHealthResponse)
def get_database_health():
    db_health = check_db_health()
    return DatabaseHealthResponse(**db_health)

@router.get("/models", response_model=List[ModelInfo])
def get_registered_models():
    return [
        ModelInfo(
            model_key="wavlm_spoofhead_v1.4",
            model_name="WavLM-SpoofHead",
            model_version="1.4.2",
            modality="audio",
            model_source="Microsoft/WavLM + Custom Spoof Classification Head",
            actual_status="READY",
            supported_labels=["AI_GENERATED", "LIKELY_AUTHENTIC", "INCONCLUSIVE"],
            limitations="Optimized for ASVspoof 2019/2021 logical access and neural TTS artifacts."
        ),
        ModelInfo(
            model_key="faceforensics_effnet_b4",
            model_name="FaceForensics-EfficientNet-B4",
            model_version="4.0.1",
            modality="video",
            model_source="FaceForensics++ Pretrained Checkpoint",
            actual_status="READY",
            supported_labels=["AI_GENERATED", "LIKELY_AUTHENTIC", "MANIPULATED"],
            limitations="Focuses on facial boundary discontinuities and temporal warping."
        ),
        ModelInfo(
            model_key="forensic_vision_resnet50",
            model_name="ForensicVision-ResNet50",
            model_version="2.1.0",
            modality="image",
            model_source="GenImage / DiffusionForensics Trained Weights",
            actual_status="READY",
            supported_labels=["AI_GENERATED", "LIKELY_AUTHENTIC", "MANIPULATED"],
            limitations="Sensitive to heavy JPEG re-compression and social media stripping."
        ),
        ModelInfo(
            model_key="cross_attention_avfusion",
            model_name="CrossAttention-AVFusion",
            model_version="1.3.0",
            modality="multimodal",
            model_source="Dual-stream Cross-Attention Weights",
            actual_status="READY",
            supported_labels=["AI_GENERATED", "LIKELY_AUTHENTIC", "INCONCLUSIVE"],
            limitations="Requires temporal correspondence between audio phonemes and facial visemes."
        ),
    ]

# ----------------- Analysis Endpoints -----------------
@router.post("/analyze/audio", response_model=AnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
    return analysis_service.analyze_audio(content, file.filename or "audio_file.wav", len(content))

@router.post("/analyze/video", response_model=AnalysisResponse)
async def analyze_video(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
    return analysis_service.analyze_video(content, file.filename or "video_file.mp4", len(content))

@router.post("/analyze/image", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
    return analysis_service.analyze_image(content, file.filename or "image_file.jpg", len(content))

@router.post("/analyze/multimodal", response_model=AnalysisResponse)
async def analyze_multimodal(
    file: UploadFile = File(...),
    audio_track: Optional[UploadFile] = File(None)
):
    media_content = await file.read()
    if len(media_content) == 0:
        raise HTTPException(status_code=400, detail="Empty media file uploaded.")
        
    audio_content = None
    if audio_track:
        audio_content = await audio_track.read()
        
    return analysis_service.analyze_multimodal(
        media_content,
        file.filename or "multimodal_media.mp4",
        len(media_content),
        audio_content
    )

# ----------------- History Endpoints -----------------
@router.get("/history", response_model=HistoryListResponse)
def get_analysis_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    media_type: Optional[str] = None,
    classification: Optional[str] = None,
    search: Optional[str] = None
):
    eng = get_engine()
    if not eng or not SessionLocal:
        # DB offline or not configured
        return HistoryListResponse(total=0, page=page, page_size=page_size, items=[])
        
    session: Session = SessionLocal()
    try:
        query = session.query(AnalysisRecord)
        if media_type:
            query = query.filter(AnalysisRecord.media_type == media_type.lower())
        if classification:
            query = query.filter(AnalysisRecord.classification == classification)
        if search:
            query = query.filter(
                (AnalysisRecord.filename.ilike(f"%{search}%")) |
                (AnalysisRecord.id.ilike(f"%{search}%"))
            )
            
        total = query.count()
        records = (
            query.order_by(AnalysisRecord.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        
        items = [
            HistoryItemResponse(
                id=r.id,
                created_at=r.created_at,
                media_type=r.media_type,
                filename=r.filename,
                file_size_bytes=r.file_size_bytes,
                status=r.status,
                classification=r.classification,
                raw_score=r.raw_score,
                score_interpretation=r.score_interpretation,
                audio_classification=r.audio_classification,
                video_classification=r.video_classification,
                image_classification=r.image_classification,
                fusion_classification=r.fusion_classification,
                model_versions=r.model_versions or {},
                evidence_summary=r.evidence_summary or {},
                processing_duration_ms=r.processing_duration_ms,
                persistence_status="PERSISTED"
            )
            for r in records
        ]
        return HistoryListResponse(total=total, page=page, page_size=page_size, items=items)
    except Exception as e:
        print(f"[DB] Error fetching history: {e}")
        return HistoryListResponse(total=0, page=page, page_size=page_size, items=[])
    finally:
        session.close()

@router.get("/history/{record_id}", response_model=HistoryItemResponse)
def get_history_detail(record_id: str):
    eng = get_engine()
    if not eng or not SessionLocal:
        raise HTTPException(status_code=503, detail="Database is not connected.")
    session: Session = SessionLocal()
    try:
        r = session.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
        if not r:
            raise HTTPException(status_code=404, detail="Record not found.")
        return HistoryItemResponse(
            id=r.id,
            created_at=r.created_at,
            media_type=r.media_type,
            filename=r.filename,
            file_size_bytes=r.file_size_bytes,
            status=r.status,
            classification=r.classification,
            raw_score=r.raw_score,
            score_interpretation=r.score_interpretation,
            audio_classification=r.audio_classification,
            video_classification=r.video_classification,
            image_classification=r.image_classification,
            fusion_classification=r.fusion_classification,
            model_versions=r.model_versions or {},
            evidence_summary=r.evidence_summary or {},
            processing_duration_ms=r.processing_duration_ms,
            persistence_status="PERSISTED"
        )
    finally:
        session.close()

@router.delete("/history/{record_id}")
def delete_history_record(record_id: str):
    eng = get_engine()
    if not eng or not SessionLocal:
        raise HTTPException(status_code=503, detail="Database is not connected.")
    session: Session = SessionLocal()
    try:
        r = session.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
        if not r:
            raise HTTPException(status_code=404, detail="Record not found.")
        session.delete(r)
        session.commit()
        return {"success": True, "message": f"Deleted analysis record {record_id}"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()

# ----------------- Evaluation Endpoints -----------------
@router.get("/evaluation/summary")
def get_evaluation_summary():
    return evaluation_service.get_summary()
