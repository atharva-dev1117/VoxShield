import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Shield,
  Sliders,
  Save,
  Check,
  Moon,
  Sun,
  Volume2,
  Lock,
} from 'lucide-react';
import { useAnalysis } from '@/context/AnalysisContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SUPPORTED_LANGUAGES } from '@/types';

type Tab = 'general' | 'languages' | 'notifications' | 'privacy';

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'general', label: 'General', icon: SettingsIcon },
  { key: 'languages', label: 'Languages', icon: Globe },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'privacy', label: 'Privacy & Security', icon: Shield },
];

export function SettingsPage() {
  const { outputLanguage, setOutputLanguage, sourceLanguage, setSourceLanguage } = useAnalysis();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    defaultOutputLang: outputLanguage,
    defaultSourceLang: sourceLanguage,
    highRiskAlerts: true,
    suspiciousAlerts: true,
    weeklyReports: false,
    autoAnalyze: true,
    retainAudio: false,
    shareAnonymized: true,
    twoFactor: false,
  });

  const handleSave = () => {
    setOutputLanguage(settings.defaultOutputLang);
    setSourceLanguage(settings.defaultSourceLang);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = (key: keyof typeof settings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">Configure your VoxShield AI preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="lg:col-span-1">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key ? 'bg-primary-50 text-primary-700' : 'text-ink-600 hover:bg-surface-sunken'
                }`}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card-raised p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <SectionTitle icon={SettingsIcon} title="General Preferences" desc="Application-wide settings" />

                <ToggleRow
                  icon={Volume2}
                  title="Auto-play audio after analysis"
                  desc="Automatically play the uploaded audio when viewing results"
                  checked={settings.autoAnalyze}
                  onChange={(v) => update('autoAnalyze', v)}
                />

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-ink-700 mb-3">
                    <Sliders className="h-4 w-4 text-ink-400" />
                    Detection Sensitivity
                  </label>
                  <div className="flex gap-2">
                    {['Low', 'Balanced', 'High'].map((level) => (
                      <button
                        key={level}
                        className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                          level === 'Balanced'
                            ? 'border-primary-300 bg-primary-50 text-primary-700'
                            : 'border-surface-border bg-white text-ink-600 hover:bg-surface-sunken'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-ink-400">Balanced sensitivity is recommended for most use cases</p>
                </div>

                <ToggleRow
                  icon={Sun}
                  title="Light interface"
                  desc="Use a light color scheme optimized for readability"
                  checked={true}
                  onChange={() => {}}
                />
              </div>
            )}

            {activeTab === 'languages' && (
              <div className="space-y-6">
                <SectionTitle icon={Globe} title="Language Preferences" desc="Default languages for analysis" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-600 mb-1.5">Default Source Language</label>
                    <LanguageSelector
                      value={settings.defaultSourceLang}
                      onChange={(v) => update('defaultSourceLang', v)}
                      includeAuto
                      id="set-source"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-600 mb-1.5">Default Output Language</label>
                    <LanguageSelector
                      value={settings.defaultOutputLang}
                      onChange={(v) => update('defaultOutputLang', v)}
                      id="set-output"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-ink-700 mb-3">Supported Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <span key={lang.code} className="badge badge-neutral">
                        {lang.name} <span className="text-ink-400">({lang.nativeName})</span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-ink-400">More languages can be added as the detection models are trained.</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <SectionTitle icon={Bell} title="Notification Preferences" desc="Choose when to be alerted" />

                <ToggleRow
                  icon={Shield}
                  title="High-risk alerts"
                  desc="Get notified immediately when an AI-generated voice is detected"
                  checked={settings.highRiskAlerts}
                  onChange={(v) => update('highRiskAlerts', v)}
                />

                <ToggleRow
                  icon={SettingsIcon}
                  title="Suspicious voice alerts"
                  desc="Get notified when a voice is flagged as suspicious"
                  checked={settings.suspiciousAlerts}
                  onChange={(v) => update('suspiciousAlerts', v)}
                />

                <ToggleRow
                  icon={Bell}
                  title="Weekly summary reports"
                  desc="Receive a weekly digest of all analyses"
                  checked={settings.weeklyReports}
                  onChange={(v) => update('weeklyReports', v)}
                />
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <SectionTitle icon={Shield} title="Privacy & Security" desc="Control your data and security settings" />

                <ToggleRow
                  icon={Lock}
                  title="Retain audio after analysis"
                  desc="Keep uploaded audio files for future reference. Disabled by default."
                  checked={settings.retainAudio}
                  onChange={(v) => update('retainAudio', v)}
                />

                <ToggleRow
                  icon={Shield}
                  title="Share anonymized metrics"
                  desc="Help improve detection accuracy by sharing anonymous analysis metrics"
                  checked={settings.shareAnonymized}
                  onChange={(v) => update('shareAnonymized', v)}
                />

                <ToggleRow
                  icon={Lock}
                  title="Two-factor authentication"
                  desc="Require a second verification step when signing in"
                  checked={settings.twoFactor}
                  onChange={(v) => update('twoFactor', v)}
                />

                <div className="rounded-lg bg-surface-sunken p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-ink-700">Privacy-first by design</p>
                      <p className="mt-1 text-xs text-ink-500 leading-relaxed">
                        VoxShield AI does not store raw audio unless you explicitly enable retention. All analysis
                        results are encrypted and accessible only to you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="mt-8 pt-5 border-t border-surface-border flex items-center justify-end gap-3">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-teal-600 font-medium animate-fade-in">
                  <Check className="h-4 w-4" />
                  Settings saved
                </span>
              )}
              <button onClick={handleSave} className="btn-primary">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-display text-lg font-bold text-ink-900">{title}</h2>
        <p className="text-sm text-ink-500">{desc}</p>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  desc,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-sunken text-ink-500 shrink-0">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-800">{title}</p>
          <p className="text-xs text-ink-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-ink-200'}`}
        role="switch"
        aria-checked={checked}
        aria-label={title}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
