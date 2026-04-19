export type LayerTypeCode = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const LAYER_TYPE_NAMES: Record<LayerTypeCode, string> = {
  0: "Precomp",
  1: "Solid",
  2: "Image",
  3: "Null",
  4: "Shape",
  5: "Text",
  6: "Audio",
};

export interface LottieAsset {
  id?: string;
  w?: number;
  h?: number;
  u?: string;
  p?: string;
  e?: number;
  layers?: LottieLayer[];
  [key: string]: unknown;
}

export interface LottieMarker {
  tm?: number;
  cm?: string;
  dr?: number;
  [key: string]: unknown;
}

export interface LottieLayerTransform {
  p?: { k?: unknown } | unknown;
  a?: { k?: unknown } | unknown;
  s?: { k?: unknown } | unknown;
  r?: { k?: unknown } | unknown;
  o?: { k?: unknown } | unknown;
  [key: string]: unknown;
}

export interface LottieShape {
  ty?: string;
  it?: LottieShape[];
  ks?: { k?: unknown } | unknown;
  [key: string]: unknown;
}

export interface LottieLayerEffect {
  ty?: number;
  nm?: string;
  [key: string]: unknown;
}

export interface LottieLayerMask {
  mode?: string;
  [key: string]: unknown;
}

export interface LottieLayer {
  ty: LayerTypeCode;
  nm?: string;
  ind?: number;
  parent?: number;
  ip?: number;
  op?: number;
  st?: number;
  sr?: number;
  bm?: number;
  ddd?: 0 | 1;
  hd?: boolean;
  ks?: LottieLayerTransform;
  shapes?: LottieShape[];
  ef?: LottieLayerEffect[];
  masksProperties?: LottieLayerMask[];
  hasMask?: boolean;
  refId?: string;
  t?: { d?: unknown; m?: unknown; p?: unknown } | unknown;
  [key: string]: unknown;
}

export interface LottieJson {
  v?: string;
  fr?: number;
  ip?: number;
  op?: number;
  w?: number;
  h?: number;
  nm?: string;
  ddd?: 0 | 1;
  assets?: LottieAsset[];
  layers?: LottieLayer[];
  markers?: LottieMarker[];
  meta?: {
    g?: string;
    a?: string;
    k?: string;
    d?: string;
    tc?: string;
    [key: string]: unknown;
  };
  chars?: unknown[];
  [key: string]: unknown;
}

export interface LottieMetadata {
  version: string | null;
  generator: string | null;
  width: number | null;
  height: number | null;
  frameRate: number | null;
  inPoint: number | null;
  outPoint: number | null;
  totalFrames: number | null;
  durationSeconds: number | null;
  layerCount: number;
  layerCountsByType: Record<string, number>;
  assetCount: number;
  imageAssetCount: number;
  precompAssetCount: number;
  embeddedImageCount: number;
  markerCount: number;
  fileSizeBytes: number | null;
  is3D: boolean;
}

export interface AnalyzedLayer {
  index: number;
  name: string;
  typeCode: LayerTypeCode;
  typeName: string;
  startFrame: number;
  endFrame: number;
  blendMode: number;
  is3D: boolean;
  effectCount: number;
  maskCount: number;
  parent: number | null;
  isHidden: boolean;
}

export interface LayerTreeNode extends AnalyzedLayer {
  children: LayerTreeNode[];
}

export interface LayerAnalysisResult {
  layers: AnalyzedLayer[];
  tree: LayerTreeNode[];
}

export type PerformanceGrade = "A" | "B" | "C" | "D" | "F";

export interface PerformanceMetricBreakdown {
  key: string;
  weight: number;
  rawValue: number;
  score: number;
  contribution: number;
}

export interface PerformanceScore {
  score: number;
  grade: PerformanceGrade;
  breakdown: PerformanceMetricBreakdown[];
}

export type SuggestionSeverity = "info" | "warning" | "error";

export type SuggestionCode =
  | "EMBEDDED_IMAGES"
  | "UNNAMED_LAYERS"
  | "EXPRESSIONS"
  | "HIDDEN_LAYERS"
  | "DUPLICATE_SHAPE_PATHS"
  | "EXCESSIVE_KEYFRAMES"
  | "LARGE_IMAGE_RESIZE"
  | "MISSING_MARKERS";

export interface OptimizationSuggestion {
  code: SuggestionCode;
  severity: SuggestionSeverity;
  what: string;
  why: string;
  how: string;
  relatedLayerIndexes: number[];
  relatedAssetIds: string[];
  metric?: number;
}

export type PlatformKey = "web" | "ios" | "android";

export type PlatformSupportLevel = "supported" | "partial" | "unsupported";

export interface PlatformFeatureSupport {
  feature: string;
  web: PlatformSupportLevel;
  ios: PlatformSupportLevel;
  android: PlatformSupportLevel;
  detectedInFile: boolean;
  relatedLayerIndexes: number[];
}

export interface PlatformCompatibility {
  features: PlatformFeatureSupport[];
  summary: Record<PlatformKey, {
    overall: PlatformSupportLevel;
    unsupportedCount: number;
    partialCount: number;
  }>;
}

export interface LottieAnalysisResult {
  metadata: LottieMetadata;
  layers: LayerAnalysisResult;
  performance: PerformanceScore;
  suggestions: OptimizationSuggestion[];
  compatibility: PlatformCompatibility;
}
