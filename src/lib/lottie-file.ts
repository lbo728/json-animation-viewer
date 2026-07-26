import type { LottieJson } from "@/lib/lottie-analyzer";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isLayer(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return typeof value.ty === "number" && Number.isFinite(value.ty);
}

function isAsset(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    value.layers === undefined ||
    (Array.isArray(value.layers) && value.layers.every(isLayer))
  );
}

export function isLottieJson(value: unknown): value is LottieJson {
  if (!isRecord(value)) {
    return false;
  }

  const candidate = value;
  return (
    typeof candidate.v === "string" &&
    typeof candidate.w === "number" &&
    candidate.w > 0 &&
    typeof candidate.h === "number" &&
    candidate.h > 0 &&
    typeof candidate.fr === "number" &&
    candidate.fr > 0 &&
    typeof candidate.ip === "number" &&
    typeof candidate.op === "number" &&
    candidate.op > candidate.ip &&
    Array.isArray(candidate.layers) &&
    candidate.layers.every(isLayer) &&
    (candidate.assets === undefined ||
      (Array.isArray(candidate.assets) && candidate.assets.every(isAsset)))
  );
}
