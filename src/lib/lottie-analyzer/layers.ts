import {
  AnalyzedLayer,
  LAYER_TYPE_NAMES,
  LayerAnalysisResult,
  LayerTreeNode,
  LayerTypeCode,
  LottieJson,
  LottieLayer,
} from "./types";

function countMasks(layer: LottieLayer): number {
  if (Array.isArray(layer.masksProperties)) return layer.masksProperties.length;
  return 0;
}

function countEffects(layer: LottieLayer): number {
  if (Array.isArray(layer.ef)) return layer.ef.length;
  return 0;
}

export function analyzeLayers(data: LottieJson): LayerAnalysisResult {
  const rawLayers: LottieLayer[] = Array.isArray(data.layers) ? data.layers : [];

  const layers: AnalyzedLayer[] = rawLayers.map((layer, idx) => {
    const typeCode = layer.ty as LayerTypeCode;
    const typeName = LAYER_TYPE_NAMES[typeCode] ?? `Unknown(${String(typeCode)})`;
    const name =
      typeof layer.nm === "string" && layer.nm.length > 0
        ? layer.nm
        : `Layer ${idx + 1}`;
    return {
      index: typeof layer.ind === "number" ? layer.ind : idx,
      name,
      typeCode,
      typeName,
      startFrame: typeof layer.ip === "number" ? layer.ip : 0,
      endFrame: typeof layer.op === "number" ? layer.op : 0,
      blendMode: typeof layer.bm === "number" ? layer.bm : 0,
      is3D: layer.ddd === 1,
      effectCount: countEffects(layer),
      maskCount: countMasks(layer),
      parent: typeof layer.parent === "number" ? layer.parent : null,
      isHidden: layer.hd === true,
    };
  });

  const byIndex = new Map<number, LayerTreeNode>();
  const tree: LayerTreeNode[] = [];

  for (const analyzed of layers) {
    byIndex.set(analyzed.index, { ...analyzed, children: [] });
  }

  for (const node of byIndex.values()) {
    if (node.parent !== null && byIndex.has(node.parent)) {
      byIndex.get(node.parent)!.children.push(node);
    } else {
      tree.push(node);
    }
  }

  return { layers, tree };
}

export const BLEND_MODE_NAMES: Record<number, string> = {
  0: "Normal",
  1: "Multiply",
  2: "Screen",
  3: "Overlay",
  4: "Darken",
  5: "Lighten",
  6: "Color Dodge",
  7: "Color Burn",
  8: "Hard Light",
  9: "Soft Light",
  10: "Difference",
  11: "Exclusion",
  12: "Hue",
  13: "Saturation",
  14: "Color",
  15: "Luminosity",
};

export function getBlendModeName(code: number): string {
  return BLEND_MODE_NAMES[code] ?? `Mode ${code}`;
}
