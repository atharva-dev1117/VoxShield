export type RiskLevel = 'low' | 'medium' | 'high';
export type Verdict = 'authentic' | 'suspicious' | 'ai_generated';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface AudioIndicator {
  label: string;
  value: string;
  status: 'normal' | 'warning' | 'critical';
  detail: string;
}

export interface TimelineEvent {
  step: string;
  description: string;
  status: 'complete' | 'processing' | 'pending';
  icon: string;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  fileSize: number;
  durationSec: number;
  uploadedAt: string;
  sourceLanguage: string;
  detectedLanguage: string;
  outputLanguage: string;
  verdict: Verdict;
  authenticityScore: number;
  aiProbability: number;
  confidenceScore: number;
  riskLevel: RiskLevel;
  originalTranscript: string;
  translatedTranscript: string;
  indicators: AudioIndicator[];
  timeline: TimelineEvent[];
  analysisStatus: 'complete' | 'processing' | 'failed';
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'GB' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: 'IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: 'IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: 'IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: 'IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: 'IN' },
];

export const VERDICT_LABELS: Record<Verdict, string> = {
  authentic: 'Authentic Voice',
  suspicious: 'Suspicious Voice',
  ai_generated: 'AI Voice Detected',
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
};
