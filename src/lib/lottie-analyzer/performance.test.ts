import { describe, expect, it } from "vitest";
import { complexLottie, minimalLottie } from "./__fixtures__";
import { extractMetadata } from "./metadata";
import {
  computePerformanceScore,
  gradeFromScore,
  scoreEmbeddedImages,
  scoreExpressions,
  scoreFrameRate,
  scoreLayerCount,
} from "./performance";
import { scanLottie } from "./scan";
import { analyzeLayers } from "./layers";

describe("scoring primitives", () => {
  it("decreases score as layer count grows", () => {
    expect(scoreLayerCount(5)).toBe(100);
    expect(scoreLayerCount(50)).toBe(70);
    expect(scoreLayerCount(200)).toBe(10);
  });

  it("penalizes expressions", () => {
    expect(scoreExpressions(0)).toBe(100);
    expect(scoreExpressions(3)).toBe(80);
    expect(scoreExpressions(30)).toBe(10);
  });

  it("penalizes embedded images (linear)", () => {
    expect(scoreEmbeddedImages(0)).toBe(100);
    expect(scoreEmbeddedImages(5)).toBeCloseTo(50, 5);
    expect(scoreEmbeddedImages(10)).toBe(0);
  });

  it("penalizes very high framerates", () => {
    expect(scoreFrameRate(24)).toBe(100);
    expect(scoreFrameRate(60)).toBe(70);
    expect(scoreFrameRate(240)).toBe(20);
  });

  it("grades scores correctly", () => {
    expect(gradeFromScore(95)).toBe("A");
    expect(gradeFromScore(80)).toBe("B");
    expect(gradeFromScore(65)).toBe("C");
    expect(gradeFromScore(50)).toBe("D");
    expect(gradeFromScore(10)).toBe("F");
  });
});

describe("computePerformanceScore", () => {
  function score(data: typeof minimalLottie) {
    const metadata = extractMetadata(data);
    const layers = analyzeLayers(data);
    const scan = scanLottie(data);
    const totalEffects = layers.layers.reduce((s, l) => s + l.effectCount, 0);
    const totalMasks = layers.layers.reduce((s, l) => s + l.maskCount, 0);
    return computePerformanceScore({ metadata, scan, totalEffects, totalMasks });
  }

  it("gives a high score to a minimal file", () => {
    const result = score(minimalLottie);
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.grade).toBe("A");
    expect(result.breakdown).toHaveLength(7);
  });

  it("gives a worse score to a heavy file", () => {
    const result = score(complexLottie);
    expect(result.score).toBeLessThan(score(minimalLottie).score);
  });

  it("breakdown contributions sum roughly to the score", () => {
    const result = score(complexLottie);
    const total = result.breakdown.reduce((s, m) => s + m.contribution, 0);
    expect(Math.round(total)).toBe(result.score);
  });
});
