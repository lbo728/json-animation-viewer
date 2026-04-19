import { describe, expect, it } from "vitest";
import { complexLottie, minimalLottie } from "./__fixtures__";
import { extractMetadata, formatDuration, formatFileSize } from "./metadata";

describe("extractMetadata", () => {
  it("extracts version, generator, dimensions, framerate, duration", () => {
    const meta = extractMetadata(minimalLottie);
    expect(meta.version).toBe("5.7.0");
    expect(meta.generator).toBe("After Effects 22.0");
    expect(meta.width).toBe(512);
    expect(meta.height).toBe(512);
    expect(meta.frameRate).toBe(30);
    expect(meta.totalFrames).toBe(60);
    expect(meta.durationSeconds).toBeCloseTo(2, 5);
  });

  it("counts layers by type and counts assets", () => {
    const meta = extractMetadata(complexLottie);
    expect(meta.layerCount).toBe(3);
    expect(meta.layerCountsByType.Shape).toBe(1);
    expect(meta.layerCountsByType.Image).toBe(1);
    expect(meta.layerCountsByType.Text).toBe(1);
    expect(meta.assetCount).toBe(3);
    expect(meta.imageAssetCount).toBe(2);
    expect(meta.precompAssetCount).toBe(1);
    expect(meta.embeddedImageCount).toBe(1);
    expect(meta.markerCount).toBe(1);
  });

  it("detects 3D from ddd flag at root or layer", () => {
    expect(extractMetadata(complexLottie).is3D).toBe(true);
    expect(extractMetadata(minimalLottie).is3D).toBe(false);
  });

  it("returns null fallbacks for missing fields", () => {
    const meta = extractMetadata({});
    expect(meta.version).toBeNull();
    expect(meta.width).toBeNull();
    expect(meta.height).toBeNull();
    expect(meta.frameRate).toBeNull();
    expect(meta.totalFrames).toBeNull();
    expect(meta.durationSeconds).toBeNull();
    expect(meta.layerCount).toBe(0);
    expect(meta.assetCount).toBe(0);
    expect(meta.is3D).toBe(false);
  });

  it("accepts fileSizeBytes option", () => {
    const meta = extractMetadata(minimalLottie, { fileSizeBytes: 2048 });
    expect(meta.fileSizeBytes).toBe(2048);
  });
});

describe("formatters", () => {
  it("formats duration", () => {
    expect(formatDuration(null)).toBe("—");
    expect(formatDuration(2.345)).toBe("2.35s");
    expect(formatDuration(30)).toBe("30.0s");
  });

  it("formats file size", () => {
    expect(formatFileSize(null)).toBe("—");
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.00 MB");
  });
});
