import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  FileAudio,
  Clock,
  Languages as LanguagesIcon,
  Volume2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mic,
  Brain,
  Gauge,
  FileText,
  Upload,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { AnalysisResult, Verdict, AudioIndicator } from '@/types';
import { SUPPORTED_LANGUAGES, VERDICT_LABELS } from '@/types';
import { useAnalysis } from '@/context/AnalysisContext';
import { AnalysisRing } from '@/components/AnalysisRing';
import { VerdictBadge, RiskBadge } from '@/components/VerdictBadge';
import { AudioPlayer } from '@/components/AudioVisualizer';

function getVerdictConfig(v: Verdict) {
  if (v === 'authentic')
    return {
      Icon: ShieldCheck,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      ringColor: 'text-teal-500',
      headline: 'Authentic Voice',
      subheadline: 'This audio appears to be a genuine human voice',
    };
  if (v === 'suspicious')
    return {
      Icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      ringColor: 'text-amber-500',
      headline: 'Potential AI Voice Detected',
      subheadline: 'This audio shows signs of voice manipulation — verify the caller',
    };
  return {
    Icon: ShieldAlert,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    ringColor: 'text-red-500',
    headline: 'AI Voice Detected',
    subheadline: 'This audio is very likely an AI-generated or cloned voice',
  };
}

function getIndicatorIcon(status: AudioIndicator['status']) {
  if (status === 'normal') return CheckCircle2;
  if (status === 'warning') return AlertCircle;
  return XCircle;
}

function getIndicatorColor(status: AudioIndicator['status']) {
  if (status === 'normal') return 'text-teal-600 bg-teal-50 border-teal-100';
  if (status === 'warning') return 'text-amber-600 bg-amber-50 border-amber-100';
  return 'text-red-600 bg-red-50 border-red-100';
}

function getLangName(code: string): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const TIMELINE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  upload: Upload,
  waveform: Volume2,
  shield: ShieldCheck,
  mic: Mic,
  languages: LanguagesIcon,
  alert: AlertTriangle,
};

export function ResultsPage() {
  const { currentResult, setCurrentResult } = useAnalysis();
  const navigate = useNavigate();
  const [showTranslation, setShowTranslation] = useState(true);

  // Load demo result from sessionStorage if no current result
  useEffect(() => {
    if (!currentResult) {
      const demo = sessionStorage.getItem('voxshield-demo');
      if (demo) {
        try {
          const parsed = JSON.parse(demo) as AnalysisResult;
          setCurrentResult(parsed);
        } catch {
          // ignore
        }
      }
    }
  }, [currentResult, setCurrentResult]);

  if (!currentResult) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
        <div className="card p-12">
          <FileAudio className="h-12 w-12 text-ink-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-ink-900">No analysis to display</h2>
          <p className="mt-2 text-sm text-ink-500">Upload an audio file to see detection results here.</p>
          <Link to="/analyze" className="mt-6 btn-primary inline-flex">
            <Upload className="h-4 w-4" />
            Analyze Audio
          </Link>
        </div>
      </div>
    );
  }

  const result = currentResult;
  const config = getVerdictConfig(result.verdict);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Hero result banner */}
      <div className={`card-raised p-6 sm:p-8 mb-6 border-2 ${config.border} ${config.bg}`}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: big score */}
          <div className="flex flex-col items-center text-center">
            <AnalysisRing
              value={result.authenticityScore}
              label="Voice Authenticity"
              size={200}
              colorClass={config.ringColor}
            />
            <div className="mt-5 flex items-center gap-2">
              <config.Icon className={`h-6 w-6 ${config.color}`} />
              <span className={`font-display text-2xl font-bold ${config.color}`}>{config.headline}</span>
            </div>
            <p className="mt-1.5 text-sm text-ink-600 max-w-xs">{config.subheadline}</p>
          </div>

          {/* Right: key metrics */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <ScoreCard label="AI Probability" value={`${result.aiProbability}%`} icon={Brain} accent={result.aiProbability > 50 ? 'text-red-600' : 'text-teal-600'} />
              <ScoreCard label="Confidence" value={`${result.confidenceScore}%`} icon={Gauge} accent="text-ink-800" />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-ink-600">Risk Level:</span>
              <RiskBadge level={result.riskLevel} />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-ink-600">Status:</span>
              <VerdictBadge verdict={result.verdict} />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-border">
              <InfoRow icon={Clock} label="Duration" value={formatDuration(result.durationSec)} />
              <InfoRow icon={LanguagesIcon} label="Detected" value={getLangName(result.detectedLanguage)} />
              <InfoRow icon={FileAudio} label="Format" value={result.fileName.split('.').pop()?.toUpperCase() || 'AUDIO'} />
              <InfoRow icon={Gauge} label="Analyzed" value={formatDate(result.uploadedAt)} />
            </div>
          </div>
        </div>
      </div>

      {/* Audio player */}
      <div className="mb-6">
        <AudioPlayer fileName={result.fileName} durationSec={result.durationSec} />
      </div>

      {/* Two column: indicators + timeline */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Detection indicators */}
        <div className="card-raised p-6">
          <h3 className="font-display text-lg font-bold text-ink-900 mb-1">Detection Indicators</h3>
          <p className="text-sm text-ink-500 mb-5">Key signals that determined this verdict</p>

          <div className="space-y-3">
            {result.indicators.map((ind) => {
              const Icon = getIndicatorIcon(ind.status);
              return (
                <div key={ind.label} className={`flex items-start gap-3 rounded-lg border p-3.5 ${getIndicatorColor(ind.status)}`}>
                  <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink-800">{ind.label}</span>
                      <span className="text-xs font-medium text-ink-600">{ind.value}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">{ind.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analysis timeline */}
        <div className="card-raised p-6">
          <h3 className="font-display text-lg font-bold text-ink-900 mb-1">Analysis Pipeline</h3>
          <p className="text-sm text-ink-500 mb-5">Step-by-step breakdown of the detection process</p>

          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-surface-border" />
            <div className="space-y-4">
              {result.timeline.map((event, i) => {
                const Icon = TIMELINE_ICONS[event.icon] || CheckCircle2;
                return (
                  <div key={i} className="relative flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-teal-300 text-teal-600 shrink-0 z-10">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className="text-sm font-semibold text-ink-800">{event.step}</p>
                      <p className="mt-0.5 text-xs text-ink-500 leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Transcript + Translation */}
      <div className="card-raised p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-ink-900">Transcription & Translation</h3>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="btn-ghost text-sm"
          >
            {showTranslation ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Translation
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Translation
              </>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Original transcript */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-ink-400" />
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                Original Transcript — {getLangName(result.detectedLanguage)}
              </span>
            </div>
            <div className="rounded-lg bg-surface-sunken p-4 text-sm text-ink-700 leading-relaxed min-h-[120px]">
              {result.originalTranscript}
            </div>
          </div>

          {/* Translated transcript */}
          {showTranslation && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LanguagesIcon className="h-4 w-4 text-primary-500" />
                <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                  Translation — {getLangName(result.outputLanguage)}
                </span>
              </div>
              <div className="rounded-lg bg-primary-50/50 p-4 text-sm text-ink-700 leading-relaxed min-h-[120px] border border-primary-100">
                {result.translatedTranscript}
              </div>
            </div>
          )}
        </div>

        {result.detectedLanguage !== result.outputLanguage && (
          <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
            <LanguagesIcon className="h-3.5 w-3.5" />
            Translated from {getLangName(result.detectedLanguage)} to {getLangName(result.outputLanguage)}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/analyze" className="btn-primary">
          <Upload className="h-4 w-4" />
          Analyze Another Audio
        </Link>
        <Link to="/transcription" className="btn-secondary">
          <FileText className="h-4 w-4" />
          View in Transcription
        </Link>
        <Link to="/dashboard" className="btn-secondary">
          Back to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-white p-4">
      <div className="flex items-center gap-2 text-ink-400 mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className={`font-display text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-ink-400 shrink-0" />
      <span className="text-xs text-ink-400">{label}:</span>
      <span className="text-xs font-medium text-ink-700 truncate">{value}</span>
    </div>
  );
}
