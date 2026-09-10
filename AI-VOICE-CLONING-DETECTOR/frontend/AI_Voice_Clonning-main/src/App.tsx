import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnalysisProvider } from '@/context/AnalysisContext';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AnalyzePage } from '@/pages/AnalyzePage';
import { ResultsPage } from '@/pages/ResultsPage';
import { TranscriptionPage } from '@/pages/TranscriptionPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AboutPage } from '@/pages/AboutPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/transcription" element={<TranscriptionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<LandingPage />} />
          </Route>
        </Routes>
      </AnalysisProvider>
    </BrowserRouter>
  );
}
