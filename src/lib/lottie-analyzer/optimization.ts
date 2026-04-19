import { DeepScanResult } from "./scan";
import { AnalyzedLayer, LottieMetadata, OptimizationSuggestion } from "./types";

const UNNAMED_DEFAULT_PATTERN = /^(Layer \d+|Shape Layer \d+|Null \d+|Solid \d+|새 컴포지션 \d+|컴포지션 \d+)$/u;

const LARGE_IMAGE_THRESHOLD_PX = 2000;

interface BuildSuggestionsInput {
  metadata: LottieMetadata;
  layers: AnalyzedLayer[];
  scan: DeepScanResult;
  targetDimensions?: { width: number | null; height: number | null };
}

export function buildOptimizationSuggestions(
  input: BuildSuggestionsInput,
): OptimizationSuggestion[] {
  const { metadata, layers, scan } = input;
  const suggestions: OptimizationSuggestion[] = [];
  const targetW = input.targetDimensions?.width ?? metadata.width;
  const targetH = input.targetDimensions?.height ?? metadata.height;

  const embeddedRatio =
    metadata.imageAssetCount > 0
      ? metadata.embeddedImageCount / metadata.imageAssetCount
      : 0;
  if (metadata.embeddedImageCount > 0) {
    suggestions.push({
      code: "EMBEDDED_IMAGES",
      severity: embeddedRatio >= 0.5 ? "warning" : "info",
      what: "embeddedImages.what",
      why: "embeddedImages.why",
      how: "embeddedImages.how",
      relatedLayerIndexes: [],
      relatedAssetIds: Array.from(scan.assetStats.entries())
        .filter(([, v]) => v.embedded)
        .map(([id]) => id),
      metric: metadata.embeddedImageCount,
    });
  }

  const unnamedLayers = layers.filter((l) =>
    UNNAMED_DEFAULT_PATTERN.test(l.name.trim()),
  );
  if (unnamedLayers.length > 0) {
    suggestions.push({
      code: "UNNAMED_LAYERS",
      severity: unnamedLayers.length >= 10 ? "warning" : "info",
      what: "unnamedLayers.what",
      why: "unnamedLayers.why",
      how: "unnamedLayers.how",
      relatedLayerIndexes: unnamedLayers.map((l) => l.index),
      relatedAssetIds: [],
      metric: unnamedLayers.length,
    });
  }

  if (scan.totalExpressions > 0) {
    suggestions.push({
      code: "EXPRESSIONS",
      severity: scan.totalExpressions >= 5 ? "warning" : "info",
      what: "expressions.what",
      why: "expressions.why",
      how: "expressions.how",
      relatedLayerIndexes: Array.from(scan.expressionLayerIndexes),
      relatedAssetIds: [],
      metric: scan.totalExpressions,
    });
  }

  const hiddenLayers = layers.filter((l) => l.isHidden);
  if (hiddenLayers.length > 0) {
    suggestions.push({
      code: "HIDDEN_LAYERS",
      severity: "info",
      what: "hiddenLayers.what",
      why: "hiddenLayers.why",
      how: "hiddenLayers.how",
      relatedLayerIndexes: hiddenLayers.map((l) => l.index),
      relatedAssetIds: [],
      metric: hiddenLayers.length,
    });
  }

  if (scan.totalDuplicateShapePaths > 0) {
    suggestions.push({
      code: "DUPLICATE_SHAPE_PATHS",
      severity: "info",
      what: "duplicateShapePaths.what",
      why: "duplicateShapePaths.why",
      how: "duplicateShapePaths.how",
      relatedLayerIndexes: Array.from(scan.duplicateShapePathLayerIndexes),
      relatedAssetIds: [],
      metric: scan.totalDuplicateShapePaths,
    });
  }

  const excessiveKeyframeLayers: number[] = [];
  let totalExcessive = 0;
  for (const [idx, count] of scan.keyframeCountByLayer.entries()) {
    if (count >= 100) {
      excessiveKeyframeLayers.push(idx);
      totalExcessive += count;
    }
  }
  if (excessiveKeyframeLayers.length > 0 || scan.totalKeyframes >= 500) {
    suggestions.push({
      code: "EXCESSIVE_KEYFRAMES",
      severity:
        scan.totalKeyframes >= 1000 || excessiveKeyframeLayers.length >= 5
          ? "warning"
          : "info",
      what: "excessiveKeyframes.what",
      why: "excessiveKeyframes.why",
      how: "excessiveKeyframes.how",
      relatedLayerIndexes: excessiveKeyframeLayers,
      relatedAssetIds: [],
      metric: totalExcessive > 0 ? totalExcessive : scan.totalKeyframes,
    });
  }

  const oversizedAssets: string[] = [];
  for (const [id, stats] of scan.assetStats.entries()) {
    if (!stats.width || !stats.height) continue;
    if (!targetW || !targetH) {
      if (stats.width >= LARGE_IMAGE_THRESHOLD_PX || stats.height >= LARGE_IMAGE_THRESHOLD_PX) {
        oversizedAssets.push(id);
      }
      continue;
    }
    if (stats.width > targetW * 2 || stats.height > targetH * 2) {
      oversizedAssets.push(id);
    }
  }
  if (oversizedAssets.length > 0) {
    suggestions.push({
      code: "LARGE_IMAGE_RESIZE",
      severity: "warning",
      what: "largeImageResize.what",
      why: "largeImageResize.why",
      how: "largeImageResize.how",
      relatedLayerIndexes: [],
      relatedAssetIds: oversizedAssets,
      metric: oversizedAssets.length,
    });
  }

  if (metadata.markerCount === 0 && metadata.totalFrames && metadata.totalFrames > 0) {
    suggestions.push({
      code: "MISSING_MARKERS",
      severity: "info",
      what: "missingMarkers.what",
      why: "missingMarkers.why",
      how: "missingMarkers.how",
      relatedLayerIndexes: [],
      relatedAssetIds: [],
      metric: 0,
    });
  }

  return suggestions;
}
