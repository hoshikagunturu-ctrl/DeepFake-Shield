import React, { useState } from 'react';
import { Shield, ChevronDown, Database, CheckCircle2, AlertCircle, RefreshCw, LogOut, Key, User } from 'lucide-react';
import { DatabaseHealth, PageType } from '../types';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  dbHealth: DatabaseHealth | null;
  onOpenDbModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  dbHealth,
  onOpenDbModal,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isConnected = dbHealth?.connected ?? false;

  const navItems: { label: string; page: PageType }[] = [
    { label: 'Overview', page: 'overview' },
    { label: 'Architecture', page: 'architecture' },
    { label: 'Live Demo', page: 'demo' },
    { label: 'Results', page: 'results' },
    { label: 'Research', page: 'research' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
          onClick={() => onNavigate('overview')}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#070b14]">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            DeepFake<span className="text-cyan-400">Shield</span>
          </span>
        </div>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 shadow-sm shadow-cyan-950'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side: Database Badge & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Neon DB Status Pill (Exactly matching screenshot) */}
          <button
            onClick={onOpenDbModal}
            className={`flex items-center space-x-2 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              isConnected
                ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/60 shadow-sm shadow-emerald-950/50'
                : 'border-amber-500/30 bg-amber-950/30 text-amber-300 hover:bg-amber-950/50 shadow-sm shadow-amber-950/50'
            }`}
            title="Click to inspect Neon PostgreSQL database health and connection status"
          >
            <Database className="h-3.5 w-3.5 text-current" />
            <span>{isConnected ? 'Neon DB Connected' : 'Neon DB Offline'}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-left transition-colors hover:bg-slate-800/80"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-xs font-semibold text-white">
                DU
              </div>
              <div className="hidden lg:block text-xs leading-tight">
                <div className="font-semibold text-slate-100">Demo User</div>
                <div className="text-[10px] text-slate-400">demo@deepfakeshield.com</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Dropdown menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-[#0d1527] py-1.5 shadow-xl shadow-black/80">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="text-xs font-medium text-slate-200">Demo User</div>
                  <div className="text-[11px] text-slate-400 truncate">demo@deepfakeshield.com</div>
                  <div className="mt-1 text-[10px] font-mono text-cyan-400">Forensic Analyst Tier</div>
                </div>
                <button
                  onClick={() => {
                    onNavigate('history');
                    setUserDropdownOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white"
                >
                  <Database className="mr-2 h-3.5 w-3.5 text-cyan-400" />
                  Analysis History
                </button>
                <button
                  onClick={() => {
                    onOpenDbModal();
                    setUserDropdownOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white"
                >
                  <Key className="mr-2 h-3.5 w-3.5 text-cyan-400" />
                  Neon Database Config
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
