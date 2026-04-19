"use client";

import { useMemo, useState } from "react";
import { analyzeLottie, type LottieJson } from "@/lib/lottie-analyzer";
import { CompatibilitySection } from "./CompatibilitySection";
import { LayersSection } from "./LayersSection";
import { MetadataSection } from "./MetadataSection";
import { OptimizationSection } from "./OptimizationSection";
import { PerformanceSection } from "./PerformanceSection";
import { SnippetSection } from "./SnippetSection";

interface AnalysisResultProps {
  data: LottieJson;
  fileSizeBytes: number | null;
  fileName: string;
}

export function AnalysisResult({ data, fileSizeBytes, fileName }: AnalysisResultProps) {
  const [highlightedLayerIndex, setHighlightedLayerIndex] = useState<number | null>(
    null,
  );

  const analysis = useMemo(
    () => analyzeLottie(data, { fileSizeBytes }),
    [data, fileSizeBytes],
  );

  const handleJumpToLayer = (layerIndex: number) => {
    setHighlightedLayerIndex(layerIndex);
    if (typeof window !== "undefined") {
      const target = document.getElementById("analysis-layers");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <MetadataSection metadata={analysis.metadata} />
      <PerformanceSection score={analysis.performance} />
      <OptimizationSection
        suggestions={analysis.suggestions}
        onJumpToLayer={handleJumpToLayer}
      />
      <LayersSection
        data={analysis.layers}
        highlightedLayerIndex={highlightedLayerIndex}
        onClearHighlight={() => setHighlightedLayerIndex(null)}
      />
      <CompatibilitySection
        compatibility={analysis.compatibility}
        onJumpToLayer={handleJumpToLayer}
      />
      <SnippetSection
        fileName={fileName}
        width={analysis.metadata.width}
        height={analysis.metadata.height}
      />
    </div>
  );
}
