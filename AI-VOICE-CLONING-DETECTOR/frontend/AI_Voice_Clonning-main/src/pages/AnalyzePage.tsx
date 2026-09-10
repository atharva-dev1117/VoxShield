// src/services/analysisService.ts

export interface AnalysisResult {
  id: string;
  fileName: string;
  fileSize: number;
  durationSec: number;
  sourceLanguage: string;
  outputLanguage: string;

  verdict: "REAL" | "AI-GENERATED";
  aiProbability: number;
  authenticityScore: number;
  confidenceScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";

  rawScore: number;
  analysisStatus: string;
  model: string;
  modelType: string;

  uploadedAt: string;
}

const API_BASE_URL = "http://localhost:8000";

/**
 * Analyze an actual audio file using the FastAPI + ONNX backend.
 */
export async function runAnalysis(
  file: File,
  fileName: string,
  fileSize: number,
  durationSec: number,
  sourceLanguage: string,
  outputLanguage: string,
  onProgress?: (step: string, percent: number) => void,
): Promise<AnalysisResult> {
  try {
    // Step 1
    onProgress?.("Uploading audio...", 10);

    const formData = new FormData();

    // IMPORTANT:
    // This is the actual audio file being sent to FastAPI.
    formData.append("file", file, file.name);

    // Step 2
    onProgress?.("Sending audio to AI detector...", 30);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
    });

    // Backend error
    if (!response.ok) {
      let errorMessage = `Backend returned HTTP ${response.status}`;

      try {
        const errorData = await response.json();

        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // Ignore JSON parsing error
      }

      throw new Error(errorMessage);
    }

    // Step 3
    onProgress?.("Analyzing voice with ONNX model...", 60);

    const backendResult = await response.json();

    // Step 4
    onProgress?.("Calculating authenticity and risk...", 85);

    const aiProbability = Number(
      backendResult.aiProbability ??
      backendResult.confidence ??
      backendResult.raw_score * 100 ??
      0,
    );

    const verdict =
      backendResult.verdict ??
      backendResult.prediction ??
      (aiProbability >= 50 ? "AI-GENERATED" : "REAL");

    const authenticityScore =
      backendResult.authenticityScore ??
      (100 - aiProbability);

    const confidenceScore =
      backendResult.confidenceScore ??
      (aiProbability >= 50 ? aiProbability : 100 - aiProbability);

    const riskLevel =
      backendResult.riskLevel ??
      calculateRisk(aiProbability);

    // Step 5
    onProgress?.("Analysis complete", 100);

    const result: AnalysisResult = {
      id:
        backendResult.id ??
        `analysis-${Date.now()}`,

      fileName:
        backendResult.fileName ??
        fileName,

      fileSize:
        backendResult.fileSize ??
        fileSize,

      durationSec:
        backendResult.durationSec ??
        durationSec,

      sourceLanguage,

      outputLanguage,

      verdict:
        verdict === "AI-GENERATED"
          ? "AI-GENERATED"
          : "REAL",

      aiProbability: roundNumber(aiProbability),

      authenticityScore: roundNumber(
        authenticityScore,
      ),

      confidenceScore: roundNumber(
        confidenceScore,
      ),

      riskLevel:
        riskLevel === "HIGH"
          ? "HIGH"
          : riskLevel === "MEDIUM"
            ? "MEDIUM"
            : "LOW",

      rawScore: Number(
        backendResult.rawScore ??
        backendResult.raw_score ??
        aiProbability / 100,
      ),

      analysisStatus:
        backendResult.analysisStatus ??
        "completed",

      model:
        backendResult.model ??
        "voice_detector.onnx",

      modelType:
        backendResult.modelType ??
        "CNN + ONNX Runtime",

      uploadedAt:
        backendResult.uploadedAt ??
        new Date().toISOString(),
    };

    return result;

  } catch (error) {
    console.error(
      "Voice analysis failed:",
      error,
    );

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the AI detection server. Make sure FastAPI is running on port 8000.",
      );
    }

    throw error;
  }
}


/**
 * Calculate risk level from AI probability.
 */
function calculateRisk(
  aiProbability: number,
): "LOW" | "MEDIUM" | "HIGH" {
  if (aiProbability >= 80) {
    return "HIGH";
  }

  if (aiProbability >= 50) {
    return "MEDIUM";
  }

  return "LOW";
}


/**
 * Keep numbers clean for the UI.
 */
function roundNumber(
  value: number,
): number {
  return Math.round(value * 100) / 100;
}