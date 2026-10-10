import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, BigInteger, Text, DateTime, JSON, ForeignKey, Integer, Index
from sqlalchemy.orm import relationship
from app.db.database import Base

def get_utc_now():
    return datetime.now(timezone.utc)

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False, index=True)
    media_type = Column(String(32), nullable=False, index=True)  # audio, video, image, multimodal
    filename = Column(String(255), nullable=False)
    file_size_bytes = Column(BigInteger, nullable=False)
    status = Column(String(32), nullable=False, index=True)  # COMPLETED, FAILED, PROCESSING
    
    # Standardized classification
    classification = Column(String(64), nullable=True, index=True)  # AI_GENERATED, MANIPULATED, LIKELY_AUTHENTIC, INCONCLUSIVE, MODEL_UNAVAILABLE, ANALYSIS_ERROR
    raw_score = Column(Float, nullable=True)
    score_interpretation = Column(Text, nullable=True)
    
    # Modality-specific classifications
    audio_classification = Column(String(64), nullable=True)
    video_classification = Column(String(64), nullable=True)
    image_classification = Column(String(64), nullable=True)
    fusion_classification = Column(String(64), nullable=True)
    
    # Rich metadata
    model_versions = Column(JSON, nullable=False, default=dict)
    evidence_summary = Column(JSON, nullable=False, default=dict)
    processing_duration_ms = Column(Float, nullable=True)
    
    # Error tracking
    error_code = Column(String(64), nullable=True)
    error_message = Column(Text, nullable=True)
    created_by = Column(String(128), nullable=True)

    __table_args__ = (
        Index("idx_records_media_created", "media_type", "created_at"),
    )


class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(Integer, primary_key=True, autoincrement=True)
    model_key = Column(String(64), unique=True, nullable=False, index=True)
    model_name = Column(String(128), nullable=False)
    model_version = Column(String(32), nullable=False)
    modality = Column(String(32), nullable=False)  # audio, video, image, multimodal
    model_source = Column(String(255), nullable=False)
    actual_status = Column(String(32), nullable=False)  # READY, DEGRADED, MODEL_UNAVAILABLE, NOT_IMPLEMENTED, ERROR
    supported_labels = Column(JSON, nullable=False, default=list)
    limitations = Column(Text, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)


class EvaluationRun(Base):
    __tablename__ = "evaluation_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    dataset_name = Column(String(128), nullable=False)
    dataset_version = Column(String(32), nullable=False)
    model_key = Column(String(64), nullable=False, index=True)
    dataset_split = Column(String(32), nullable=False)  # test, val, held_out
    start_time = Column(DateTime(timezone=True), default=get_utc_now)
    completion_time = Column(DateTime(timezone=True), default=get_utc_now)
    status = Column(String(32), nullable=False)  # COMPLETED, FAILED
    sample_count = Column(Integer, nullable=False)
    configuration = Column(JSON, nullable=False, default=dict)

    metrics = relationship("EvaluationMetric", back_populates="run", cascade="all, delete-orphan")


class EvaluationMetric(Base):
    __tablename__ = "evaluation_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    evaluation_run_id = Column(String(36), ForeignKey("evaluation_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    metric_name = Column(String(64), nullable=False)  # Accuracy, Precision, Recall, F1, EER, ROC-AUC
    metric_value = Column(Float, nullable=False)
    positive_class = Column(String(32), nullable=False)
    notes = Column(Text, nullable=True)

    run = relationship("EvaluationRun", back_populates="metrics")
