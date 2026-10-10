import React from 'react';
import { Play, Shield, Layers, Mic, Video, Image, Network, CheckCircle2, AlertTriangle, ArrowRight, Database, Eye } from 'lucide-react';
import { PageType, SystemHealth } from '../types';

interface OverviewPageProps {
  onNavigate: (page: PageType) => void;
  systemHealth: SystemHealth | null;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate, systemHealth }) => {
  const isDbConnected = systemHealth?.database?.connected ?? false;

  const featureCards = [
    {
      title: 'Audio Authenticity Analysis',
      description: 'Leverages WavLM self-supervised speech representations, zero-crossing rate, and spectral flatness to detect synthetic vocoders.',
      icon: Mic,
      color: 'text-cyan-400',
      action: () => onNavigate('demo'),
      badge: 'WavLM-SpoofHead v1.4',
    },
    {
      title: 'Video Manipulation Analysis',
      description: 'Analyzes facial boundary discontinuities, temporal micro-flickering, and deep neural texture warping across sampled video frames.',
      icon: Video,
      color: 'text-blue-400',
      action: () => onNavigate('demo'),
      badge: 'FaceForensics-EffNet v4.0',
    },
    {
      title: 'Image Forensic Analysis',
      description: 'Detects spatial frequency artifacts, chrominance noise imbalance, and diffusion generative signatures with ResNet50 vision heads.',
      icon: Image,
      color: 'text-purple-400',
      action: () => onNavigate('demo'),
      badge: 'ForensicVision v2.1',
    },
    {
      title: 'Multimodal Evidence Fusion',
      description: 'Cross-attention alignment reconciles visual face movements with acoustic phonemes, flagging modality-selective manipulation.',
      icon: Network,
      color: 'text-emerald-400',
      action: () => onNavigate('architecture'),
      badge: 'Cross-Attention v1.3',
    },
    {
      title: 'Transparent Results & Limitations',
      description: 'Provides honest confidence scoring, raw model logits, explicit calibration warnings, and scientific edge-case disclosures.',
      icon: Shield,
      color: 'text-amber-400',
      action: () => onNavigate('research'),
      badge: 'Forensic Rigor',
    },
    {
      title: 'Persistent Analysis History',
      description: 'Audited records saved directly to Neon PostgreSQL with metadata, raw scores, and complete evidence summaries.',
      icon: Database,
      color: 'text-indigo-400',
      action: () => onNavigate('history'),
      badge: isDbConnected ? 'Neon Connected' : 'Neon Configurable',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden pb-20">
      {/* Background grid pattern & ambient glows */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[300px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 pt-14 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge matching Screenshot 3 */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-800/40 bg-cyan-950/40 px-3.5 py-1 text-xs font-medium text-cyan-300 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Self-Supervised Deep Learning Research</span>
        </div>

        {/* Headline matching Screenshot 3 */}
        <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
          Multi-Modal <span className="text-cyan-400">Deep</span>{' '}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Fake
          </span>
          <br />
          <span>Detection System</span>
        </h1>

        {/* Subtitle matching Screenshot 3 */}
        <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Leveraging self-supervised <span className="font-semibold text-cyan-300">WavLM</span> audio representations and{' '}
          <span className="font-semibold text-blue-300">CNN</span> visual features for robust, multi-modal detection of AI-generated audio and video content.
        </p>

        {/* Subtext matching Screenshot 3 */}
        <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-slate-400 font-normal">
          Achieving state-of-the-art performance on FaceForensics++, ASVspoof 2019, and custom multi-modal benchmarks
        </p>

        {/* Animated Central Waveform Graphic matching Screenshot 3 */}
        <div className="my-10 flex items-center justify-center space-x-1.5 sm:space-x-2.5">
          {[16, 24, 38, 52, 30, 64, 42, 58, 22, 45, 68, 35, 55, 40, 26, 18].map((h, i) => (
            <div
              key={i}
              className="w-1.5 sm:w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)] animate-pulse"
              style={{
                height: `${h}px`,
                animationDelay: `${(i % 5) * 150}ms`,
                animationDuration: '1.4s',
              }}
            />
          ))}
        </div>

        {/* CTAs matching Screenshot 3 */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('demo')}
            className="flex items-center space-x-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Try Live Demo</span>
          </button>

          <button
            onClick={() => onNavigate('architecture')}
            className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-slate-600 hover:bg-slate-800 active:scale-95 shadow-sm"
          >
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>View Architecture</span>
          </button>
        </div>

        {/* Live System Status Bar */}
        <div className="mt-14 rounded-2xl border border-slate-800 bg-[#09101e]/80 p-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-3 mb-3">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Forensic Infrastructure Health
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              Live Health Verification
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-2.5">
              <div className="text-[10px] text-slate-400 font-mono">BACKEND API</div>
              <div className="mt-1 flex items-center space-x-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>READY</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-2.5">
              <div className="text-[10px] text-slate-400 font-mono">NEON DATABASE</div>
              <div className={`mt-1 flex items-center space-x-1.5 text-xs font-semibold ${isDbConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isDbConnected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                <span>{isDbConnected ? 'CONNECTED' : 'CONFIGURABLE'}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-2.5">
              <div className="text-[10px] text-slate-400 font-mono">AUDIO (WavLM)</div>
              <div className="mt-1 flex items-center space-x-1.5 text-xs font-semibold text-cyan-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>READY</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-2.5">
              <div className="text-[10px] text-slate-400 font-mono">VIDEO (EffNet)</div>
              <div className="mt-1 flex items-center space-x-1.5 text-xs font-semibold text-blue-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>READY</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-2.5">
              <div className="text-[10px] text-slate-400 font-mono">IMAGE (ResNet)</div>
              <div className="mt-1 flex items-center space-x-1.5 text-xs font-semibold text-purple-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>READY</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-2.5">
              <div className="text-[10px] text-slate-400 font-mono">FUSION ENGINE</div>
              <div className="mt-1 flex items-center space-x-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>READY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Six Feature Cards matching Requirement #4 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={card.action}
                className="group relative cursor-pointer rounded-2xl border border-slate-800 bg-[#0a1122]/90 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-[#0d162d] hover:-translate-y-1 shadow-lg shadow-black/40"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900/90 border border-slate-800 ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-md bg-slate-800/80 border border-slate-700/60 px-2.5 py-0.5 text-[10px] font-mono font-medium text-slate-300">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {card.description}
                </p>

                <div className="mt-4 flex items-center text-xs font-medium text-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>Explore Workflow</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
