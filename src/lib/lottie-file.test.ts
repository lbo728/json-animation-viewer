import { describe, expect, it } from "vitest";
import { isLottieJson } from "./lottie-file";

const validLottie = {
  v: "5.12.0",
  w: 512,
  h: 512,
  fr: 30,
  ip: 0,
  op: 60,
  layers: [],
};

describe("isLottieJson", () => {
  it("accepts a minimal Lottie animation structure", () => {
    expect(isLottieJson(validLottie)).toBe(true);
  });

  it.each([
    null,
    [],
    {},
    { ...validLottie, v: undefined },
    { ...validLottie, w: 0 },
    { ...validLottie, fr: 0 },
    { ...validLottie, op: 0 },
    { ...validLottie, layers: {} },
    { ...validLottie, layers: [null] },
    { ...validLottie, layers: [{}] },
    { ...validLottie, assets: [null] },
    { ...validLottie, assets: [{ layers: [null] }] },
    { ...validLottie, assets: [{ layers: [{}] }] },
  ])("rejects non-Lottie input %#", (value) => {
    expect(isLottieJson(value)).toBe(false);
  });

  it("accepts object assets and typed precomposition layers", () => {
    expect(
      isLottieJson({
        ...validLottie,
        layers: [{ ty: 4 }],
        assets: [{ id: "image" }, { id: "precomp", layers: [{ ty: 0 }] }],
      }),
    ).toBe(true);
  });
});
