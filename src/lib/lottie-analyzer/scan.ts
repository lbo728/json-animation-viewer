import {
  LottieAsset,
  LottieJson,
  LottieLayer,
  LottieShape,
} from "./types";

export interface DeepScanResult {
  expressionLayerIndexes: Set<number>;
  totalExpressions: number;
  keyframeCountByLayer: Map<number, number>;
  totalKeyframes: number;
  duplicateShapePathLayerIndexes: Set<number>;
  totalDuplicateShapePaths: number;
  layerTextMap: Map<number, boolean>;
  hasMergePathsLayerIndexes: Set<number>;
  hasGradientStrokeLayerIndexes: Set<number>;
  hasTrimPathLayerIndexes: Set<number>;
  hasMatteLayerIndexes: Set<number>;
  hasPerCharTextLayerIndexes: Set<number>;
  assetStats: Map<string, { width: number | null; height: number | null; embedded: boolean }>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function countKeyframes(value: unknown): number {
  if (!isPlainObject(value)) return 0;
  const record = value as Record<string, unknown>;
  if (Array.isArray(record.k) && record.k.length > 1 && isPlainObject(record.k[0])) {
    return record.k.length;
  }
  return 0;
}

function walkForExpressionsAndKeyframes(
  node: unknown,
  layerIdx: number,
  result: DeepScanResult,
): void {
  if (Array.isArray(node)) {
    for (const item of node) {
      walkForExpressionsAndKeyframes(item, layerIdx, result);
    }
    return;
  }
  if (!isPlainObject(node)) return;

  const record = node as Record<string, unknown>;

  if (typeof record.x === "string" && record.x.length > 0) {
    result.expressionLayerIndexes.add(layerIdx);
    result.totalExpressions += 1;
  }

  const kfCount = countKeyframes(record);
  if (kfCount > 0) {
    const prev = result.keyframeCountByLayer.get(layerIdx) ?? 0;
    result.keyframeCountByLayer.set(layerIdx, prev + kfCount);
    result.totalKeyframes += kfCount;
  }

  for (const key of Object.keys(record)) {
    walkForExpressionsAndKeyframes(record[key], layerIdx, result);
  }
}

function collectShapePaths(shapes: LottieShape[] | undefined, out: string[]): void {
  if (!Array.isArray(shapes)) return;
  for (const shape of shapes) {
    if (!shape || typeof shape !== "object") continue;
    if (shape.ty === "sh" && shape.ks) {
      try {
        out.push(JSON.stringify(shape.ks));
      } catch {
        // ignore circular structure
      }
    }
    if (Array.isArray(shape.it)) {
      collectShapePaths(shape.it as LottieShape[], out);
    }
  }
}

function detectDuplicateShapePaths(layer: LottieLayer): number {
  if (!Array.isArray(layer.shapes)) return 0;
  const paths: string[] = [];
  collectShapePaths(layer.shapes, paths);
  if (paths.length < 2) return 0;
  const seen = new Map<string, number>();
  let duplicates = 0;
  for (const p of paths) {
    const n = (seen.get(p) ?? 0) + 1;
    seen.set(p, n);
    if (n >= 2) duplicates += 1;
  }
  return duplicates;
}

function detectFeaturesFromShapes(
  shapes: LottieShape[] | undefined,
  detected: {
    mergePaths: boolean;
    gradientStroke: boolean;
    trimPath: boolean;
  },
): void {
  if (!Array.isArray(shapes)) return;
  for (const shape of shapes) {
    if (!shape || typeof shape !== "object") continue;
    if (shape.ty === "mm") detected.mergePaths = true;
    if (shape.ty === "gs") detected.gradientStroke = true;
    if (shape.ty === "tm") detected.trimPath = true;
    if (Array.isArray(shape.it)) {
      detectFeaturesFromShapes(shape.it as LottieShape[], detected);
    }
  }
}

function detectPerCharText(layer: LottieLayer): boolean {
  if (layer.ty !== 5) return false;
  const t = layer.t as Record<string, unknown> | undefined;
  if (!isPlainObject(t)) return false;
  const m = t.m as Record<string, unknown> | undefined;
  if (!isPlainObject(m)) return false;
  const g = m.g;
  if (typeof g === "number" && g > 1) return true;
  const a = t.a;
  if (Array.isArray(a) && a.length > 0) return true;
  return false;
}

function detectMatte(layer: LottieLayer): boolean {
  if (typeof layer.tt === "number" && layer.tt > 0) return true;
  if (typeof layer.td === "number" && layer.td > 0) return true;
  return false;
}

function collectAssetStats(
  data: LottieJson,
  result: DeepScanResult,
): void {
  const assets = Array.isArray(data.assets) ? data.assets : [];
  for (const asset of assets) {
    if (!asset.id) continue;
    const isImage = typeof asset.p === "string" && asset.p.length > 0;
    if (!isImage) continue;
    const embedded =
      asset.e === 1 ||
      (typeof asset.p === "string" && asset.p.startsWith("data:"));
    result.assetStats.set(asset.id, {
      width: typeof asset.w === "number" ? asset.w : null,
      height: typeof asset.h === "number" ? asset.h : null,
      embedded,
    });
  }
}

export function scanLottie(data: LottieJson): DeepScanResult {
  const result: DeepScanResult = {
    expressionLayerIndexes: new Set<number>(),
    totalExpressions: 0,
    keyframeCountByLayer: new Map<number, number>(),
    totalKeyframes: 0,
    duplicateShapePathLayerIndexes: new Set<number>(),
    totalDuplicateShapePaths: 0,
    layerTextMap: new Map<number, boolean>(),
    hasMergePathsLayerIndexes: new Set<number>(),
    hasGradientStrokeLayerIndexes: new Set<number>(),
    hasTrimPathLayerIndexes: new Set<number>(),
    hasMatteLayerIndexes: new Set<number>(),
    hasPerCharTextLayerIndexes: new Set<number>(),
    assetStats: new Map(),
  };

  const layers: LottieLayer[] = Array.isArray(data.layers) ? data.layers : [];
  const precompAssets: LottieAsset[] = Array.isArray(data.assets)
    ? data.assets.filter((a) => Array.isArray(a.layers))
    : [];

  const allLayers: LottieLayer[] = [...layers];
  for (const asset of precompAssets) {
    if (Array.isArray(asset.layers)) allLayers.push(...asset.layers);
  }

  for (let i = 0; i < allLayers.length; i += 1) {
    const layer = allLayers[i];
    const layerIdx = typeof layer.ind === "number" ? layer.ind : i;

    walkForExpressionsAndKeyframes(layer, layerIdx, result);

    const dupCount = detectDuplicateShapePaths(layer);
    if (dupCount > 0) {
      result.duplicateShapePathLayerIndexes.add(layerIdx);
      result.totalDuplicateShapePaths += dupCount;
    }

    const features = {
      mergePaths: false,
      gradientStroke: false,
      trimPath: false,
    };
    detectFeaturesFromShapes(layer.shapes, features);
    if (features.mergePaths) result.hasMergePathsLayerIndexes.add(layerIdx);
    if (features.gradientStroke) result.hasGradientStrokeLayerIndexes.add(layerIdx);
    if (features.trimPath) result.hasTrimPathLayerIndexes.add(layerIdx);

    if (detectMatte(layer)) result.hasMatteLayerIndexes.add(layerIdx);
    if (detectPerCharText(layer)) result.hasPerCharTextLayerIndexes.add(layerIdx);
  }

  collectAssetStats(data, result);
  return result;
}
