import { describe, expect, it } from "vitest";
import {
  complexLottie,
  lottieWithUnnamedLayers,
  minimalLottie,
} from "./__fixtures__";
import { analyzeLayers } from "./layers";
import { extractMetadata } from "./metadata";
import { buildOptimizationSuggestions } from "./optimization";
import { scanLottie } from "./scan";
import type { SuggestionCode } from "./types";

function codes(data: typeof minimalLottie): SuggestionCode[] {
  const metadata = extractMetadata(data);
  const layers = analyzeLayers(data);
  const scan = scanLottie(data);
  return buildOptimizationSuggestions({
    metadata,
    layers: layers.layers,
    scan,
  }).map((s) => s.code);
}

describe("buildOptimizationSuggestions", () => {
  it("detects embedded images, expressions, hidden layers, duplicates, matte/gradient/trim assets on a complex file", () => {
    const result = codes(complexLottie);
    expect(result).toContain("EMBEDDED_IMAGES");
    expect(result).toContain("EXPRESSIONS");
    expect(result).toContain("HIDDEN_LAYERS");
    expect(result).toContain("DUPLICATE_SHAPE_PATHS");
    expect(result).toContain("LARGE_IMAGE_RESIZE");
  });

  it("flags unnamed default-name layers", () => {
    const result = codes(lottieWithUnnamedLayers);
    expect(result).toContain("UNNAMED_LAYERS");
    expect(result).toContain("MISSING_MARKERS");
  });

  it("does not over-report on a minimal clean file", () => {
    const result = codes(minimalLottie);
    expect(result).not.toContain("EMBEDDED_IMAGES");
    expect(result).not.toContain("EXPRESSIONS");
    expect(result).not.toContain("HIDDEN_LAYERS");
    expect(result).not.toContain("LARGE_IMAGE_RESIZE");
  });

  it("attaches related layer indexes for hidden/expression detections", () => {
    const metadata = extractMetadata(complexLottie);
    const layers = analyzeLayers(complexLottie);
    const scan = scanLottie(complexLottie);
    const suggestions = buildOptimizationSuggestions({
      metadata,
      layers: layers.layers,
      scan,
    });
    const hidden = suggestions.find((s) => s.code === "HIDDEN_LAYERS");
    expect(hidden?.relatedLayerIndexes.length).toBeGreaterThan(0);
  });
});
