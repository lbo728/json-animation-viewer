import { describe, expect, it } from "vitest";
import { analyzeLottie } from "./index";
import { complexLottie, minimalLottie } from "./__fixtures__";

describe("analyzeLottie", () => {
  it("returns a combined analysis bundle", () => {
    const result = analyzeLottie(minimalLottie, { fileSizeBytes: 1024 });
    expect(result.metadata.fileSizeBytes).toBe(1024);
    expect(result.layers.layers.length).toBe(1);
    expect(result.performance.grade).toBe("A");
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(result.compatibility.features.length).toBeGreaterThan(0);
  });

  it("produces meaningful output on a complex file", () => {
    const result = analyzeLottie(complexLottie);
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.performance.score).toBeLessThan(90);
    expect(result.compatibility.summary.ios.overall).toBe("unsupported");
  });
});
