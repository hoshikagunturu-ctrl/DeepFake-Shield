import React, { useState } from 'react';
import { Database, X, CheckCircle2, AlertTriangle, RefreshCw, Key, ShieldCheck, ExternalLink } from 'lucide-react';
import { DatabaseHealth } from '../types';
import { api } from '../services/api';

interface DatabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbHealth: DatabaseHealth | null;
  onRefreshHealth: () => void;
}

export const DatabaseConnectModal: React.FC<DatabaseConnectModalProps> = ({
  isOpen,
  onClose,
  dbHealth,
  onRefreshHealth,
}) => {
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<DatabaseHealth | null>(null);

  if (!isOpen) return null;

  const currentStatus = checkResult || dbHealth;
  const isConnected = currentStatus?.connected ?? false;

  const handleTestConnection = async () => {
    setChecking(true);
    try {
      const res = await api.getDatabaseHealth();
      setCheckResult(res);
      onRefreshHealth();
    } catch (err) {
      setCheckResult({
        status: 'ERROR',
        connected: false,
        provider: 'Neon PostgreSQL',
        message: 'Network error or backend service unreachable.',
        latency_ms: null,
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0a1020] p-6 shadow-2xl shadow-cyan-950/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/60 border border-cyan-800/50">
            <Database className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Neon PostgreSQL Connectivity</h3>
            <p className="text-xs text-slate-400">Database health, migrations, and persistent forensic logs</p>
          </div>
        </div>

        {/* Status Card */}
        <div className={`mb-5 rounded-xl border p-4 ${
          isConnected
            ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
            : 'border-amber-500/30 bg-amber-950/20 text-amber-300'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              )}
              <span className="font-semibold text-sm">
                Status: {isConnected ? 'ONLINE & VERIFIED' : 'OFFLINE / UNCONFIGURED'}
              </span>
            </div>
            {currentStatus?.latency_ms !== null && currentStatus?.latency_ms !== undefined && (
              <span className="text-xs font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                {currentStatus.latency_ms} ms
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            {currentStatus?.message || 'Database status reported from server-side SELECT 1 health check.'}
          </p>
        </div>

        {/* Information & Instructions */}
        <div className="space-y-3 mb-6 text-xs text-slate-300">
          <div className="flex items-start space-x-2 rounded-lg bg-slate-900/60 border border-slate-800 p-3">
            <Key className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Database URL Configuration:</span>
              <p className="mt-1 text-slate-400">
                Place your rotated Neon PostgreSQL connection string into <code className="text-cyan-300 bg-slate-800 px-1 py-0.5 rounded">backend/.env</code>:
              </p>
              <div className="mt-2 bg-[#050811] p-2 rounded border border-slate-800 font-mono text-[11px] text-cyan-400 break-all select-all">
                DATABASE_URL=postgresql://neondb_owner:password@ep-xxxx.pooler.neon.tech/neondb?sslmode=require
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2 rounded-lg bg-slate-900/60 border border-slate-800 p-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Security & Credential Rotation:</span>
              <p className="mt-1 text-slate-400">
                As instructed in the protocol, never commit plaintext credentials. Passwords are rotated in the Neon dashboard and loaded exclusively through backend environment variables.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <a
            href="https://console.neon.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            <span>Neon Console</span>
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleTestConnection}
              disabled={checking}
              className="flex items-center space-x-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-black hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Testing...' : 'Test Connection (SELECT 1)'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
