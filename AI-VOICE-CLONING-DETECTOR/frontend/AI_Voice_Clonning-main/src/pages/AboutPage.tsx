import { Link } from 'react-router-dom';
import {
  FileAudio,
  ScanLine,
  Brain,
  Gauge,
  FileText,
  Languages,
  BellRing,
  ArrowRight,
  Upload,
  ShieldCheck,
  Mic,
  AudioWaveform,
  Sparkles,
  CheckCircle2,
  Activity,
  Lock,
} from 'lucide-react';

const PIPELINE = [
  {
    icon: FileAudio,
    title: 'Audio / Call Input',
    desc: 'User uploads an audio file or records a live call. The audio is decoded and normalized to 16kHz mono for consistent processing.',
  },
  {
    icon: ScanLine,
    title: 'Speech & Voice Analysis',
    desc: 'The system extracts spectral features, pitch contours, breath patterns, and voice embeddings from the audio signal.',
  },
  {
    icon: Brain,
    title: 'AI Voice Detection',
    desc: 'A trained classifier analyzes the extracted features to determine the probability that the voice is AI-generated or cloned.',
  },
  {
    icon: Gauge,
    title: 'Risk Assessment',
    desc: 'The AI probability, spectral artifact count, and embedding distance are combined into an authenticity score and risk level.',
  },
  {
    icon: FileText,
    title: 'Transcription',
    desc: 'The speech is transcribed into text using automatic speech recognition, preserving the source language.',
  },
  {
    icon: Languages,
    title: 'Translation',
    desc: 'The transcript is translated into the user\u2019s preferred output language using neural machine translation.',
  },
  {
    icon: BellRing,
    title: 'User Alert / Result',
    desc: 'A clear verdict is presented with the authenticity score, risk level, detection explanation, and actionable recommendations.',
  },
];

const DETECTION_SIGNALS = [
  { icon: AudioWaveform, title: 'Spectral Artifacts', desc: 'AI-generated voices often exhibit unnatural frequency patterns from vocoder synthesis' },
  { icon: Activity, title: 'Pitch Consistency', desc: 'Human voices have natural micro-jitter; cloned voices tend to be artificially smooth' },
  { icon: Mic, title: 'Breath Patterns', desc: 'Absence of breathing sounds is a strong indicator of synthetic speech' },
  { icon: Brain, title: 'Voice Embeddings', desc: 'Embedding distance from known human baselines reveals TTS model signatures' },
];

const STATS = [
  { value: '90%+', label: 'Detection accuracy' },
  { value: '6', label: 'Languages supported' },
  { value: '<5s', label: 'Analysis latency' },
  { value: '7', label: 'Pipeline stages' },
];

export function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50/50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-semibold text-primary-700">
            <Sparkles className="h-3.5 w-3.5" />
            How VoxShield AI Works
          </div>
          <h1 className="mt-5 font-display text-3xl sm:text-5xl font-bold text-ink-900 leading-tight">
            From audio upload to trusted verdict in seconds
          </h1>
          <p className="mt-5 text-lg text-ink-600 max-w-2xl mx-auto">
            VoxShield AI uses machine learning to detect AI-generated and cloned voices, transcribe speech, and
            translate across six Indian languages — all in real time.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/analyze" className="btn-primary text-base px-6 py-3">
              <Upload className="h-5 w-5" />
              Try It Now
            </Link>
            <Link to="/dashboard" className="btn-secondary text-base px-6 py-3">
              View Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-surface-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-bold text-primary-600">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900">The Detection Pipeline</h2>
            <p className="mt-4 text-lg text-ink-600">
              Every analysis follows a transparent, step-by-step process — from raw audio to actionable verdict.
            </p>
          </div>

          <div className="space-y-4">
            {PIPELINE.map((step, i) => (
              <div key={step.title} className="flex gap-4 sm:gap-6">
                {/* Step number + line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
                    <step.icon className="h-5 w-5" />
                  </div>
                  {i < PIPELINE.length - 1 && <div className="w-px flex-1 bg-surface-border mt-2 min-h-[24px]" />}
                </div>

                {/* Content */}
                <div className="card p-5 flex-1 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-display text-xs font-bold text-primary-600">STEP {i + 1}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detection signals */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900">What the AI looks for</h2>
            <p className="mt-4 text-lg text-ink-600">
              VoxShield AI analyzes multiple acoustic and behavioral signals to distinguish human speech from
              AI-generated clones.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {DETECTION_SIGNALS.map((signal) => (
              <div key={signal.title} className="card p-6 hover:shadow-card-lg transition-shadow">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 shrink-0">
                    <signal.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink-900">{signal.title}</h3>
                    <p className="mt-2 text-sm text-ink-500 leading-relaxed">{signal.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verdict system */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900">How we communicate results</h2>
            <p className="mt-4 text-lg text-ink-600">
              Every result is classified into one of three clear categories with a confidence score.
            </p>
          </div>

          <div className="space-y-4">
            <VerdictCard
              icon={ShieldCheck}
              color="text-teal-600 bg-teal-50 border-teal-200"
              title="Authentic Voice"
              score="90-100% authenticity"
              desc="The audio is very likely a genuine human voice. Low risk — safe to proceed with the conversation."
            />
            <VerdictCard
              icon={Activity}
              color="text-amber-600 bg-amber-50 border-amber-200"
              title="Suspicious Voice"
              score="40-89% authenticity"
              desc="The audio shows some signs of manipulation but is not conclusive. Medium risk — verify the caller\u2019s identity through another channel."
            />
            <VerdictCard
              icon={ShieldCheck}
              color="text-red-600 bg-red-50 border-red-200"
              title="AI Voice Detected"
              score="0-39% authenticity"
              desc="The audio is very likely AI-generated or cloned. High risk — do not trust the voice and do not share sensitive information."
            />
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="card-raised p-8 sm:p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mx-auto mb-5">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">Privacy by design</h2>
            <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">
              Audio is processed for analysis and not stored unless you explicitly enable retention. All results
              are encrypted and accessible only to you. The system is designed to be accessible to users with
              color-vision deficiencies.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['No persistent audio storage', 'Encrypted results', 'Accessible design', 'Full transparency'].map((item) => (
                <span key={item} className="flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Ready to detect voice cloning?</h2>
          <p className="mt-3 text-primary-100">Upload an audio file and see the full pipeline in action.</p>
          <Link
            to="/analyze"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary-700 hover:bg-primary-50 transition-colors active:scale-[0.98]"
          >
            <Upload className="h-5 w-5" />
            Start Analyzing
          </Link>
        </div>
      </section>
    </div>
  );
}

function VerdictCard({
  icon: Icon,
  color,
  title,
  score,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  score: string;
  desc: string;
}) {
  return (
    <div className={`flex items-start gap-4 rounded-xl border-2 p-5 ${color}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/60 shrink-0">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
          <span className="text-xs font-semibold text-ink-600">{score}</span>
        </div>
        <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
