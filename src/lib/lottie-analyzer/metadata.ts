import {
  LAYER_TYPE_NAMES,
  LayerTypeCode,
  LottieJson,
  LottieLayer,
  LottieMetadata,
} from "./types";

const DEFAULT_COUNTS: Record<string, number> = Object.values(LAYER_TYPE_NAMES).reduce(
  (acc, name) => {
    acc[name] = 0;
    return acc;
  },
  {} as Record<string, number>,
);

function collectAllLayers(data: LottieJson): LottieLayer[] {
  const result: LottieLayer[] = [];
  const rootLayers = Array.isArray(data.layers) ? data.layers : [];
  for (const layer of rootLayers) {
    result.push(layer);
  }
  const assets = Array.isArray(data.assets) ? data.assets : [];
  for (const asset of assets) {
    if (Array.isArray(asset.layers)) {
      for (const layer of asset.layers) {
        result.push(layer);
      }
    }
  }
  return result;
}

function countEmbeddedImages(data: LottieJson): number {
  const assets = Array.isArray(data.assets) ? data.assets : [];
  let count = 0;
  for (const asset of assets) {
    const isImage = typeof asset.p === "string" && asset.p.length > 0;
    if (!isImage) continue;
    const isEmbedded =
      asset.e === 1 ||
      (typeof asset.p === "string" && asset.p.startsWith("data:"));
    if (isEmbedded) count += 1;
  }
  return count;
}

function countImageAssets(data: LottieJson): number {
  const assets = Array.isArray(data.assets) ? data.assets : [];
  return assets.filter((a) => typeof a.p === "string" && a.p.length > 0).length;
}

function countPrecompAssets(data: LottieJson): number {
  const assets = Array.isArray(data.assets) ? data.assets : [];
  return assets.filter((a) => Array.isArray(a.layers)).length;
}

function detect3D(data: LottieJson): boolean {
  if (data.ddd === 1) return true;
  const layers = collectAllLayers(data);
  return layers.some((l) => l.ddd === 1);
}

function countLayersByType(layers: LottieLayer[]): Record<string, number> {
  const counts: Record<string, number> = { ...DEFAULT_COUNTS };
  for (const layer of layers) {
    const typeCode = layer.ty as LayerTypeCode;
    const typeName = LAYER_TYPE_NAMES[typeCode];
    if (typeName) {
      counts[typeName] += 1;
    }
  }
  return counts;
}

export interface ExtractMetadataOptions {
  fileSizeBytes?: number | null;
}

export function extractMetadata(
  data: LottieJson,
  options: ExtractMetadataOptions = {},
): LottieMetadata {
  const rootLayers = Array.isArray(data.layers) ? data.layers : [];
  const ip = typeof data.ip === "number" ? data.ip : null;
  const op = typeof data.op === "number" ? data.op : null;
  const fr = typeof data.fr === "number" ? data.fr : null;

  let totalFrames: number | null = null;
  let duration: number | null = null;
  if (ip !== null && op !== null) {
    totalFrames = Math.max(0, op - ip);
    if (fr && fr > 0) {
      duration = totalFrames / fr;
    }
  }

  return {
    version: typeof data.v === "string" ? data.v : null,
    generator: typeof data.meta?.g === "string" ? data.meta.g : null,
    width: typeof data.w === "number" ? data.w : null,
    height: typeof data.h === "number" ? data.h : null,
    frameRate: fr,
    inPoint: ip,
    outPoint: op,
    totalFrames,
    durationSeconds: duration,
    layerCount: rootLayers.length,
    layerCountsByType: countLayersByType(rootLayers),
    assetCount: Array.isArray(data.assets) ? data.assets.length : 0,
    imageAssetCount: countImageAssets(data),
    precompAssetCount: countPrecompAssets(data),
    embeddedImageCount: countEmbeddedImages(data),
    markerCount: Array.isArray(data.markers) ? data.markers.length : 0,
    fileSizeBytes:
      typeof options.fileSizeBytes === "number" ? options.fileSizeBytes : null,
    is3D: detect3D(data),
  };
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return "—";
  if (seconds < 10) return `${seconds.toFixed(2)}s`;
  return `${seconds.toFixed(1)}s`;
}

export function formatFileSize(bytes: number | null): string {
  if (bytes === null || !Number.isFinite(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
