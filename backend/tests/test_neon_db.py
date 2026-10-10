import unittest
import os
from app.db.database import check_db_health, get_engine, SessionLocal, Base
from app.db.models import AnalysisRecord
from app.core.config import settings

class TestNeonDatabaseIntegration(unittest.TestCase):
    def test_database_health_check_function(self):
        health = check_db_health()
        self.assertIn("status", health)
        self.assertIn("provider", health)
        self.assertEqual(health["provider"], "Neon PostgreSQL")
        # When unconfigured, reports disconnected cleanly
        if not settings.DATABASE_URL:
            self.assertFalse(health["connected"])
            self.assertEqual(health["status"], "DISCONNECTED")

    def test_database_schema_definitions(self):
        # Verify required tables are registered in SQLAlchemy metadata
        table_names = list(Base.metadata.tables.keys())
        self.assertIn("analysis_records", table_names)
        self.assertIn("model_registry", table_names)
        self.assertIn("evaluation_runs", table_names)
        self.assertIn("evaluation_metrics", table_names)

        # Verify required columns on analysis_records
        columns = [c.name for c in Base.metadata.tables["analysis_records"].columns]
        required_cols = [
            "id", "created_at", "media_type", "filename", "file_size_bytes",
            "status", "classification", "raw_score", "score_interpretation",
            "model_versions", "evidence_summary", "processing_duration_ms"
        ]
        for col in required_cols:
            self.assertIn(col, columns)

if __name__ == "__main__":
    unittest.main()
