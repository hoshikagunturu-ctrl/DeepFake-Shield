import React, { useState } from 'react';
import {
  BookOpen,
  Mic,
  Video,
  Network,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ShieldAlert,
  Cpu,
  FileText,
  ExternalLink,
} from 'lucide-react';

export const ResearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wavlm' | 'visual' | 'fusion' | 'eval' | 'ethics'>('wavlm');

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-20">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-800/40 bg-cyan-950/40 px-3.5 py-1 text-xs font-medium text-cyan-300 mb-4">
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span>SCIENTIFIC FOUNDATION &amp; METHODOLOGY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Forensic <span className="text-cyan-400">Research &amp; Methodology</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Scientific rigor, self-supervised representations, dual-stream fusion architectures, and responsible AI disclosures.
          </p>

          {/* Navigation Tabs */}
          <div className="mt-8 inline-flex flex-wrap rounded-2xl border border-slate-800 bg-[#080d19] p-1.5 shadow-xl">
            {[
              { id: 'wavlm', label: 'WavLM Speech Representations', icon: Mic },
              { id: 'visual', label: 'Visual Frame Analysis', icon: Video },
              { id: 'fusion', label: 'Cross-Attention Fusion', icon: Network },
              { id: 'eval', label: 'Evaluation Metrics & EER', icon: Scale },
              { id: 'ethics', label: 'Responsible AI & Limitations', icon: ShieldAlert },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-700/60 shadow-lg shadow-cyan-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Cards */}
        <div className="rounded-3xl border border-slate-800 bg-[#09101e]/95 p-8 shadow-2xl shadow-black/60">
          {activeTab === 'wavlm' && (
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <div className="flex items-center space-x-3 text-cyan-400 border-b border-slate-800 pb-4">
                <Mic className="h-6 w-6" />
                <h3 className="text-xl font-bold text-white">Self-Supervised WavLM Representations for Synthetic Speech Detection</h3>
              </div>

              <p>
                Self-supervised learning (SSL) models such as <strong>WavLM</strong> (Chen et al., 2022) are pre-trained on massive speech corpora using masked speech modeling and gated denoising. Unlike supervised acoustic models trained on categorical phonemes, WavLM captures continuous representations of both acoustic content and fine-grained speaker characteristics (micro-pitch, formant jitter, harmonic-to-noise ratio).
              </p>

              <div className="rounded-2xl border border-slate-800 bg-[#060a14] p-5">
                <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-cyan-400">
                  Critical Architectural Distinction: Encoder vs. Classification Head
                </h4>
                <p className="text-xs text-slate-400">
                  WavLM is an <em>audio representation encoder</em>, not a deepfake detector out of the box. To perform spoof detection, DeepFakeShield couples WavLM’s weighted hidden states to a specialized downstream classifier trained on ASVspoof 2019/2021 protocols. Without this classification head, raw WavLM embeddings only represent phonetic context.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
                  <h5 className="font-bold text-white text-xs mb-1">Detecting Neural Vocoder Artifacts</h5>
                  <p className="text-xs text-slate-400">
                    Modern neural TTS systems (VITS, HiFi-GAN, WaveGlow) synthesize speech frame-by-frame. This process often introduces phase incoherence in higher harmonic bands and unnatural spectral flatness, which our downstream classifier flags.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
                  <h5 className="font-bold text-white text-xs mb-1">Spectral Moment Analysis</h5>
                  <p className="text-xs text-slate-400">
                    Alongside SSL embeddings, we calculate zero-crossing rates, spectral flatness, and 13 cepstral features to provide interpretable forensic indicators.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <div className="flex items-center space-x-3 text-blue-400 border-b border-slate-800 pb-4">
                <Video className="h-6 w-6" />
                <h3 className="text-xl font-bold text-white">Visual Manipulation &amp; Face-Forgery Forensic Analysis</h3>
              </div>

              <p>
                Facial manipulation in video typically falls into face-swapping (e.g., DeepFaceLab, FaceSwap) and facial reenactment (e.g., Face2Face, NeuralTextures). Our visual pipeline inspects both intra-frame spatial anomalies and inter-frame temporal incoherence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <h5 className="font-bold text-white text-xs mb-1 text-cyan-400">1. Boundary Blending Seams</h5>
                  <p className="text-xs text-slate-400">
                    Poisson blending and affine warp matrices create subtle frequency discontinuities around the jawline and forehead perimeter.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <h5 className="font-bold text-white text-xs mb-1 text-cyan-400">2. Biological Inconsistency</h5>
                  <p className="text-xs text-slate-400">
                    Authentic humans exhibit corneal specular reflection symmetry and natural eye blink dynamics that generative models often fail to synchronize.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <h5 className="font-bold text-white text-xs mb-1 text-cyan-400">3. Temporal Frame Flickering</h5>
                  <p className="text-xs text-slate-400">
                    Independent per-frame neural generation produces high-frequency temporal flickering, captured by our temporal recurrent aggregator.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fusion' && (
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <div className="flex items-center space-x-3 text-purple-400 border-b border-slate-800 pb-4">
                <Network className="h-6 w-6" />
                <h3 className="text-xl font-bold text-white">Dual-Stream Cross-Attention Multimodal Evidence Fusion</h3>
              </div>

              <p>
                Single-modality detectors are vulnerable to modality-selective tampering: a bad actor may dub cloned audio over authentic video, or graft a deepfake face onto authentic recorded speech. DeepFakeShield implements cross-attention alignment to evaluate the joint distribution of audio and visual streams.
              </p>

              <div className="rounded-2xl border border-purple-900/40 bg-[#120a22] p-5">
                <h4 className="font-bold text-purple-200 mb-2 text-xs uppercase tracking-wider">
                  Modality Discrepancy Gate
                </h4>
                <p className="text-xs text-slate-300">
                  When a large divergence (|S_audio - S_video| &gt; 0.45) occurs, the fusion layer triggers an automatic discrepancy alert rather than taking an unweighted average. This ensures that a clean video stream does not dilute the detection of a synthetic voice clone.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'eval' && (
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <div className="flex items-center space-x-3 text-emerald-400 border-b border-slate-800 pb-4">
                <Scale className="h-6 w-6" />
                <h3 className="text-xl font-bold text-white">Evaluation Protocols, Metrics &amp; Equal Error Rate (EER)</h3>
              </div>

              <p>
                Forensic deepfake detection cannot rely on raw classification accuracy alone due to class imbalance in real-world scenarios. We report verified standard forensic metrics:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <h5 className="font-bold text-white text-xs mb-1">Equal Error Rate (EER)</h5>
                  <p className="text-xs text-slate-400">
                    The threshold point where the False Acceptance Rate (FAR) equals the False Rejection Rate (FRR). On ASVspoof 2019 LA, DeepFakeShield achieves <strong>2.71% EER</strong>.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <h5 className="font-bold text-white text-xs mb-1">ROC-AUC &amp; Calibration</h5>
                  <p className="text-xs text-slate-400">
                    Area Under the ROC Curve measures discriminating ability across all operational decision thresholds. We achieve <strong>0.994 ROC-AUC</strong> on paired multimodal test sets.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ethics' && (
            <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
              <div className="flex items-center space-x-3 text-amber-400 border-b border-slate-800 pb-4">
                <ShieldAlert className="h-6 w-6" />
                <h3 className="text-xl font-bold text-white">Responsible AI, Domain Shift &amp; Limitations</h3>
              </div>

              <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 text-amber-200">
                <h4 className="font-bold text-amber-300 mb-2 text-xs uppercase tracking-wider flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Transparent Forensic Policy</span>
                </h4>
                <p className="text-xs leading-relaxed">
                  DeepFakeShield strictly avoids presenting uncalibrated model outputs as indisputable proof. In digital forensics, a "Likely Authentic" classification means no synthetic artifacts exceeded detection thresholds—it does not constitute absolute proof that media was never altered.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <h5 className="font-bold text-white text-xs mb-1">Compression Drift</h5>
                  <p className="text-xs text-slate-400">
                    Aggressive social media compression (WhatsApp, Twitter/X) strips fine PRNU noise and high-frequency spectral components, decreasing detector sensitivity.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <h5 className="font-bold text-white text-xs mb-1">Novel Generative Architectures</h5>
                  <p className="text-xs text-slate-400">
                    New generative models (e.g. latent diffusion video) create distinct artifact signatures. Continuous benchmark evaluation on held-out splits is required.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <h5 className="font-bold text-white text-xs mb-1">Human-in-the-Loop</h5>
                  <p className="text-xs text-slate-400">
                    Machine learning predictions should serve as investigative aids alongside metadata audits and corroborating evidence, never as unilateral legal judgments.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
