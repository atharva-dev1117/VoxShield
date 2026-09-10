import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  FileText,
  Languages as LanguagesIcon,
  Upload,
  ArrowRight,
  ArrowLeftRight,
  Copy,
  Check,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { useAnalysis } from '@/context/AnalysisContext';
import { getHistory } from '@/services/analysisService';
import { SUPPORTED_LANGUAGES } from '@/types';
import { LanguageSelector } from '@/components/LanguageSelector';
import { AudioPlayer } from '@/components/AudioVisualizer';

function getLangName(code: string): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name || code;
}

function getLangNative(code: string): string {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code)?.nativeName || code;
}

export function TranscriptionPage() {
  const { currentResult, outputLanguage, setOutputLanguage } = useAnalysis();
  const history = getHistory();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<'original' | 'translated' | null>(null);

  const result = currentResult || history.find((h) => h.id === selectedId) || history[0] || null;

  const handleCopy = (text: string, which: 'original' | 'translated') => {
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!result) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
        <div className="card p-12">
          <FileText className="h-12 w-12 text-ink-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-ink-900">No transcripts available</h2>
          <p className="mt-2 text-sm text-ink-500">Analyze audio to generate transcripts and translations.</p>
          <Link to="/analyze" className="mt-6 btn-primary inline-flex">
            <Upload className="h-4 w-4" />
            Analyze Audio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">Transcription & Translation</h1>
        <p className="mt-1 text-sm text-ink-500">View and translate transcripts across supported languages</p>
      </div>

      {/* Audio player for current result */}
      <div className="mb-6">
        <AudioPlayer fileName={result.fileName} durationSec={result.durationSec} />
      </div>

      {/* Language info bar */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-sunken text-ink-500">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Source Language</p>
              <p className="text-sm font-semibold text-ink-800">
                {getLangName(result.sourceLanguage)}{' '}
                <span className="text-ink-400 font-normal">({getLangNative(result.sourceLanguage)})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <LanguagesIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-ink-400">Output Language</p>
              <LanguageSelector value={outputLanguage} onChange={setOutputLanguage} id="trans-output-lang" />
            </div>
          </div>
        </div>
      </div>

      {/* Detected language info */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Sparkles className="h-4 w-4 text-primary-500" />
        <span className="text-ink-600">
          Detected language: <span className="font-semibold text-ink-800">{getLangName(result.detectedLanguage)}</span>
        </span>
      </div>

      {/* Transcript cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="card-raised p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-ink-400" />
              <div>
                <h3 className="font-semibold text-ink-900 text-sm">Original Transcript</h3>
                <p className="text-xs text-ink-400">{getLangName(result.detectedLanguage)}</p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(result.originalTranscript, 'original')}
              className="btn-ghost text-xs"
              aria-label="Copy original transcript"
            >
              {copied === 'original' ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === 'original' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="rounded-lg bg-surface-sunken p-4 text-sm text-ink-700 leading-relaxed min-h-[200px]">
            {result.originalTranscript}
          </div>
        </div>

        {/* Translated */}
        <div className="card-raised p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LanguagesIcon className="h-5 w-5 text-primary-500" />
              <div>
                <h3 className="font-semibold text-ink-900 text-sm">Translated Transcript</h3>
                <p className="text-xs text-ink-400">{getLangName(outputLanguage)}</p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(result.translatedTranscript, 'translated')}
              className="btn-ghost text-xs"
              aria-label="Copy translated transcript"
            >
              {copied === 'translated' ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === 'translated' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="rounded-lg bg-primary-50/40 p-4 text-sm text-ink-700 leading-relaxed min-h-[200px] border border-primary-100">
            {result.translatedTranscript}
          </div>
        </div>
      </div>

      {/* History list — pick another transcript */}
      <div className="mt-8 card p-5">
        <h3 className="text-sm font-semibold text-ink-700 mb-4">Other Transcripts</h3>
        <div className="space-y-2">
          {history
            .filter((h) => h.id !== result.id)
            .slice(0, 5)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="w-full flex items-center gap-3 rounded-lg border border-surface-border p-3 text-left hover:bg-surface-sunken transition-colors group"
              >
                <FileText className="h-4 w-4 text-ink-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-800 truncate">{item.fileName}</p>
                  <p className="text-xs text-ink-400">
                    {getLangName(item.detectedLanguage)} → {getLangName(item.outputLanguage)}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-ink-300 group-hover:text-primary-500" />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
