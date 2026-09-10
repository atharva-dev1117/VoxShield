import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AnalysisResult } from '@/types';

interface AnalysisContextValue {
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;
  history: AnalysisResult[];
  addToHistory: (result: AnalysisResult) => void;
  outputLanguage: string;
  setOutputLanguage: (lang: string) => void;
  sourceLanguage: string;
  setSourceLanguage: (lang: string) => void;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [outputLanguage, setOutputLanguage] = useState('en');
  const [sourceLanguage, setSourceLanguage] = useState('auto');

  const addToHistory = useCallback((result: AnalysisResult) => {
    setHistory((prev) => [result, ...prev]);
  }, []);

  return (
    <AnalysisContext.Provider
      value={{
        currentResult,
        setCurrentResult,
        history,
        addToHistory,
        outputLanguage,
        setOutputLanguage,
        sourceLanguage,
        setSourceLanguage,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
}
