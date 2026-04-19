import { describe, expect, it } from "vitest";
import { complexLottie, minimalLottie } from "./__fixtures__";
import { analyzeLayers, getBlendModeName } from "./layers";

describe("analyzeLayers", () => {
  it("produces an analyzed entry for each layer", () => {
    const result = analyzeLayers(minimalLottie);
    expect(result.layers).toHaveLength(1);
    expect(result.layers[0].typeName).toBe("Shape");
    expect(result.layers[0].isHidden).toBe(false);
  });

  it("captures effect and mask counts", () => {
    const result = analyzeLayers(complexLottie);
    const shape = result.layers.find((l) => l.typeName === "Shape");
    expect(shape?.effectCount).toBe(2);
    expect(shape?.maskCount).toBe(2);
    expect(shape?.isHidden).toBe(true);
  });

  it("flags 3D layers", () => {
    const result = analyzeLayers(complexLottie);
    const image = result.layers.find((l) => l.typeName === "Image");
    expect(image?.is3D).toBe(true);
  });

  it("builds a parent-child tree", () => {
    const data = {
      ...minimalLottie,
      layers: [
        { ty: 3 as const, nm: "Parent", ind: 1, ip: 0, op: 60 },
        { ty: 4 as const, nm: "Child", ind: 2, ip: 0, op: 60, parent: 1 },
      ],
    };
    const result = analyzeLayers(data);
    expect(result.tree).toHaveLength(1);
    expect(result.tree[0].children).toHaveLength(1);
    expect(result.tree[0].children[0].name).toBe("Child");
  });
});

describe("getBlendModeName", () => {
  it("maps known blend mode codes to names", () => {
    expect(getBlendModeName(0)).toBe("Normal");
    expect(getBlendModeName(1)).toBe("Multiply");
    expect(getBlendModeName(99)).toBe("Mode 99");
  });
});
