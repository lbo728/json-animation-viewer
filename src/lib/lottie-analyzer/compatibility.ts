import { DeepScanResult } from "./scan";
import {
  LottieMetadata,
  PlatformCompatibility,
  PlatformFeatureSupport,
  PlatformKey,
  PlatformSupportLevel,
} from "./types";

interface FeatureDef {
  feature: string;
  web: PlatformSupportLevel;
  ios: PlatformSupportLevel;
  android: PlatformSupportLevel;
}

const FEATURE_MATRIX: FeatureDef[] = [
  {
    feature: "Expressions",
    web: "partial",
    ios: "unsupported",
    android: "unsupported",
  },
  {
    feature: "Merge Paths",
    web: "supported",
    ios: "partial",
    android: "partial",
  },
  {
    feature: "3D Layers",
    web: "partial",
    ios: "unsupported",
    android: "unsupported",
  },
  {
    feature: "Mattes",
    web: "supported",
    ios: "partial",
    android: "partial",
  },
  {
    feature: "Gradient Strokes",
    web: "supported",
    ios: "partial",
    android: "partial",
  },
  {
    feature: "Per-character Text",
    web: "supported",
    ios: "partial",
    android: "partial",
  },
  {
    feature: "Trim Path (individually)",
    web: "supported",
    ios: "partial",
    android: "partial",
  },
];

function severityRank(level: PlatformSupportLevel): number {
  if (level === "unsupported") return 2;
  if (level === "partial") return 1;
  return 0;
}

function worstLevel(a: PlatformSupportLevel, b: PlatformSupportLevel): PlatformSupportLevel {
  return severityRank(a) >= severityRank(b) ? a : b;
}

interface BuildCompatibilityInput {
  metadata: LottieMetadata;
  scan: DeepScanResult;
}

export function buildCompatibility(
  input: BuildCompatibilityInput,
): PlatformCompatibility {
  const { metadata, scan } = input;

  const detectionMap: Record<string, { detected: boolean; layers: number[] }> = {
    Expressions: {
      detected: scan.totalExpressions > 0,
      layers: Array.from(scan.expressionLayerIndexes),
    },
    "Merge Paths": {
      detected: scan.hasMergePathsLayerIndexes.size > 0,
      layers: Array.from(scan.hasMergePathsLayerIndexes),
    },
    "3D Layers": {
      detected: metadata.is3D,
      layers: [],
    },
    Mattes: {
      detected: scan.hasMatteLayerIndexes.size > 0,
      layers: Array.from(scan.hasMatteLayerIndexes),
    },
    "Gradient Strokes": {
      detected: scan.hasGradientStrokeLayerIndexes.size > 0,
      layers: Array.from(scan.hasGradientStrokeLayerIndexes),
    },
    "Per-character Text": {
      detected: scan.hasPerCharTextLayerIndexes.size > 0,
      layers: Array.from(scan.hasPerCharTextLayerIndexes),
    },
    "Trim Path (individually)": {
      detected: scan.hasTrimPathLayerIndexes.size > 0,
      layers: Array.from(scan.hasTrimPathLayerIndexes),
    },
  };

  const features: PlatformFeatureSupport[] = FEATURE_MATRIX.map((def) => {
    const detection = detectionMap[def.feature];
    return {
      feature: def.feature,
      web: def.web,
      ios: def.ios,
      android: def.android,
      detectedInFile: detection?.detected ?? false,
      relatedLayerIndexes: detection?.layers ?? [],
    };
  });

  const initial: PlatformCompatibility["summary"] = {
    web: { overall: "supported", unsupportedCount: 0, partialCount: 0 },
    ios: { overall: "supported", unsupportedCount: 0, partialCount: 0 },
    android: { overall: "supported", unsupportedCount: 0, partialCount: 0 },
  };

  const platforms: PlatformKey[] = ["web", "ios", "android"];
  for (const feature of features) {
    if (!feature.detectedInFile) continue;
    for (const platform of platforms) {
      const level = feature[platform];
      initial[platform].overall = worstLevel(initial[platform].overall, level);
      if (level === "unsupported") initial[platform].unsupportedCount += 1;
      if (level === "partial") initial[platform].partialCount += 1;
    }
  }

  return { features, summary: initial };
}
