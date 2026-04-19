import { buildCompatibility } from "./compatibility";
import { analyzeLayers } from "./layers";
import { extractMetadata } from "./metadata";
import { buildOptimizationSuggestions } from "./optimization";
import { computePerformanceScore } from "./performance";
import { scanLottie } from "./scan";
import type { LottieAnalysisResult, LottieJson } from "./types";

export interface AnalyzeLottieOptions {
  fileSizeBytes?: number | null;
  targetDimensions?: { width: number | null; height: number | null };
}

export function analyzeLottie(
  data: LottieJson,
  options: AnalyzeLottieOptions = {},
): LottieAnalysisResult {
  const metadata = extractMetadata(data, {
    fileSizeBytes: options.fileSizeBytes ?? null,
  });
  const layerAnalysis = analyzeLayers(data);
  const scan = scanLottie(data);

  const totalEffects = layerAnalysis.layers.reduce(
    (sum, l) => sum + l.effectCount,
    0,
  );
  const totalMasks = layerAnalysis.layers.reduce(
    (sum, l) => sum + l.maskCount,
    0,
  );

  const performance = computePerformanceScore({
    metadata,
    scan,
    totalEffects,
    totalMasks,
  });

  const suggestions = buildOptimizationSuggestions({
    metadata,
    layers: layerAnalysis.layers,
    scan,
    targetDimensions: options.targetDimensions,
  });

  const compatibility = buildCompatibility({ metadata, scan });

  return {
    metadata,
    layers: layerAnalysis,
    performance,
    suggestions,
    compatibility,
  };
}

export * from "./types";
export {
  extractMetadata,
  formatDuration,
  formatFileSize,
} from "./metadata";
export { analyzeLayers, getBlendModeName, BLEND_MODE_NAMES } from "./layers";
export { scanLottie } from "./scan";
export type { DeepScanResult } from "./scan";
export {
  computePerformanceScore,
  gradeFromScore,
  scoreLayerCount,
  scoreExpressions,
  scoreEffects,
  scoreMasks,
  score3D,
  scoreEmbeddedImages,
  scoreFrameRate,
} from "./performance";
export { buildOptimizationSuggestions } from "./optimization";
export { buildCompatibility } from "./compatibility";
