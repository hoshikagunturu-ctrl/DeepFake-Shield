import React from 'react';
import { Shield, ExternalLink, Database, Cpu, Lock } from 'lucide-react';
import { PageType } from '../types';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  onOpenDbModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDbModal }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#050811] text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm text-white">DeepFakeShield</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Multi-modal forensic artificial intelligence platform for synthetic speech, face swap, and generative media detection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('overview')} className="hover:text-cyan-400 transition-colors">
                  System Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('architecture')} className="hover:text-cyan-400 transition-colors">
                  Pipeline Architecture
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('demo')} className="hover:text-cyan-400 transition-colors">
                  Interactive Live Demo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('results')} className="hover:text-cyan-400 transition-colors">
                  Evaluation &amp; Benchmarks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('research')} className="hover:text-cyan-400 transition-colors">
                  Methodology &amp; Ethics
                </button>
              </li>
            </ul>
          </div>

          {/* Database & Security */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs mb-3">Forensic Integrity</h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={onOpenDbModal} className="flex items-center space-x-1.5 hover:text-cyan-400 transition-colors">
                  <Database className="h-3 w-3 text-cyan-400" />
                  <span>Neon PostgreSQL Status</span>
                </button>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-400">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span>Zero Media Retention</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-400">
                <Cpu className="h-3 w-3 text-purple-400" />
                <span>WavLM &amp; EffNet Transformers</span>
              </li>
            </ul>
          </div>

          {/* Disclaimers */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs mb-3">Responsible Research</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Evaluated on ASVspoof 2019/2021 and FaceForensics++. Predictions are probabilistic forensic signals and should be verified by certified analysts for legal applications.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} DeepFakeShield Research Initiative. All rights reserved.</span>
          <span className="font-mono text-cyan-500">v1.4.2-Forensics-Production</span>
        </div>
      </div>
    </footer>
  );
};
