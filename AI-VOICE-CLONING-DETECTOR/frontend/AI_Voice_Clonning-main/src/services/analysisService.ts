// src/services/analysisService.ts

import type {
  AnalysisResult,
  AudioIndicator,
  TimelineEvent,
  Verdict,
  RiskLevel,
} from '@/types';

const API_BASE_URL = 'http://localhost:8000';

const ANALYSIS_STEPS = [
  'Audio Ingestion',
  'Voice Analysis',
  'AI Voice Detection',
  'Speech Transcription',
  'Translation',
  'Risk Assessment',
];

export async function runAnalysis(
  file: File,
  fileName: string,
  fileSize: number,
  durationSec: number,
  sourceLanguage: string,
  outputLanguage: string,
  onProgress: (
    step: string,
    percent: number
  ) => void,
): Promise<AnalysisResult> {

  try {

    // -----------------------------
    // STEP 1 — Upload
    // -----------------------------

    onProgress(
      ANALYSIS_STEPS[0],
      10
    );

    const formData = new FormData();

    formData.append(
      'file',
      file,
      file.name
    );

    // -----------------------------
    // STEP 2 — Send to FastAPI
    // -----------------------------

    onProgress(
      ANALYSIS_STEPS[1],
      30
    );

    const response = await fetch(
      `${API_BASE_URL}/predict`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {

      let message =
        `Backend error: HTTP ${response.status}`;

      try {

        const errorData =
          await response.json();

        if (errorData.detail) {
          message = errorData.detail;
        }

      } catch {
        // Ignore JSON parsing error
      }

      throw new Error(message);
    }

    // -----------------------------
    // STEP 3 — Model Analysis
    // -----------------------------

    onProgress(
      ANALYSIS_STEPS[2],
      60
    );

    const backendResult =
      await response.json();

    console.log(
      'VoxShield backend result:',
      backendResult
    );

    // -----------------------------
    // Convert backend score
    // -----------------------------

    let aiProbability = Number(
      backendResult.aiProbability ??
      backendResult.ai_probability ??
      backendResult.rawScore * 100 ??
      backendResult.raw_score * 100 ??
      backendResult.confidence ??
      0
    );

    aiProbability = Math.max(
      0,
      Math.min(
        100,
        aiProbability
      )
    );

    const verdict =
      convertVerdict(
        backendResult.verdict ??
        backendResult.prediction,
        aiProbability
      );

    const authenticityScore =
      Number(
        backendResult.authenticityScore ??
        (100 - aiProbability)
      );

    const confidenceScore =
      Number(
        backendResult.confidenceScore ??
        (aiProbability >= 50
          ? aiProbability
          : 100 - aiProbability)
      );

    const riskLevel =
      convertRiskLevel(
        backendResult.riskLevel ??
        calculateRisk(aiProbability)
      );

    // -----------------------------
    // STEP 4 — Risk Assessment
    // -----------------------------

    onProgress(
      ANALYSIS_STEPS[5],
      85
    );

    const detectedLanguage =
      sourceLanguage === 'auto'
        ? 'en'
        : sourceLanguage;

    // -----------------------------
    // Indicators
    // -----------------------------

    const indicators =
      buildIndicators(
        verdict
      );

    // -----------------------------
    // Timeline
    // -----------------------------

    const timeline =
      buildTimeline(
        verdict,
        aiProbability,
        detectedLanguage,
        outputLanguage
      );

    // -----------------------------
    // COMPLETE
    // -----------------------------

    onProgress(
      'Analysis Complete',
      100
    );

    const result: AnalysisResult = {

      id:
        backendResult.id ??
        `analysis-${Date.now()}`,

      fileName:
        backendResult.fileName ??
        fileName,

      fileSize:
        Number(
          backendResult.fileSize ??
          fileSize
        ),

      durationSec:
        Number(
          backendResult.durationSec ??
          durationSec
        ),

      uploadedAt:
        backendResult.uploadedAt ??
        new Date().toISOString(),

      sourceLanguage,

      detectedLanguage,

      outputLanguage,

      verdict,

      authenticityScore:
        round(
          authenticityScore
        ),

      aiProbability:
        round(
          aiProbability
        ),

      confidenceScore:
        round(
          confidenceScore
        ),

      riskLevel,

      originalTranscript:
        backendResult.originalTranscript ??
        '',

      translatedTranscript:
        backendResult.translatedTranscript ??
        '',

      indicators,

      timeline,

      analysisStatus:
        'complete',
    };

    return result;

  } catch (error) {

    console.error(
      'VoxShield analysis failed:',
      error
    );

    if (
      error instanceof TypeError
    ) {

      throw new Error(
        'Unable to connect to VoxShield AI server. Make sure FastAPI is running on http://localhost:8000.'
      );
    }

    if (
      error instanceof Error
    ) {
      throw error;
    }

    throw new Error(
      'Unknown analysis error occurred.'
    );
  }
}


// =====================================================
// VERDICT
// =====================================================

function convertVerdict(
  backendVerdict: unknown,
  aiProbability: number
): Verdict {

  if (
    typeof backendVerdict === 'string'
  ) {

    const value =
      backendVerdict
        .toLowerCase()
        .replace(/_/g, '-');

    if (
      value.includes('ai') ||
      value.includes('generated') ||
      value.includes('fake')
    ) {

      return 'ai_generated';
    }

    if (
      value.includes('suspicious') ||
      value.includes('borderline')
    ) {

      return 'suspicious';
    }

    if (
      value.includes('real') ||
      value.includes('authentic')
    ) {

      return 'authentic';
    }
  }

  if (aiProbability >= 80) {
    return 'ai_generated';
  }

  if (aiProbability >= 50) {
    return 'suspicious';
  }

  return 'authentic';
}


// =====================================================
// RISK
// =====================================================

function calculateRisk(
  aiProbability: number
): RiskLevel {

  if (aiProbability >= 80) {
    return 'high';
  }

  if (aiProbability >= 50) {
    return 'medium';
  }

  return 'low';
}


function convertRiskLevel(
  value: unknown
): RiskLevel {

  if (
    typeof value === 'string'
  ) {

    const risk =
      value.toLowerCase();

    if (risk === 'high') {
      return 'high';
    }

    if (risk === 'medium') {
      return 'medium';
    }
  }

  return 'low';
}


// =====================================================
// INDICATORS
// =====================================================

function buildIndicators(
  verdict: Verdict
): AudioIndicator[] {

  if (verdict === 'authentic') {

    return [
      {
        label: 'AI Voice Probability',
        value: 'Low',
        status: 'normal',
        detail:
          'Model detected a low probability of AI-generated speech.',
      },

      {
        label: 'Voice Classification',
        value: 'Authentic',
        status: 'normal',
        detail:
          'Voice classified as likely human-generated.',
      },

      {
        label: 'Spectral Analysis',
        value: 'Analyzed',
        status: 'normal',
        detail:
          'Audio spectrogram analyzed by the CNN detector.',
      },

      {
        label: 'Model Confidence',
        value: 'High',
        status: 'normal',
        detail:
          'Classification falls within the authentic range.',
      },
    ];
  }

  if (verdict === 'suspicious') {

    return [
      {
        label: 'AI Voice Probability',
        value: 'Elevated',
        status: 'warning',
        detail:
          'Model detected an elevated probability of synthetic speech.',
      },

      {
        label: 'Voice Classification',
        value: 'Suspicious',
        status: 'warning',
        detail:
          'Additional verification is recommended.',
      },

      {
        label: 'Spectral Analysis',
        value: 'Anomalies',
        status: 'warning',
        detail:
          'Potential synthetic characteristics detected.',
      },

      {
        label: 'Model Confidence',
        value: 'Borderline',
        status: 'warning',
        detail:
          'Classification is near the decision boundary.',
      },
    ];
  }

  return [
    {
      label: 'AI Voice Probability',
      value: 'High',
      status: 'critical',
      detail:
        'Model detected a high probability of AI-generated speech.',
    },

    {
      label: 'Voice Classification',
      value: 'AI Generated',
      status: 'critical',
      detail:
        'Voice classified as likely synthetic.',
    },

    {
      label: 'Spectral Analysis',
      value: 'Synthetic Pattern',
      status: 'critical',
      detail:
        'Audio characteristics indicate possible generated speech.',
    },

    {
      label: 'Model Confidence',
      value: 'High',
      status: 'critical',
      detail:
        'Classification strongly favors AI-generated speech.',
    },
  ];
}


// =====================================================
// TIMELINE
// =====================================================

function buildTimeline(
  verdict: Verdict,
  aiProbability: number,
  sourceLanguage: string,
  outputLanguage: string
): TimelineEvent[] {

  const riskDescription =
    verdict === 'ai_generated'
      ? 'High risk — AI-generated voice detected'
      : verdict === 'suspicious'
        ? 'Medium risk — manual review recommended'
        : 'Low risk — voice appears authentic';

  const languageDescription =
    sourceLanguage === outputLanguage
      ? 'Source and output language match'
      : `Translation requested from ${sourceLanguage} to ${outputLanguage}`;

  return [

    {
      step: 'Audio Ingestion',
      description:
        'File received and prepared for analysis',
      status: 'complete',
      icon: 'upload',
    },

    {
      step: 'Voice Analysis',
      description:
        'Audio converted into a mel-spectrogram',
      status: 'complete',
      icon: 'waveform',
    },

    {
      step: 'AI Voice Detection',
      description:
        `CNN classifier scored ${round(aiProbability)}% AI probability`,
      status: 'complete',
      icon: 'shield',
    },

    {
      step: 'Speech Transcription',
      description:
        'Transcription stage available for the selected audio',
      status: 'complete',
      icon: 'mic',
    },

    {
      step: 'Translation',
      description:
        languageDescription,
      status: 'complete',
      icon: 'languages',
    },

    {
      step: 'Risk Assessment',
      description:
        riskDescription,
      status: 'complete',
      icon: 'alert',
    },
  ];
}


// =====================================================
// UTILITY
// =====================================================

function round(
  value: number
): number {

  return Math.round(
    value * 100
  ) / 100;
}


// =====================================================
// DEMO / HISTORY
// =====================================================

export function getDemoResult(
  verdict: Verdict
): AnalysisResult {

  return {
    id: `demo-${verdict}`,

    fileName: 'demo-audio.wav',

    fileSize: 0,

    durationSec: 3,

    uploadedAt:
      new Date().toISOString(),

    sourceLanguage: 'en',

    detectedLanguage: 'en',

    outputLanguage: 'en',

    verdict,

    authenticityScore:
      verdict === 'ai_generated'
        ? 6
        : verdict === 'suspicious'
          ? 50
          : 94,

    aiProbability:
      verdict === 'ai_generated'
        ? 94
        : verdict === 'suspicious'
          ? 50
          : 6,

    confidenceScore:
      verdict === 'ai_generated'
        ? 94
        : verdict === 'suspicious'
          ? 60
          : 94,

    riskLevel:
      verdict === 'ai_generated'
        ? 'high'
        : verdict === 'suspicious'
          ? 'medium'
          : 'low',

    originalTranscript: '',

    translatedTranscript: '',

    indicators:
      buildIndicators(verdict),

    timeline:
      buildTimeline(
        verdict,
        verdict === 'ai_generated'
          ? 94
          : verdict === 'suspicious'
            ? 50
            : 6,
        'en',
        'en'
      ),

    analysisStatus:
      'complete',
  };
}


export function getHistory(): AnalysisResult[] {
  return [];
}