import { describe, expect, it } from "vitest";
import { buildCompatibility } from "./compatibility";
import { complexLottie, minimalLottie } from "./__fixtures__";
import { extractMetadata } from "./metadata";
import { scanLottie } from "./scan";

describe("buildCompatibility", () => {
  function run(data: typeof minimalLottie) {
    const metadata = extractMetadata(data);
    const scan = scanLottie(data);
    return buildCompatibility({ metadata, scan });
  }

  it("lists the full feature matrix", () => {
    const result = run(minimalLottie);
    expect(result.features.map((f) => f.feature)).toEqual([
      "Expressions",
      "Merge Paths",
      "3D Layers",
      "Mattes",
      "Gradient Strokes",
      "Per-character Text",
      "Trim Path (individually)",
    ]);
  });

  it("marks features as detected when present in file", () => {
    const result = run(complexLottie);
    const expr = result.features.find((f) => f.feature === "Expressions");
    const threeD = result.features.find((f) => f.feature === "3D Layers");
    expect(expr?.detectedInFile).toBe(true);
    expect(threeD?.detectedInFile).toBe(true);
  });

  it("computes a summary per platform reflecting worst detected feature", () => {
    const result = run(complexLottie);
    expect(result.summary.ios.overall).toBe("unsupported");
    expect(result.summary.android.overall).toBe("unsupported");
    expect(result.summary.web.overall === "partial" || result.summary.web.overall === "supported").toBe(true);
  });

  it("returns 'supported' for every platform on a clean minimal file", () => {
    const result = run(minimalLottie);
    expect(result.summary.web.overall).toBe("supported");
    expect(result.summary.ios.overall).toBe("supported");
    expect(result.summary.android.overall).toBe("supported");
  });
});
