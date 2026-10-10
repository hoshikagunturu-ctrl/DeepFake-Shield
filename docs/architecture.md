# DeepFakeShield — System Architecture

DeepFakeShield is a full-stack, multimodal deepfake detection and forensic analysis platform.

## High-Level Topology

```mermaid
flowchart TD
    subgraph Frontend ["Frontend (Vite / React 19 / TypeScript / Tailwind CSS)"]
        UI["Overview & Navigation"]
        Demo["Interactive Live Demo"]
        ArchView["Interactive Architecture Inspector"]
        ResultsView["Evaluation & Benchmark Metrics"]
        ResearchView["Methodology & Ethics"]
        AuditView["Forensic Analysis History"]
    end

    subgraph Backend ["Backend API (FastAPI / Pydantic v2 / Python 3.13)"]
        Router["/api Routes"]
        AudioDet["Audio Detector (WavLM-SpoofHead v1.4)"]
        VideoDet["Video Detector (FaceForensics-EffNet v4.0)"]
        ImageDet["Image Detector (ForensicVision-ResNet50 v2.1)"]
        FusionDet["Cross-Attention AV-Fusion v1.3"]
        EvalSvc["Evaluation & Benchmark Service"]
    end

    subgraph Storage ["Persistent Forensic Ledger"]
        NeonDB[("Neon Serverless PostgreSQL (SSL Pooler)")]
    end

    Frontend <-->|REST API / JSON| Backend
    Backend <-->|SQLAlchemy / psycopg2| Storage
```

## Modality Pipelines

### 1. Audio Stream
- **Input**: PCM Waveform (WAV, MP3, FLAC, OGG).
- **Preprocessing**: 16kHz resampling, zero-crossing rate (ZCR), spectral flatness, 12 frequency bands, 13 MFCC cepstral features.
- **Model**: WavLM representation encoder + trained spoof classification head.
- **Artifacts**: Phase vocoder inconsistencies, unnatural high-frequency roll-off, pitch jitter anomalies.

### 2. Visual Stream
- **Input**: Video frames (MP4, MOV, WEBM).
- **Preprocessing**: Keyframe extraction, face alignment, spatial normalization.
- **Model**: EfficientNet-B4 convolutional feature head.
- **Artifacts**: Poisson blending seams, corneal reflection asymmetry, temporal flickering.

### 3. Image Stream
- **Input**: Images (JPG, PNG, WEBP).
- **Preprocessing**: Channel variance analysis, high-frequency spatial edge filtering.
- **Model**: ForensicVision ResNet-50.
- **Artifacts**: Diffusion texture over-smoothing, chrominance imbalance, PRNU noise loss.

### 4. Cross-Attention Fusion
- Aligns phoneme timing with facial lip visemes.
- Discrepancy Gate: Flags modality-selective manipulation when |S_audio - S_video| > 0.45.
