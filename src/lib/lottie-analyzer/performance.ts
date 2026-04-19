import { DeepScanResult } from "./scan";
import {
  LottieMetadata,
  PerformanceGrade,
  PerformanceMetricBreakdown,
  PerformanceScore,
} from "./types";

interface MetricInput {
  key: string;
  weight: number;
  rawValue: number;
  score: number;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function linearInverseScore(value: number, worstAt: number): number {
  if (value <= 0) return 100;
  if (value >= worstAt) return 0;
  return clamp(100 - (value / worstAt) * 100, 0, 100);
}

export function scoreLayerCount(count: number): number {
  if (count <= 10) return 100;
  if (count <= 30) return 85;
  if (count <= 60) return 70;
  if (count <= 100) return 50;
  if (count <= 150) return 30;
  return 10;
}

export function scoreExpressions(totalExpressions: number): number {
  if (totalExpressions === 0) return 100;
  if (totalExpressions <= 3) return 80;
  if (totalExpressions <= 10) return 55;
  if (totalExpressions <= 25) return 30;
  return 10;
}

export function scoreEffects(totalEffects: number): number {
  if (totalEffects === 0) return 100;
  if (totalEffects <= 3) return 80;
  if (totalEffects <= 8) return 55;
  if (totalEffects <= 15) return 30;
  return 10;
}

export function scoreMasks(totalMasks: number): number {
  if (totalMasks === 0) return 100;
  if (totalMasks <= 3) return 85;
  if (totalMasks <= 8) return 60;
  if (totalMasks <= 15) return 35;
  return 15;
}

export function score3D(is3D: boolean): number {
  return is3D ? 40 : 100;
}

export function scoreEmbeddedImages(count: number): number {
  return linearInverseScore(count, 10);
}

export function scoreFrameRate(fr: number | null): number {
  if (fr === null) return 70;
  if (fr <= 24) return 100;
  if (fr <= 30) return 95;
  if (fr <= 60) return 70;
  if (fr <= 120) return 40;
  return 20;
}

export function gradeFromScore(score: number): PerformanceGrade {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 45) return "D";
  return "F";
}

const WEIGHTS = {
  layerCount: 0.2,
  expressions: 0.2,
  effects: 0.15,
  masks: 0.15,
  is3D: 0.1,
  embeddedImages: 0.1,
  frameRate: 0.1,
};

export interface ScorePerformanceInput {
  metadata: LottieMetadata;
  scan: DeepScanResult;
  totalEffects: number;
  totalMasks: number;
}

export function computePerformanceScore(input: ScorePerformanceInput): PerformanceScore {
  const { metadata, scan, totalEffects, totalMasks } = input;

  const metrics: MetricInput[] = [
    {
      key: "layerCount",
      weight: WEIGHTS.layerCount,
      rawValue: metadata.layerCount,
      score: scoreLayerCount(metadata.layerCount),
    },
    {
      key: "expressions",
      weight: WEIGHTS.expressions,
      rawValue: scan.totalExpressions,
      score: scoreExpressions(scan.totalExpressions),
    },
    {
      key: "effects",
      weight: WEIGHTS.effects,
      rawValue: totalEffects,
      score: scoreEffects(totalEffects),
    },
    {
      key: "masks",
      weight: WEIGHTS.masks,
      rawValue: totalMasks,
      score: scoreMasks(totalMasks),
    },
    {
      key: "is3D",
      weight: WEIGHTS.is3D,
      rawValue: metadata.is3D ? 1 : 0,
      score: score3D(metadata.is3D),
    },
    {
      key: "embeddedImages",
      weight: WEIGHTS.embeddedImages,
      rawValue: metadata.embeddedImageCount,
      score: scoreEmbeddedImages(metadata.embeddedImageCount),
    },
    {
      key: "frameRate",
      weight: WEIGHTS.frameRate,
      rawValue: metadata.frameRate ?? 0,
      score: scoreFrameRate(metadata.frameRate),
    },
  ];

  let total = 0;
  const breakdown: PerformanceMetricBreakdown[] = metrics.map((m) => {
    const contribution = m.score * m.weight;
    total += contribution;
    return {
      key: m.key,
      weight: m.weight,
      rawValue: m.rawValue,
      score: m.score,
      contribution,
    };
  });

  const finalScore = Math.round(total);
  return {
    score: finalScore,
    grade: gradeFromScore(finalScore),
    breakdown,
  };
}
