# DeepFakeShield — API Specification

The API server runs on port 8000 under the `/api` prefix.

## Endpoints

### Health & System Status
- `GET /api/health`: Returns overall status, database connectivity, and detector states.
- `GET /api/health/database`: Performs real `SELECT 1` check on Neon PostgreSQL and returns latency.
- `GET /api/models`: Returns list of registered model metadata, versions, and limitations.

### Forensic Analysis
- `POST /api/analyze/audio`: Multipart file upload (WAV, MP3, FLAC, OGG). Returns spectral features, heatmap, and WavLM classification.
- `POST /api/analyze/video`: Multipart file upload (MP4, MOV, WEBM). Returns temporal face anomaly metrics.
- `POST /api/analyze/image`: Multipart file upload (JPG, PNG, WEBP). Returns spatial noise and generative AI score.
- `POST /api/analyze/multimodal`: Multipart file upload (video + optional separate audio track). Returns cross-attention fused score and modality discrepancy metrics.

### History & Auditing
- `GET /api/history`: Paginated list of analysis records with media type, classification, and search filters.
- `GET /api/history/{id}`: Detailed record payload including model versions and evidence summaries.
- `DELETE /api/history/{id}`: Deletes record from Neon PostgreSQL.

### Benchmarks & Evaluation
- `GET /api/evaluation/summary`: Returns operational counters, KPI cards, model comparisons, and benchmark datasets.
