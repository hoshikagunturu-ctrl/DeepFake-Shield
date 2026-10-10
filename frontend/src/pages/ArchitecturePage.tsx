import React, { useState } from 'react';
import {
  Layers,
  Mic,
  Video,
  Brain,
  Network,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  ChevronRight,
  X,
  Cpu,
  Workflow,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { PageType } from '../types';

interface ArchitecturePageProps {
  onNavigate: (page: PageType) => void;
}

interface NodeDetail {
  id: string;
  name: string;
  subtitle: string;
  stream: 'audio' | 'visual' | 'fusion' | 'persistence';
  modelKey: string;
  version: string;
  status: 'READY' | 'ACTIVE';
  tensorShape: string;
  inputs: string[];
  outputs: string[];
  description: string;
  limitations: string[];
}

export const ArchitecturePage: React.FC<ArchitecturePageProps> = ({ onNavigate }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('wavlm');

  const nodes: Record<string, NodeDetail> = {
    'audio-input': {
      id: 'audio-input',
      name: 'Audio Input',
      subtitle: 'Waveform / Spectrogram',
      stream: 'audio',
      modelKey: 'Preprocessing-AudioDecode',
      version: '1.2.0',
      status: 'READY',
      tensorShape: '[Batch, 1, 32000] @ 16kHz PCM mono',
      inputs: ['Raw audio files (WAV, MP3, FLAC, OGG)'],
      outputs: ['Normalized 16kHz floating-point acoustic samples'],
      description: 'Audio decoding engine with zero-crossing rate computation, spectral flatness normalization, and silence trimming.',
      limitations: ['Requires at least 0.5s duration for stable spectral moments.', 'Heavy telephone bandwidth (8kHz) loss requires upsampling.'],
    },
    'wavlm': {
      id: 'wavlm',
      name: 'WavLM',
      subtitle: 'Self-Supervised Features',
      stream: 'audio',
      modelKey: 'Microsoft/WavLM-Base-Plus',
      version: '1.4.2',
      status: 'ACTIVE',
      tensorShape: '[Batch, Time, 768] Representation',
      inputs: ['Normalized 16kHz audio waveform'],
      outputs: ['768-dimensional contextual speech representations across 12 transformer layers'],
      description: 'WavLM utilizes masked speech prediction and denoising pre-training to capture fine-grained phonetic and speaker vocal tract characteristics.',
      limitations: ['WavLM is an encoder, not a detector itself; requires downstream spoof classification head.', 'Computationally intensive without GPU acceleration.'],
    },
    'audio-encoder': {
      id: 'audio-encoder',
      name: 'Audio Encoder',
      subtitle: '768-dim Embedding',
      stream: 'audio',
      modelKey: 'WavLM-SpoofHead-Classifier',
      version: '1.4.2',
      status: 'READY',
      tensorShape: '[Batch, 768] Pooled Latent Vector',
      inputs: ['Layer-weighted WavLM hidden states'],
      outputs: ['Audio spoof probability logit & acoustic anomaly score'],
      description: 'Statistical pooling head with multi-layer perceptron trained on ASVspoof 2019/2021 protocols for neural speech synthesis detection.',
      limitations: ['Trained primarily on English and multilingual benchmark distributions.'],
    },
    'video-input': {
      id: 'video-input',
      name: 'Video Input',
      subtitle: 'Frames / Sequences',
      stream: 'visual',
      modelKey: 'VideoFrameSampler',
      version: '2.0.1',
      status: 'READY',
      tensorShape: '[Batch, Frames=16, 3, 224, 224] RGB',
      inputs: ['MP4, MOV, WEBM video files'],
      outputs: ['Uniformly sampled temporal keyframes and facial bounding boxes'],
      description: 'Safe decoding pipeline with face alignment and normalized temporal frame sequence extraction.',
      limitations: ['Low light or extreme head angles may reduce face detection recall.'],
    },
    'visual-extractor': {
      id: 'visual-extractor',
      name: 'Visual CNN / ViT',
      subtitle: 'Facial & Spatial Features',
      stream: 'visual',
      modelKey: 'EfficientNet-B4-Forensic',
      version: '4.0.1',
      status: 'READY',
      tensorShape: '[Batch, Frames, 1792] Feature Tensor',
      inputs: ['Aligned face crops and full scene frames'],
      outputs: ['High-level spatial artifact feature vectors across keyframes'],
      description: 'Convolutional feature extractor fine-tuned on FaceForensics++ to capture boundary blending artifacts and skin texture anomalies.',
      limitations: ['Face-swap models are distinct from whole-frame generative diffusion video.'],
    },
    'visual-encoder': {
      id: 'visual-encoder',
      name: 'Visual Encoder',
      subtitle: '512-dim Embedding',
      stream: 'visual',
      modelKey: 'Temporal-GRU-Aggregator',
      version: '4.0.1',
      status: 'READY',
      tensorShape: '[Batch, 512] Temporal Video Embedding',
      inputs: ['Sequence of 16 frame feature tensors'],
      outputs: ['Aggregated temporal video manipulation embedding'],
      description: 'Bidirectional temporal recurrent head measuring frame-to-frame coherence and blinking/micro-saccade consistency.',
      limitations: ['Videos shorter than 1 second offer limited temporal context.'],
    },
    'fusion-layer': {
      id: 'fusion-layer',
      name: 'Cross-Attention Fusion',
      subtitle: 'Multimodal Alignment Gate',
      stream: 'fusion',
      modelKey: 'CrossAttention-AVFusion-v1.3',
      version: '1.3.0',
      status: 'ACTIVE',
      tensorShape: '[Batch, 256] Fused Decision Representation',
      inputs: ['Audio embedding (768-dim)', 'Visual embedding (512-dim)'],
      outputs: ['Fused forgery probability & modality conflict score'],
      description: 'Cross-attention mechanism that aligns phoneme acoustics with facial lip visemes and weights modality-selective manipulation.',
      limitations: ['Requires synchronized audio-video streams; falls back to single-stream Bayesian prior if audio track is absent.'],
    },
    'persistence-layer': {
      id: 'persistence-layer',
      name: 'Neon PostgreSQL',
      subtitle: 'Forensic Audit Database',
      stream: 'persistence',
      modelKey: 'Neon-Cloud-PostgreSQL',
      version: '16.0 (SSL Pooler)',
      status: 'READY',
      tensorShape: 'Relational Schema (analysis_records, model_registry)',
      inputs: ['Structured AnalysisResponse payload, metadata, scores'],
      outputs: ['Immutable forensic analysis records & historical audits'],
      description: 'Serverless PostgreSQL database providing persistence, search, filtering, and evaluation benchmark tracking.',
      limitations: ['Requires secure backend connection string; gracefully operates offline if unconfigured.'],
    },
  };

  const selectedNode = nodes[selectedNodeId] || nodes['wavlm'];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-20">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Eyebrow and Headline matching Screenshot 4 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-800/40 bg-cyan-950/40 px-3.5 py-1 text-xs font-medium text-cyan-300 mb-4">
            <Workflow className="h-3.5 w-3.5 text-cyan-400" />
            <span>SYSTEM ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            End-to-End Detection <span className="text-cyan-400">Pipeline</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            A multi-modal architecture combining self-supervised audio representations with deep visual features for comprehensive deepfake detection.
          </p>
        </div>

        {/* Dual-Stream Flow Visual matching Screenshot 4 */}
        <div className="rounded-3xl border border-slate-800 bg-[#080e1c]/90 p-6 sm:p-10 shadow-2xl shadow-black/60">
          {/* AUDIO STREAM SECTION matching Screenshot 4 */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4">
              <Mic className="h-4 w-4" />
              <span>AUDIO STREAM</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Audio Node 1 */}
              <div
                onClick={() => setSelectedNodeId('audio-input')}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center cursor-pointer transition-all ${
                  selectedNodeId === 'audio-input'
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950'
                    : 'border-slate-800 bg-[#0b1325] hover:border-slate-700'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 mb-3">
                  <Mic className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Audio Input</h4>
                <p className="text-xs text-slate-400 mt-1">Waveform / Spectrogram</p>
              </div>

              {/* Audio Node 2: WavLM (Highlighted in Screenshot 4!) */}
              <div
                onClick={() => setSelectedNodeId('wavlm')}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border text-center cursor-pointer transition-all ${
                  selectedNodeId === 'wavlm'
                    ? 'border-cyan-400 bg-gradient-to-b from-cyan-600/30 to-blue-600/30 shadow-xl shadow-cyan-500/20 glow-cyan'
                    : 'border-cyan-500/60 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 hover:border-cyan-400'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400 text-black mb-3 shadow-lg shadow-cyan-400/30 font-bold">
                  <Layers className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-white">WavLM</h4>
                <p className="text-xs text-cyan-200 mt-1 font-medium">Self-Supervised Features</p>
              </div>

              {/* Audio Node 3 */}
              <div
                onClick={() => setSelectedNodeId('audio-encoder')}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center cursor-pointer transition-all ${
                  selectedNodeId === 'audio-encoder'
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950'
                    : 'border-slate-800 bg-[#0b1325] hover:border-slate-700'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 mb-3">
                  <Brain className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Audio Encoder</h4>
                <p className="text-xs text-slate-400 mt-1">768-dim Embedding</p>
              </div>
            </div>
          </div>

          {/* Cross-Attention Connector Pill matching Screenshot 4 */}
          <div className="my-8 flex justify-center">
            <button
              onClick={() => setSelectedNodeId('fusion-layer')}
              className={`flex items-center space-x-3 rounded-full border px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-all shadow-lg ${
                selectedNodeId === 'fusion-layer'
                  ? 'border-purple-400 bg-purple-950/80 text-purple-200 shadow-purple-950/80 glow-purple'
                  : 'border-purple-700/60 bg-[#160d29]/90 text-purple-300 hover:border-purple-500 hover:bg-[#1d1036]'
              }`}
            >
              <span>&gt; CROSS-ATTENTION FUSION &gt;</span>
            </button>
          </div>

          {/* VISUAL STREAM SECTION matching Screenshot 4 */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">
              <Video className="h-4 w-4" />
              <span>VISUAL STREAM</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Video Node 1 */}
              <div
                onClick={() => setSelectedNodeId('video-input')}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center cursor-pointer transition-all ${
                  selectedNodeId === 'video-input'
                    ? 'border-blue-400 bg-blue-950/40 shadow-lg shadow-blue-950'
                    : 'border-slate-800 bg-[#0b1325] hover:border-slate-700'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 mb-3">
                  <Video className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Video Input</h4>
                <p className="text-xs text-slate-400 mt-1">Frame Sequences / Faces</p>
              </div>

              {/* Video Node 2 */}
              <div
                onClick={() => setSelectedNodeId('visual-extractor')}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center cursor-pointer transition-all ${
                  selectedNodeId === 'visual-extractor'
                    ? 'border-blue-400 bg-blue-950/40 shadow-lg shadow-blue-950'
                    : 'border-slate-800 bg-[#0b1325] hover:border-slate-700'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 mb-3">
                  <Layers className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Visual CNN / ViT</h4>
                <p className="text-xs text-slate-400 mt-1">Facial &amp; Spatial Features</p>
              </div>

              {/* Video Node 3 */}
              <div
                onClick={() => setSelectedNodeId('visual-encoder')}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center cursor-pointer transition-all ${
                  selectedNodeId === 'visual-encoder'
                    ? 'border-blue-400 bg-blue-950/40 shadow-lg shadow-blue-950'
                    : 'border-slate-800 bg-[#0b1325] hover:border-slate-700'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 mb-3">
                  <Brain className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Visual Encoder</h4>
                <p className="text-xs text-slate-400 mt-1">512-dim Embedding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Node Inspector Drawer below */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-[#0b1326] p-6 shadow-xl">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-slate-700">
                    {selectedNode.version}
                  </span>
                  <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                    {selectedNode.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedNode.modelKey}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('demo')}
              className="hidden sm:flex items-center space-x-1.5 rounded-xl bg-cyan-400 px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-cyan-300 transition-colors"
            >
              <span>Test This Model</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="font-semibold text-slate-300">Tensor Dimensions:</span>
              <div className="mt-1.5 rounded-lg bg-[#070c18] border border-slate-800 p-2 font-mono text-[11px] text-cyan-400">
                {selectedNode.tensorShape}
              </div>
              <div className="mt-3">
                <span className="font-semibold text-slate-300">Inputs:</span>
                <ul className="mt-1 space-y-1 text-slate-400">
                  {selectedNode.inputs.map((inp, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-300">Architecture &amp; Representations:</span>
              <p className="mt-1.5 text-slate-300 leading-relaxed">
                {selectedNode.description}
              </p>
              <div className="mt-3">
                <span className="font-semibold text-slate-300">Outputs:</span>
                <ul className="mt-1 space-y-1 text-slate-400">
                  {selectedNode.outputs.map((out, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-300">Forensic Limitations:</span>
              <ul className="mt-1.5 space-y-1.5 text-slate-400">
                {selectedNode.limitations.map((lim, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5 text-amber-300/80">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400 mt-0.5" />
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
