import { describe, expect, it } from "vitest";
import { generateSnippet } from "./generate";

const input = { fileName: "my-lottie.json", width: 400, height: 300 };

describe("generateSnippet", () => {
  it("produces react snippet with install command and dimensions", () => {
    const out = generateSnippet("react", input);
    expect(out.language).toBe("tsx");
    expect(out.install).toContain("lottie-react");
    expect(out.code).toContain('import my_lottie from "./my-lottie.json"');
    expect(out.code).toContain("width: 400, height: 300");
  });

  it("produces next snippet with dynamic ssr false", () => {
    const out = generateSnippet("next", input);
    expect(out.code).toContain("\"use client\"");
    expect(out.code).toContain("dynamic(() => import(\"lottie-react\")");
  });

  it("produces vue snippet with Vue3Lottie", () => {
    const out = generateSnippet("vue", input);
    expect(out.language).toBe("vue");
    expect(out.code).toContain("Vue3Lottie");
    expect(out.code).toContain(":width=\"400\"");
  });

  it("produces html snippet without install command", () => {
    const out = generateSnippet("html", input);
    expect(out.install).toBeNull();
    expect(out.code).toContain("<lottie-player");
    expect(out.code).toContain("width: 400px; height: 300px");
  });

  it("produces swift snippet stripping extension", () => {
    const out = generateSnippet("swift", input);
    expect(out.code).toContain("LottieAnimationView(name: \"my-lottie\")");
    expect(out.code).toContain("CGRect(x: 0, y: 0, width: 400, height: 300)");
  });

  it("produces kotlin snippet with R.raw lookup", () => {
    const out = generateSnippet("kotlin", input);
    expect(out.code).toContain("R.raw.my-lottie");
    expect(out.code).toContain("my_lottie");
  });

  it("handles missing dimensions and unusual filenames", () => {
    const out = generateSnippet("html", {
      fileName: "123 cool.json",
      width: null,
      height: null,
    });
    expect(out.code).toContain("width: 100%; height: 100%");
    const swift = generateSnippet("swift", {
      fileName: "no-ext",
      width: null,
      height: null,
    });
    expect(swift.code).toContain("LottieAnimationView(name: \"no-ext\")");
  });
});
