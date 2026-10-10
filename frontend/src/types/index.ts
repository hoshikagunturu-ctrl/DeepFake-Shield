export type TabType = 'audio' | 'video' | 'image' | 'multimodal';
export type PageType = 'overview' | 'architecture' | 'demo' | 'results' | 'research' | 'history';

export type ClassificationType = 
  | 'AI_GENERATED'
  | 'MANIPULATED'
  | 'LIKELY_AUTHENTIC'
  | 'INCONCLUSIVE'
  | 'MODEL_UNAVAILABLE'
  | 'ANALYSIS_ERROR';

export interface ModalityResult {
  modality: string;
  model_name: string;
  model_version: string;
  status: string;
  classification: ClassificationType;
  raw_score: number | null;
  confidence_percentage: number | null;
  evidence: Record<string, any>;
  limitations: string[];
  processing_time_ms: number | null;
}

export interface AnalysisResponse {
  analysis_id: string;
  filename: string;
  media_type: string;
  file_size_bytes: number;
  processing_status: string;
  actual_classification: ClassificationType;
  actual_model_score: number | null;
  confidence_percentage: number | null;
  score_interpretation: string;
  modality_outputs: Record<string, ModalityResult>;
  model_names_and_versions: Record<string, string>;
  supported_evidence: {
    duration_seconds?: number;
    sample_rate?: number;
    sample_count?: number;
    zero_crossing_rate?: number;
    spectral_flatness?: number;
    rms_energy?: number;
    harmonics_ratio?: number;
    frequency_bands?: number[];
    mfcc_features?: number[];
    spectral_heatmap?: number[][];
    interpretation?: string;
    audio_score?: number;
    fused_score?: number;
    video_score?: number;
    image_score?: number;
    dimensions?: string;
    channels?: number;
    format?: string;
    color_variance?: number;
    noise_consistency_metric?: number;
    detected_face_regions?: number;
    compression_blocking_index?: number;
    estimated_duration_sec?: number;
    total_frames_estimated?: number;
    sampled_frames?: number;
    sampling_rate_fps?: number;
    temporal_consistency_score?: number;
    face_tracking_tracked?: boolean;
    suspicious_frame_events?: Array<{ timestamp: string; confidence: number; label: string }>;
    [key: string]: any;
  };
  processing_duration_ms: number;
  timestamp: string;
  limitations: string[];
  persistence_status: string;
  sanitized_error_details?: string | null;
}

export interface DatabaseHealth {
  status: 'READY' | 'DISCONNECTED' | 'ERROR' | 'DEGRADED';
  connected: boolean;
  provider: string;
  message: string;
  latency_ms: number | null;
}

export interface SystemHealth {
  status: string;
  api_ready: boolean;
  database: DatabaseHealth;
  detectors: Record<string, string>;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  created_at: string;
  media_type: string;
  filename: string;
  file_size_bytes: number;
  status: string;
  classification: string | null;
  raw_score: number | null;
  score_interpretation: string | null;
  audio_classification: string | null;
  video_classification: string | null;
  image_classification: string | null;
  fusion_classification: string | null;
  model_versions: Record<string, any>;
  evidence_summary: Record<string, any>;
  processing_duration_ms: number | null;
  persistence_status: string;
}

export interface EvaluationSummary {
  operational: {
    total_analyses: number;
    completed_analyses: number;
    failed_analyses: number;
    database_connected: boolean;
    avg_inference_ms: number;
  };
  kpis: {
    best_audio_accuracy: number;
    best_video_accuracy: number;
    multimodal_f1: number;
    inference_speed_ms: number;
  };
  benchmarks: Record<string, any>;
  model_comparisons: Array<{
    model: string;
    accuracy: number;
    eer: number;
    type: string;
  }>;
  radar_metrics: Array<{
    metric: string;
    ours: number;
    baseline: number;
  }>;
}
