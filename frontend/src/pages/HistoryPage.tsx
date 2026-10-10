import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileAudio,
  FileVideo,
  FileImage,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  Shield,
  X,
} from 'lucide-react';
import { HistoryItem } from '../types';
import { api } from '../services/api';

export const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>('');
  const [classificationFilter, setClassificationFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HistoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory(
        page,
        pageSize,
        mediaTypeFilter || undefined,
        classificationFilter || undefined,
        searchQuery || undefined
      );
      setItems(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, mediaTypeFilter, classificationFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteHistory(id);
      setDeleteConfirmId(null);
      if (selectedRecord?.id === id) setSelectedRecord(null);
      fetchHistory();
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'audio':
        return <FileAudio className="h-4 w-4 text-cyan-400" />;
      case 'video':
        return <FileVideo className="h-4 w-4 text-blue-400" />;
      case 'image':
        return <FileImage className="h-4 w-4 text-purple-400" />;
      default:
        return <Shield className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-20">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-800/40 bg-cyan-950/40 px-3 py-1 text-xs font-medium text-cyan-300 mb-2">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span>NEON POSTGRESQL PERSISTENCE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Forensic <span className="text-cyan-400">Analysis History</span>
            </h2>
          </div>

          <button
            onClick={fetchHistory}
            disabled={loading}
            className="flex items-center space-x-2 rounded-xl border border-slate-800 bg-[#0a1122] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Audit Logs</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-2xl border border-slate-800 bg-[#09101e] p-4 mb-6 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by filename or record UUID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={mediaTypeFilter}
                onChange={(e) => {
                  setMediaTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Media Types</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="multimodal">Multi-Modal</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={classificationFilter}
                onChange={(e) => {
                  setClassificationFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="">All Classifications</option>
                <option value="AI_GENERATED">AI Generated</option>
                <option value="MANIPULATED">Manipulated</option>
                <option value="LIKELY_AUTHENTIC">Likely Authentic</option>
                <option value="INCONCLUSIVE">Inconclusive</option>
              </select>
            </div>
          </form>
        </div>

        {/* History Table or Empty State */}
        <div className="rounded-3xl border border-slate-800 bg-[#09101e]/95 overflow-hidden shadow-2xl">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <Database className="h-12 w-12 text-slate-600 mb-3" />
              <h4 className="text-base font-semibold text-slate-300">
                No Persisted Analysis Records Found
              </h4>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Run an audio, video, or image analysis on the Live Demo page. If your Neon database connection is active, forensic records are stored here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-mono text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Media</th>
                    <th className="py-3 px-4">Filename</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {items.map((r) => {
                    const isFake = r.classification === 'AI_GENERATED' || r.classification === 'MANIPULATED';
                    return (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1.5 uppercase font-mono text-[10px] text-slate-300">
                            {getMediaIcon(r.media_type)}
                            <span>{r.media_type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-white max-w-[200px] truncate" title={r.filename}>
                          {r.filename}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              isFake
                                ? 'bg-red-950/80 text-red-400 border border-red-800/50'
                                : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                            }`}
                          >
                            {r.classification || 'ANALYZED'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {r.raw_score !== null ? `${(r.raw_score * 100).toFixed(1)}%` : '—'}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {r.processing_duration_ms ? `${r.processing_duration_ms} ms` : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedRecord(r)}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                              title="View Forensic Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(r.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800"
                              title="Delete Record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {total > pageSize && (
            <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
              <span>
                Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total} records
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-700 p-1.5 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={page * pageSize >= total}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-700 p-1.5 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#0d1527] p-6 shadow-2xl">
              <h4 className="text-base font-bold text-white mb-2">Delete Forensic Record?</h4>
              <p className="text-xs text-slate-400 mb-6">
                Are you sure you want to permanently delete this analysis record from Neon PostgreSQL?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Record Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0a1122] p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedRecord.filename}</h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {selectedRecord.id}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-300">Classification Result:</span>
                    <span className={`rounded px-2 py-0.5 font-bold ${
                      selectedRecord.classification === 'AI_GENERATED' ? 'text-red-400 bg-red-950/80' : 'text-emerald-400 bg-emerald-950/80'
                    }`}>
                      {selectedRecord.classification}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{selectedRecord.score_interpretation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                    <span className="text-slate-400">Media Type:</span>
                    <div className="mt-1 font-semibold text-white uppercase">{selectedRecord.media_type}</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                    <span className="text-slate-400">Raw Confidence Score:</span>
                    <div className="mt-1 font-semibold text-cyan-400">
                      {selectedRecord.raw_score !== null ? `${(selectedRecord.raw_score * 100).toFixed(2)}%` : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                  <span className="font-semibold text-slate-300">Models &amp; Versions:</span>
                  <pre className="mt-2 rounded bg-black/60 p-2 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                    {JSON.stringify(selectedRecord.model_versions, null, 2)}
                  </pre>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                  <span className="font-semibold text-slate-300">Evidence Summary:</span>
                  <pre className="mt-2 rounded bg-black/60 p-2 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    {JSON.stringify(selectedRecord.evidence_summary, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
