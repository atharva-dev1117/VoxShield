import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Upload,
  Activity,
  Clock,
  Languages as LanguagesIcon,
  TrendingUp,
  ArrowRight,
  FileAudio,
  Mic,
} from 'lucide-react';
import { useMemo } from 'react';
import type { AnalysisResult, Verdict } from '@/types';
import { VERDICT_LABELS } from '@/types';
import { useAnalysis } from '@/context/AnalysisContext';
import { getHistory, getDemoResult } from '@/services/analysisService';
import { AnalysisRing } from '@/components/AnalysisRing';
import { VerdictBadge, RiskBadge } from '@/components/VerdictBadge';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { SUPPORTED_LANGUAGES } from '@/types';

const DEMO_CASES: { verdict: Verdict; label: string; desc: string }[] = [
  { verdict: 'authentic', label: 'Authentic Voice', desc: 'Verified customer call' },
  { verdict: 'suspicious', label: 'Suspicious Voice', desc: 'Borderline — needs review' },
  { verdict: 'ai_generated', label: 'AI Voice Detected', desc: 'Cloned voice attempt' },
];

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
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
  if (v === 'authentic') return 'text-teal-600';
  if (v === 'suspicious') return 'text-amber-600';
  return 'text-red-600';
}

function getVerdictRingColor(v: Verdict): string {
  if (v === 'authentic') return 'text-teal-500';
  if (v === 'suspicious') return 'text-amber-500';
  return 'text-red-500';
}

export function DashboardPage() {
  const { currentResult, history } = useAnalysis();
  const allHistory = useMemo(() => {
    const mockHistory = getHistory();
    return [...history, ...mockHistory].slice(0, 8);
  }, [history]);

  const latest = currentResult || allHistory[0] || null;

  const stats = useMemo(() => {
    const total = allHistory.length;
    const authentic = allHistory.filter((r) => r.verdict === 'authentic').length;
    const suspicious = allHistory.filter((r) => r.verdict === 'suspicious').length;
    const ai = allHistory.filter((r) => r.verdict === 'ai_generated').length;
    return { total, authentic, suspicious, ai };
  }, [allHistory]);

  const threatStatus = stats.ai > 0 || stats.suspicious > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Security Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">Real-time voice authenticity monitoring</p>
        </div>
        <Link to="/analyze" className="btn-primary">
          <Upload className="h-4 w-4" />
          New Analysis
        </Link>
      </div>

      {/* Overall threat status banner */}
      <div
        className={`rounded-xl border p-5 mb-6 flex items-center gap-4 ${
          threatStatus ? 'bg-amber-50 border-amber-200' : 'bg-teal-50 border-teal-200'
        }`}
      >
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
            threatStatus ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'
          }`}
        >
          {threatStatus ? <AlertTriangle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${threatStatus ? 'text-amber-900' : 'text-teal-900'}`}>
            {threatStatus ? 'Threats detected in recent analyses' : 'All clear — no threats detected'}
          </p>
          <p className={`text-sm ${threatStatus ? 'text-amber-700' : 'text-teal-700'}`}>
            {threatStatus
              ? `${stats.ai + stats.suspicious} of ${stats.total} recent analyses flagged for review`
              : `${stats.total} analyses completed — all voices verified as authentic`}
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Latest analysis — big card */}
        <div className="lg:col-span-2 card-raised p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">Latest Analysis</h2>
              <p className="text-xs text-ink-400">{latest ? latest.fileName : 'No analyses yet'}</p>
            </div>
            {latest && <VerdictBadge verdict={latest.verdict} />}
          </div>

          {latest ? (
            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center">
                <AnalysisRing
                  value={latest.authenticityScore}
                  label="Authenticity"
                  size={180}
                  colorClass={getVerdictRingColor(latest.verdict)}
                />
                <div className="mt-4 flex gap-2">
                  <RiskBadge level={latest.riskLevel} size="sm" />
                </div>
              </div>

              <div className="space-y-4">
                <MetricRow icon={Activity} label="AI Probability" value={`${latest.aiProbability}%`} accent={latest.aiProbability > 50 ? 'text-red-600' : 'text-teal-600'} />
                <MetricRow icon={TrendingUp} label="Confidence Score" value={`${latest.confidenceScore}%`} />
                <MetricRow icon={LanguagesIcon} label="Detected Language" value={getLangName(latest.detectedLanguage)} />
                <MetricRow icon={Clock} label="Audio Duration" value={formatDuration(latest.durationSec)} />
                <MetricRow icon={FileAudio} label="Analysis Status" value="Complete" accent="text-teal-600" />
              </div>
            </div>
          ) : (
            <EmptyState />
          )}

          {latest && (
            <div className="mt-6 pt-5 border-t border-surface-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-ink-700">Transcript Preview</h3>
                <Link to="/results" className="text-xs font-medium text-primary-600 hover:underline">
                  View full results →
                </Link>
              </div>
              <p className="text-sm text-ink-600 leading-relaxed line-clamp-3">{latest.originalTranscript}</p>
            </div>
          )}
        </div>

        {/* Quick stats column */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink-700 mb-4">Analysis Summary</h3>
            <div className="space-y-3">
              <SummaryRow icon={FileAudio} label="Total Analyses" value={stats.total} color="text-primary-600 bg-primary-50" />
              <SummaryRow icon={ShieldCheck} label="Authentic" value={stats.authentic} color="text-teal-600 bg-teal-50" />
              <SummaryRow icon={AlertTriangle} label="Suspicious" value={stats.suspicious} color="text-amber-600 bg-amber-50" />
              <SummaryRow icon={ShieldAlert} label="AI Detected" value={stats.ai} color="text-red-600 bg-red-50" />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink-700 mb-4">Quick Demo</h3>
            <p className="text-xs text-ink-400 mb-3">Load a sample analysis to explore the results page</p>
            <div className="space-y-2">
              {DEMO_CASES.map((demo) => {
                const Icon = getVerdictIcon(demo.verdict);
                return (
                  <Link
                    key={demo.verdict}
                    to="/results"
                    onClick={() => {
                      const result = getDemoResult(demo.verdict);
                      sessionStorage.setItem('voxshield-demo', JSON.stringify(result));
                    }}
                    className="flex items-center gap-3 rounded-lg border border-surface-border p-3 hover:bg-surface-sunken transition-colors group"
                  >
                    <Icon className={`h-4 w-4 ${getVerdictColor(demo.verdict)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-800">{demo.label}</p>
                      <p className="text-xs text-ink-400">{demo.desc}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-ink-300 group-hover:text-primary-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent analyses table */}
      <div className="card-raised p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-ink-900">Recent Analyses</h2>
          <Link to="/history" className="text-sm font-medium text-primary-600 hover:underline">
            View all →
          </Link>
        </div>

        {allHistory.length === 0 ? (
          <div className="text-center py-12">
            <Mic className="h-10 w-10 text-ink-300 mx-auto mb-3" />
            <p className="text-sm text-ink-400">No analyses yet. Upload audio to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-surface-border text-left">
                  <th className="pb-3 text-xs font-semibold text-ink-400 uppercase tracking-wide">File</th>
                  <th className="pb-3 text-xs font-semibold text-ink-400 uppercase tracking-wide">Verdict</th>
                  <th className="pb-3 text-xs font-semibold text-ink-400 uppercase tracking-wide">Score</th>
                  <th className="pb-3 text-xs font-semibold text-ink-400 uppercase tracking-wide">Language</th>
                  <th className="pb-3 text-xs font-semibold text-ink-400 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {allHistory.slice(0, 6).map((item) => {
                  const Icon = getVerdictIcon(item.verdict);
                  return (
                    <tr key={item.id} className="hover:bg-surface-sunken/50 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 shrink-0 ${getVerdictColor(item.verdict)}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink-800 truncate max-w-[180px]">{item.fileName}</p>
                            <p className="text-xs text-ink-400">{formatDuration(item.durationSec)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <VerdictBadge verdict={item.verdict} size="sm" />
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.verdict === 'authentic' ? 'bg-teal-500' : item.verdict === 'suspicious' ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${item.authenticityScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-ink-600">{item.authenticityScore}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-sm text-ink-600">{getLangName(item.detectedLanguage)}</td>
                      <td className="py-3.5 text-sm text-ink-400">{formatDate(item.uploadedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricRow({
  icon: Icon,
  label,
  value,
  accent = 'text-ink-800',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-ink-500">
        <Icon className="h-4 w-4 text-ink-400" />
        {label}
      </span>
      <span className={`text-sm font-semibold ${accent}`}>{value}</span>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2.5 text-sm text-ink-600">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </span>
        {label}
      </span>
      <span className="font-display text-lg font-bold text-ink-900">{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-16 w-16 rounded-full bg-surface-sunken flex items-center justify-center mb-4">
        <FileAudio className="h-8 w-8 text-ink-300" />
      </div>
      <p className="text-sm font-medium text-ink-600">No analysis yet</p>
      <p className="text-xs text-ink-400 mt-1 mb-4">Upload an audio file to see results here</p>
      <Link to="/analyze" className="btn-primary text-sm">
        <Upload className="h-4 w-4" />
        Analyze Audio
      </Link>
    </div>
  );
}
