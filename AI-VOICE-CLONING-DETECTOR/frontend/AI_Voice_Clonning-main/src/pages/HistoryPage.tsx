import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  Upload,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Search,
  Clock,
  FileAudio,
  Filter,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { useAnalysis } from '@/context/AnalysisContext';
import { getHistory } from '@/services/analysisService';
import type { Verdict } from '@/types';
import { SUPPORTED_LANGUAGES, VERDICT_LABELS } from '@/types';
import { VerdictBadge } from '@/components/VerdictBadge';

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getLangName(code: string): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
}

function getVerdictIcon(v: Verdict) {
  if (v === 'authentic') return ShieldCheck;
  if (v === 'suspicious') return AlertTriangle;
  return ShieldAlert;
}

function getVerdictColor(v: Verdict): string {
  if (v === 'authentic') return 'text-teal-600 bg-teal-50';
  if (v === 'suspicious') return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
}

type FilterType = 'all' | Verdict;

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'authentic', label: 'Authentic' },
  { key: 'suspicious', label: 'Suspicious' },
  { key: 'ai_generated', label: 'AI Detected' },
];

export function HistoryPage() {
  const { history, setCurrentResult } = useAnalysis();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const allHistory = useMemo(() => {
    const mockHistory = getHistory();
    return [...history, ...mockHistory];
  }, [history]);

  const filtered = useMemo(() => {
    return allHistory.filter((item) => {
      const matchesSearch = item.fileName.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || item.verdict === filter;
      return matchesSearch && matchesFilter;
    });
  }, [allHistory, search, filter]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Analysis History</h1>
          <p className="mt-1 text-sm text-ink-500">{allHistory.length} analyses recorded</p>
        </div>
        <Link to="/analyze" className="btn-primary">
          <Upload className="h-4 w-4" />
          New Analysis
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search by file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            aria-label="Search analyses"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-ink-400 shrink-0" />
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f.key ? 'bg-primary-600 text-white' : 'bg-white border border-surface-border text-ink-600 hover:bg-surface-sunken'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FileAudio className="h-10 w-10 text-ink-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-ink-600">No analyses found</p>
          <p className="text-xs text-ink-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => {
            const Icon = getVerdictIcon(item.verdict);
            return (
              <div key={item.id} className="card p-5 hover:shadow-card-lg transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${getVerdictColor(item.verdict)}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-ink-900 truncate">{item.fileName}</h3>
                      <VerdictBadge verdict={item.verdict} size="sm" />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(item.durationSec)}
                      </span>
                      <span>{getLangName(item.detectedLanguage)}</span>
                      <span>{formatDate(item.uploadedAt)}</span>
                    </div>

                    <p className="mt-2 text-sm text-ink-500 line-clamp-2">{item.originalTranscript}</p>
                  </div>

                  {/* Score + action */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-ink-900">{item.authenticityScore}%</p>
                      <p className="text-[10px] text-ink-400">authenticity</p>
                    </div>
                    <Link
                      to="/results"
                      onClick={() => setCurrentResult(item)}
                      className="btn-ghost text-xs px-3 py-1.5"
                    >
                      View
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
