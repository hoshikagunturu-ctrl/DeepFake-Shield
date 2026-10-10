import unittest
import os
import io
import json
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import check_db_health, Base, engine, get_engine
from app.db.models import AnalysisRecord
from app.detectors.audio_detector import audio_detector
from app.detectors.video_detector import video_detector
from app.detectors.image_detector import image_detector
from app.detectors.fusion_detector import fusion_detector
from app.schemas.analysis import ClassificationEnum

class TestDeepFakeShield(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["api_ready"])
        self.assertIn("database", data)
        self.assertIn("detectors", data)
        self.assertIn("audio", data["detectors"])

    def test_database_health_endpoint(self):
        response = self.client.get("/api/health/database")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("status", data)
        self.assertIn("provider", data)
        self.assertEqual(data["provider"], "Neon PostgreSQL")

    def test_model_registry_endpoint(self):
        response = self.client.get("/api/models")
        self.assertEqual(response.status_code, 200)
        models = response.json()
        self.assertGreaterEqual(len(models), 4)
        model_keys = [m["model_key"] for m in models]
        self.assertIn("wavlm_spoofhead_v1.4", model_keys)
        self.assertIn("faceforensics_effnet_b4", model_keys)
        self.assertIn("forensic_vision_resnet50", model_keys)
        self.assertIn("cross_attention_avfusion", model_keys)

    def test_audio_analysis_pipeline(self):
        # Create small test wav bytes
        import wave, struct
        buf = io.BytesIO()
        with wave.open(buf, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(16000)
            data = bytearray()
            for i in range(16000):
                data.extend(struct.pack('<h', int(1000 * (i % 20 - 10))))
            wf.writeframes(data)
        buf.seek(0)

        response = self.client.post(
            "/api/analyze/audio",
            files={"file": ("test_speech.wav", buf, "audio/wav")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["media_type"], "audio")
        self.assertIn(data["actual_classification"], [e.value for e in ClassificationEnum])
        self.assertIn("spectral_heatmap", data["supported_evidence"])
        self.assertIn("frequency_bands", data["supported_evidence"])
        self.assertIn("mfcc_features", data["supported_evidence"])

    def test_image_analysis_pipeline(self):
        from PIL import Image
        img = Image.new("RGB", (100, 100), color=(128, 128, 128))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        buf.seek(0)

        response = self.client.post(
            "/api/analyze/image",
            files={"file": ("test_photo.jpg", buf, "image/jpeg")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["media_type"], "image")
        self.assertIn(data["actual_classification"], [e.value for e in ClassificationEnum])
        self.assertIsNotNone(data["confidence_percentage"])

    def test_video_analysis_pipeline(self):
        # Minimal mp4 header simulation
        fake_mp4 = b"\x00\x00\x00\x1cftypisom\x00\x00\x02\x00isomiso2mp41" + b"\x00" * 4000
        response = self.client.post(
            "/api/analyze/video",
            files={"file": ("test_clip.mp4", io.BytesIO(fake_mp4), "video/mp4")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["media_type"], "video")
        self.assertIn(data["actual_classification"], [e.value for e in ClassificationEnum])

    def test_multimodal_analysis_pipeline(self):
        fake_media = b"\x00\x00\x00\x1cftypisom\x00\x00\x02\x00isomiso2mp41" + b"\x00" * 8000
        response = self.client.post(
            "/api/analyze/multimodal",
            files={"file": ("test_paired.mp4", io.BytesIO(fake_media), "video/mp4")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["media_type"], "multimodal")
        self.assertIn("audio", data["modality_outputs"])
        self.assertIn("video", data["modality_outputs"])
        self.assertIn("fusion", data["modality_outputs"])

    def test_evaluation_summary_endpoint(self):
        response = self.client.get("/api/evaluation/summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("kpis", data)
        self.assertIn("benchmarks", data)
        self.assertEqual(data["kpis"]["best_audio_accuracy"], 97.3)
        self.assertEqual(data["kpis"]["best_video_accuracy"], 96.8)

    def test_empty_file_rejection(self):
        response = self.client.post(
            "/api/analyze/audio",
            files={"file": ("empty.wav", io.BytesIO(b""), "audio/wav")}
        )
        self.assertEqual(response.status_code, 400)

if __name__ == "__main__":
    unittest.main()
