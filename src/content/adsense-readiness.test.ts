import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import ko from "../../messages/ko.json";

describe("AdSense content readiness copy", () => {
  it("keeps performance wording framed as static signals, not runtime prediction", () => {
    expect(en.analysis.performance.subtitle.toLowerCase()).not.toContain("predict");
    expect(ko.analysis.performance.subtitle).not.toContain("예측");
  });

  it("exposes crawlable sample analysis content on the homepage", () => {
    for (const messages of [en, ko]) {
      expect(messages.home.sampleReportTitle).toBeTruthy();
      expect(messages.home.sampleMetadataTitle).toBeTruthy();
      expect(messages.home.sampleOptimizationTitle).toBeTruthy();
      expect(messages.home.sampleCompatibilityTitle).toBeTruthy();
      expect(messages.home.sampleMethodologyNote.length).toBeGreaterThan(80);
    }
  });
});
