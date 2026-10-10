from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class ClassificationEnum(str, Enum):
    AI_GENERATED = "AI_GENERATED"
    MANIPULATED = "MANIPULATED"
    LIKELY_AUTHENTIC = "LIKELY_AUTHENTIC"
    INCONCLUSIVE = "INCONCLUSIVE"
    MODEL_UNAVAILABLE = "MODEL_UNAVAILABLE"
    ANALYSIS_ERROR = "ANALYSIS_ERROR"

class ModalityResult(BaseModel):
    modality: str  # audio, video, image, fusion
    model_name: str
    model_version: str
    status: str  # READY, MODEL_UNAVAILABLE, COMPLETED, FAILED
    classification: Optional[ClassificationEnum] = None
    raw_score: Optional[float] = None
    confidence_percentage: Optional[float] = None
    evidence: Dict[str, Any] = Field(default_factory=dict)
    limitations: List[str] = Field(default_factory=list)
    processing_time_ms: Optional[float] = None

class AnalysisResponse(BaseModel):
    analysis_id: str
    filename: str
    media_type: str
    file_size_bytes: int
    processing_status: str  # COMPLETED, FAILED, PARTIAL
    actual_classification: ClassificationEnum
    actual_model_score: Optional[float] = None
    confidence_percentage: Optional[float] = None
    score_interpretation: str
    modality_outputs: Dict[str, ModalityResult] = Field(default_factory=dict)
    model_names_and_versions: Dict[str, str] = Field(default_factory=dict)
    supported_evidence: Dict[str, Any] = Field(default_factory=dict)
    processing_duration_ms: float
    timestamp: datetime
    limitations: List[str] = Field(default_factory=list)
    persistence_status: str  # PERSISTED, PERSISTENCE_FAILED, DB_OFFLINE
    sanitized_error_details: Optional[str] = None

class ModelInfo(BaseModel):
    model_key: str
    model_name: str
    model_version: str
    modality: str
    model_source: str
    actual_status: str  # READY, DEGRADED, MODEL_UNAVAILABLE, NOT_IMPLEMENTED, ERROR
    supported_labels: List[str]
    limitations: str

class DatabaseHealthResponse(BaseModel):
    status: str
    connected: bool
    provider: str
    message: str
    latency_ms: Optional[float] = None

class SystemHealthResponse(BaseModel):
    status: str
    api_ready: bool
    database: DatabaseHealthResponse
    detectors: Dict[str, str]
    timestamp: datetime

class HistoryItemResponse(BaseModel):
    id: str
    created_at: datetime
    media_type: str
    filename: str
    file_size_bytes: int
    status: str
    classification: Optional[str] = None
    raw_score: Optional[float] = None
    score_interpretation: Optional[str] = None
    audio_classification: Optional[str] = None
    video_classification: Optional[str] = None
    image_classification: Optional[str] = None
    fusion_classification: Optional[str] = None
    model_versions: Dict[str, Any] = Field(default_factory=dict)
    evidence_summary: Dict[str, Any] = Field(default_factory=dict)
    processing_duration_ms: Optional[float] = None
    persistence_status: str = "PERSISTED"

class HistoryListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[HistoryItemResponse]
