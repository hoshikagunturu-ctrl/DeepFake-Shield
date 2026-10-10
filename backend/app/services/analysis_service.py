import uuid
import time
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session

from app.schemas.analysis import AnalysisResponse, ClassificationEnum, ModalityResult
from app.detectors.audio_detector import audio_detector
from app.detectors.video_detector import video_detector
from app.detectors.image_detector import image_detector
from app.detectors.fusion_detector import fusion_detector
from app.db.database import SessionLocal, get_engine
from app.db.models import AnalysisRecord

class AnalysisService:
    def analyze_audio(self, file_bytes: bytes, filename: str, file_size: int) -> AnalysisResponse:
        t0 = time.time()
        audio_res = audio_detector.analyze_audio_bytes(file_bytes, filename)
        fusion_res = fusion_detector.fuse(audio_result=audio_res, video_result=None)
        
        duration_ms = round((time.time() - t0) * 1000, 2)
        analysis_id = str(uuid.uuid4())
        
        classification = fusion_res.classification or audio_res.classification or ClassificationEnum.INCONCLUSIVE
        raw_score = fusion_res.raw_score if fusion_res.raw_score is not None else audio_res.raw_score
        conf_pct = fusion_res.confidence_percentage if fusion_res.confidence_percentage is not None else audio_res.confidence_percentage
        
        # Build evidence
        evidence = audio_res.evidence.copy()
        evidence["audio_score"] = audio_res.raw_score
        evidence["fused_score"] = fusion_res.raw_score
        
        response = AnalysisResponse(
            analysis_id=analysis_id,
            filename=filename,
            media_type="audio",
            file_size_bytes=file_size,
            processing_status="COMPLETED",
            actual_classification=classification,
            actual_model_score=raw_score,
            confidence_percentage=conf_pct,
            score_interpretation=audio_res.evidence.get("interpretation", "Audio acoustic analysis completed."),
            modality_outputs={
                "audio": audio_res,
                "fusion": fusion_res
            },
            model_names_and_versions={
                "audio": f"{audio_res.model_name} ({audio_res.model_version})",
                "fusion": f"{fusion_res.model_name} ({fusion_res.model_version})"
            },
            supported_evidence=evidence,
            processing_duration_ms=duration_ms,
            timestamp=datetime.now(timezone.utc),
            limitations=audio_res.limitations,
            persistence_status="PENDING"
        )
        
        response.persistence_status = self._persist_record(response)
        return response

    def analyze_video(self, file_bytes: bytes, filename: str, file_size: int) -> AnalysisResponse:
        t0 = time.time()
        video_res = video_detector.analyze_video_bytes(file_bytes, filename)
        fusion_res = fusion_detector.fuse(audio_result=None, video_result=video_res)
        
        duration_ms = round((time.time() - t0) * 1000, 2)
        analysis_id = str(uuid.uuid4())
        
        classification = fusion_res.classification or video_res.classification or ClassificationEnum.INCONCLUSIVE
        raw_score = fusion_res.raw_score if fusion_res.raw_score is not None else video_res.raw_score
        conf_pct = fusion_res.confidence_percentage if fusion_res.confidence_percentage is not None else video_res.confidence_percentage

        evidence = video_res.evidence.copy()
        evidence["video_score"] = video_res.raw_score
        evidence["fused_score"] = fusion_res.raw_score

        response = AnalysisResponse(
            analysis_id=analysis_id,
            filename=filename,
            media_type="video",
            file_size_bytes=file_size,
            processing_status="COMPLETED",
            actual_classification=classification,
            actual_model_score=raw_score,
            confidence_percentage=conf_pct,
            score_interpretation=video_res.evidence.get("interpretation", "Video forensic analysis completed."),
            modality_outputs={
                "video": video_res,
                "fusion": fusion_res
            },
            model_names_and_versions={
                "video": f"{video_res.model_name} ({video_res.model_version})",
                "fusion": f"{fusion_res.model_name} ({fusion_res.model_version})"
            },
            supported_evidence=evidence,
            processing_duration_ms=duration_ms,
            timestamp=datetime.now(timezone.utc),
            limitations=video_res.limitations,
            persistence_status="PENDING"
        )
        
        response.persistence_status = self._persist_record(response)
        return response

    def analyze_image(self, file_bytes: bytes, filename: str, file_size: int) -> AnalysisResponse:
        t0 = time.time()
        image_res = image_detector.analyze_image_bytes(file_bytes, filename)
        fusion_res = fusion_detector.fuse(audio_result=None, video_result=None, image_result=image_res)
        
        duration_ms = round((time.time() - t0) * 1000, 2)
        analysis_id = str(uuid.uuid4())
        
        classification = image_res.classification or ClassificationEnum.INCONCLUSIVE
        raw_score = image_res.raw_score
        conf_pct = image_res.confidence_percentage

        evidence = image_res.evidence.copy()
        evidence["image_score"] = image_res.raw_score
        evidence["fused_score"] = fusion_res.raw_score

        response = AnalysisResponse(
            analysis_id=analysis_id,
            filename=filename,
            media_type="image",
            file_size_bytes=file_size,
            processing_status="COMPLETED",
            actual_classification=classification,
            actual_model_score=raw_score,
            confidence_percentage=conf_pct,
            score_interpretation=image_res.evidence.get("interpretation", "Image artifact forensic analysis completed."),
            modality_outputs={
                "image": image_res,
                "fusion": fusion_res
            },
            model_names_and_versions={
                "image": f"{image_res.model_name} ({image_res.model_version})",
                "fusion": f"{fusion_res.model_name} ({fusion_res.model_version})"
            },
            supported_evidence=evidence,
            processing_duration_ms=duration_ms,
            timestamp=datetime.now(timezone.utc),
            limitations=image_res.limitations,
            persistence_status="PENDING"
        )
        
        response.persistence_status = self._persist_record(response)
        return response

    def analyze_multimodal(
        self,
        media_bytes: bytes,
        filename: str,
        file_size: int,
        audio_track_bytes: Optional[bytes] = None
    ) -> AnalysisResponse:
        t0 = time.time()
        
        # Audio extraction or separate audio track
        audio_res = audio_detector.analyze_audio_bytes(audio_track_bytes or media_bytes, f"audio_{filename}")
        video_res = video_detector.analyze_video_bytes(media_bytes, filename)
        fusion_res = fusion_detector.fuse(audio_result=audio_res, video_result=video_res)
        
        duration_ms = round((time.time() - t0) * 1000, 2)
        analysis_id = str(uuid.uuid4())
        
        classification = fusion_res.classification or ClassificationEnum.INCONCLUSIVE
        raw_score = fusion_res.raw_score
        conf_pct = fusion_res.confidence_percentage

        evidence = {
            "audio": audio_res.evidence,
            "video": video_res.evidence,
            "fusion": fusion_res.evidence,
            "spectral_heatmap": audio_res.evidence.get("spectral_heatmap", []),
            "frequency_bands": audio_res.evidence.get("frequency_bands", []),
            "mfcc_features": audio_res.evidence.get("mfcc_features", []),
            "audio_score": audio_res.raw_score,
            "video_score": video_res.raw_score,
            "fused_score": fusion_res.raw_score,
        }

        all_limitations = list(dict.fromkeys(audio_res.limitations + video_res.limitations + fusion_res.limitations))

        response = AnalysisResponse(
            analysis_id=analysis_id,
            filename=filename,
            media_type="multimodal",
            file_size_bytes=file_size,
            processing_status="COMPLETED",
            actual_classification=classification,
            actual_model_score=raw_score,
            confidence_percentage=conf_pct,
            score_interpretation=fusion_res.evidence.get("interpretation", "Multimodal audio-visual cross-attention analysis completed."),
            modality_outputs={
                "audio": audio_res,
                "video": video_res,
                "fusion": fusion_res
            },
            model_names_and_versions={
                "audio": f"{audio_res.model_name} ({audio_res.model_version})",
                "video": f"{video_res.model_name} ({video_res.model_version})",
                "fusion": f"{fusion_res.model_name} ({fusion_res.model_version})"
            },
            supported_evidence=evidence,
            processing_duration_ms=duration_ms,
            timestamp=datetime.now(timezone.utc),
            limitations=all_limitations,
            persistence_status="PENDING"
        )
        
        response.persistence_status = self._persist_record(response)
        return response

    def _persist_record(self, res: AnalysisResponse) -> str:
        eng = get_engine()
        if not eng or not SessionLocal:
            return "DB_OFFLINE: DATABASE_URL not connected"
            
        session: Session = SessionLocal()
        try:
            record = AnalysisRecord(
                id=res.analysis_id,
                created_at=res.timestamp,
                media_type=res.media_type,
                filename=res.filename,
                file_size_bytes=res.file_size_bytes,
                status=res.processing_status,
                classification=res.actual_classification.value,
                raw_score=res.actual_model_score,
                score_interpretation=res.score_interpretation,
                audio_classification=res.modality_outputs.get("audio", {}).classification.value if "audio" in res.modality_outputs and res.modality_outputs["audio"].classification else None,
                video_classification=res.modality_outputs.get("video", {}).classification.value if "video" in res.modality_outputs and res.modality_outputs["video"].classification else None,
                image_classification=res.modality_outputs.get("image", {}).classification.value if "image" in res.modality_outputs and res.modality_outputs["image"].classification else None,
                fusion_classification=res.modality_outputs.get("fusion", {}).classification.value if "fusion" in res.modality_outputs and res.modality_outputs["fusion"].classification else None,
                model_versions=res.model_names_and_versions,
                evidence_summary={
                    k: v for k, v in res.supported_evidence.items() 
                    if k not in ["spectral_heatmap"]  # Keep db size lean
                },
                processing_duration_ms=res.processing_duration_ms,
                error_code=None,
                error_message=None
            )
            session.add(record)
            session.commit()
            return "PERSISTED"
        except Exception as e:
            session.rollback()
            print(f"[DB] Persistence error: {e}")
            return f"PERSISTENCE_FAILED: {str(e)}"
        finally:
            session.close()

analysis_service = AnalysisService()
