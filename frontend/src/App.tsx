import React, { useState, useEffect } from 'react';
import { PageType, SystemHealth, DatabaseHealth } from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OverviewPage } from './pages/OverviewPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { LiveDemoPage } from './pages/LiveDemoPage';
import { ResultsPage } from './pages/ResultsPage';
import { ResearchPage } from './pages/ResearchPage';
import { HistoryPage } from './pages/HistoryPage';
import { DatabaseConnectModal } from './components/DatabaseConnectModal';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('overview');
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [dbHealth, setDbHealth] = useState<DatabaseHealth | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  const fetchHealth = async () => {
    try {
      const health = await api.getHealth();
      setSystemHealth(health);
      setDbHealth(health.database);
    } catch (e) {
      // Backend maybe loading or offline
      setDbHealth({
        status: 'DISCONNECTED',
        connected: false,
        provider: 'Neon PostgreSQL',
        message: 'DATABASE_URL environment variable is not configured.',
        latency_ms: null,
      });
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#060a13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Global Header */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        dbHealth={dbHealth}
        onOpenDbModal={() => setIsDbModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentPage === 'overview' && (
          <OverviewPage
            onNavigate={setCurrentPage}
            systemHealth={systemHealth}
          />
        )}
        {currentPage === 'architecture' && (
          <ArchitecturePage
            onNavigate={setCurrentPage}
          />
        )}
        {currentPage === 'demo' && (
          <LiveDemoPage />
        )}
        {currentPage === 'results' && (
          <ResultsPage />
        )}
        {currentPage === 'research' && (
          <ResearchPage />
        )}
        {currentPage === 'history' && (
          <HistoryPage />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setCurrentPage}
        onOpenDbModal={() => setIsDbModalOpen(true)}
      />

      {/* Neon DB Connection Modal */}
      <DatabaseConnectModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        dbHealth={dbHealth}
        onRefreshHealth={fetchHealth}
      />
    </div>
  );
}

export default App;
