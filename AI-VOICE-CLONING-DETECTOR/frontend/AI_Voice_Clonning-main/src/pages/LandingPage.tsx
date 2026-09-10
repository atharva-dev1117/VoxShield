import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Upload,
  Mic,
  Languages,
  Lock,
  Brain,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileAudio,
  ScanLine,
  Gauge,
  FileText,
  BellRing,
  Sparkles,
} from 'lucide-react';

const STATS = [
  { value: '90%+', label: 'AI voice detection accuracy' },
  { value: '6', label: 'Indian languages supported' },
  { value: '<5s', label: 'Real-time analysis latency' },
  { value: '24/7', label: 'Continuous monitoring' },
];

const WORKFLOW_STEPS = [
  { icon: FileAudio, title: 'Audio / Call', desc: 'Upload an audio file or record a live call' },
  { icon: ScanLine, title: 'Speech & Voice Analysis', desc: 'Extract spectral features and voice embeddings' },
  { icon: Brain, title: 'AI Voice Detection', desc: 'Classifier scores AI-generated probability' },
  { icon: Gauge, title: 'Risk Assessment', desc: 'Confidence and authenticity score calculated' },
  { icon: FileText, title: 'Transcription', desc: 'Speech converted to text in source language' },
  { icon: Languages, title: 'Translation', desc: 'Translated to your preferred output language' },
  { icon: BellRing, title: 'User Alert / Result', desc: 'Clear verdict with actionable recommendations' },
];

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Voice Detection',
    desc: 'Our model analyzes spectral artifacts, pitch consistency, breath patterns, and voice embeddings to distinguish genuine human speech from AI-generated clones.',
  },
  {
    icon: Languages,
    title: 'Multilingual Transcription',
    desc: 'Transcribe and translate calls across English, Hindi, Marathi, Telugu, Tamil, and Bengali — with automatic source language detection.',
  },
  {
    icon: Gauge,
    title: 'Risk Scoring',
    desc: 'Every analysis produces an authenticity score, AI probability, confidence level, and risk rating — so you know exactly how much to trust the voice.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    desc: 'Audio is processed for analysis and never stored longer than needed. Your conversations remain confidential and secure.',
  },
];

const THREAT_SCENARIOS = [
  {
    icon: AlertTriangle,
    title: 'CEO Fraud Calls',
    desc: 'Attackers clone an executive\u2019s voice to authorize fraudulent wire transfers.',
  },
  {
    icon: ShieldCheck,
    title: 'Bank Impersonation',
    desc: 'Synthetic voices impersonate bank staff to extract OTPs and credentials.',
  },
  {
    icon: Mic,
    title: 'Identity Spoofing',
    desc: 'Voice biometric systems bypassed using high-quality cloned voice samples.',
  },
];

export function LandingPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-100/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-teal-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-semibold text-primary-700">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Voice Security
              </div>
              <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 leading-[1.1]">
                Detect AI-generated voices before they deceive you.
              </h1>
              <p className="mt-6 text-lg text-ink-600 leading-relaxed max-w-xl">
                VoxShield AI analyzes audio in real time to identify voice cloning and impersonation attacks —
                with multilingual transcription across six Indian languages.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/analyze" className="btn-primary text-base px-6 py-3">
                  <Upload className="h-5 w-5" />
                  Upload & Analyze Audio
                </Link>
                <Link to="/dashboard" className="btn-secondary text-base px-6 py-3">
                  View Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-ink-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  No signup required for demo
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-ink-400" />
                  Privacy-first
                </span>
              </div>
            </div>

            {/* Hero visual: mock analysis card */}
            <div className="relative lg:pl-8">
              <div className="card-raised p-6 animate-slide-up">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-ink-900">Live Analysis</span>
                  </div>
                  <span className="badge badge-high">High Risk</span>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 border-4 border-red-100">
                    <span className="font-display text-2xl font-bold text-red-600">94%</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">AI Probability</p>
                    <p className="text-lg font-bold text-ink-900">AI Voice Detected</p>
                    <p className="text-sm text-ink-500">voice-clone-attempt.mp3</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {['Spectral Artifacts', 'No Breath Patterns', 'Vocoder Signature', 'Synthetic Pitch'].map((tag) => (
                    <div key={tag} className="flex items-center gap-2 rounded-lg bg-red-50/50 px-3 py-2 text-xs text-red-700">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      {tag}
                    </div>
                  ))}
                </div>

                <div className="mt-5 h-12">
                  <div className="flex items-center justify-center gap-[3px] h-full">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[3px] rounded-full bg-red-300"
                        style={{
                          height: `${30 + Math.sin(i * 0.4) * 25 + Math.cos(i * 0.8) * 15}%`,
                          opacity: 0.6,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating authentic card */}
              <div className="hidden sm:block absolute -bottom-6 -left-4 card p-4 w-56 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span className="text-xs font-semibold text-teal-700">Authentic Voice</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-ink-900">95%</span>
                  <span className="text-xs text-ink-400">authenticity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-surface-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl sm:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="mt-1.5 text-sm text-ink-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Threat scenarios */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900">The voice cloning threat</h2>
            <p className="mt-4 text-lg text-ink-600">
              AI voice cloning tools can now replicate a person\u2019s voice from just seconds of audio.
              These attacks are being used to deceive individuals and organizations in real time.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {THREAT_SCENARIOS.map((scenario) => (
              <div key={scenario.title} className="card p-6 hover:shadow-card-lg transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <scenario.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{scenario.title}</h3>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">{scenario.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900">How it works</h2>
            <p className="mt-4 text-lg text-ink-600">
              From audio upload to actionable result in seconds. Every step is transparent and verifiable.
            </p>
          </div>

          <div className="mt-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WORKFLOW_STEPS.map((step, i) => (
                <div key={step.title} className="relative">
                  <div className="card p-5 h-full">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 shrink-0">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className="font-display text-sm font-bold text-ink-300">0{i + 1}</span>
                    </div>
                    <h3 className="mt-4 font-semibold text-ink-900 text-sm">{step.title}</h3>
                    <p className="mt-1.5 text-xs text-ink-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                      <ArrowRight className="h-4 w-4 text-ink-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900">Built for voice security</h2>
            <p className="mt-4 text-lg text-ink-600">
              Every feature is designed to help you make fast, confident decisions about voice authenticity.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card p-6 hover:shadow-card-lg transition-shadow">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 shrink-0">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink-900">{feature.title}</h3>
                    <p className="mt-2 text-sm text-ink-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & privacy */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-100 px-4 py-1.5 text-xs font-semibold text-teal-700">
                <Lock className="h-3.5 w-3.5" />
                Security & Privacy
              </div>
              <h2 className="mt-5 font-display text-3xl sm:text-4xl font-bold text-ink-900">
                Your audio never leaves your control
              </h2>
              <p className="mt-4 text-lg text-ink-600 leading-relaxed">
                VoxShield AI is built with a privacy-first approach. Audio is processed for analysis and results
                are delivered with full transparency — you see exactly why a voice was classified the way it was.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'No persistent storage of raw audio without consent',
                  'Full detection explanation with every result',
                  'Confidence scores so you can calibrate trust',
                  'Designed for accessibility and color-vision deficiencies',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                    <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-raised p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-ink-900">Trust Model</p>
                  <p className="text-xs text-ink-400">How we communicate confidence</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Authentic Voice', desc: 'Low risk — safe to proceed', color: 'bg-teal-500', text: 'text-teal-700', bg: 'bg-teal-50' },
                  { label: 'Suspicious Voice', desc: 'Medium risk — verify identity', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
                  { label: 'AI Voice Detected', desc: 'High risk — do not trust', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center gap-3 rounded-lg ${item.bg} p-3.5`}>
                    <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${item.text}`}>{item.label}</p>
                      <p className="text-xs text-ink-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Protect your conversations today
          </h2>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
            Upload an audio file or record a call to see how VoxShield AI detects voice cloning in real time.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary-700 hover:bg-primary-50 transition-colors active:scale-[0.98]"
            >
              <Upload className="h-5 w-5" />
              Start Analyzing
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Learn How It Works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
