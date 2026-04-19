"use client";

import { useTranslations } from "next-intl";
import { formatDuration, formatFileSize } from "@/lib/lottie-analyzer";
import type { LottieMetadata } from "@/lib/lottie-analyzer";
import { SectionCard } from "./SectionCard";

interface MetadataSectionProps {
  metadata: LottieMetadata;
}

function MetricTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-md border border-gray-700 bg-gray-900/50 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-white break-words">
        {value}
      </div>
      {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
    </div>
  );
}

export function MetadataSection({ metadata }: MetadataSectionProps) {
  const t = useTranslations("analysis.metadata");
  const layerTypes = ["Shape", "Image", "Text", "Precomp", "Solid", "Null"] as const;

  const dimensions =
    metadata.width && metadata.height
      ? `${metadata.width} × ${metadata.height}`
      : "—";

  return (
    <SectionCard id="analysis-metadata" title={t("title")} subtitle={t("subtitle")}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <MetricTile
          label={t("version")}
          value={metadata.version ?? "—"}
          hint={metadata.generator ?? undefined}
        />
        <MetricTile label={t("dimensions")} value={dimensions} />
        <MetricTile
          label={t("frameRate")}
          value={metadata.frameRate ? `${metadata.frameRate} fps` : "—"}
        />
        <MetricTile
          label={t("totalFrames")}
          value={
            metadata.totalFrames !== null ? String(metadata.totalFrames) : "—"
          }
          hint={
            metadata.inPoint !== null && metadata.outPoint !== null
              ? `${metadata.inPoint} → ${metadata.outPoint}`
              : undefined
          }
        />
        <MetricTile
          label={t("duration")}
          value={formatDuration(metadata.durationSeconds)}
        />
        <MetricTile label={t("layerCount")} value={String(metadata.layerCount)} />
        <MetricTile
          label={t("assetCount")}
          value={String(metadata.assetCount)}
          hint={t("assetBreakdown", {
            images: metadata.imageAssetCount,
            precomps: metadata.precompAssetCount,
          })}
        />
        <MetricTile
          label={t("embeddedImages")}
          value={String(metadata.embeddedImageCount)}
          hint={
            metadata.imageAssetCount > 0
              ? `${Math.round(
                  (metadata.embeddedImageCount / metadata.imageAssetCount) * 100,
                )}%`
              : undefined
          }
        />
        <MetricTile label={t("markers")} value={String(metadata.markerCount)} />
        <MetricTile
          label={t("fileSize")}
          value={formatFileSize(metadata.fileSizeBytes)}
        />
        <MetricTile
          label={t("is3D")}
          value={metadata.is3D ? t("yes") : t("no")}
        />
      </div>

      <div className="mt-6">
        <h4 className="mb-2 text-sm font-semibold text-gray-300">
          {t("layerTypesHeading")}
        </h4>
        <div className="flex flex-wrap gap-2">
          {layerTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1 text-xs text-gray-300"
            >
              <span className="font-medium">{type}</span>
              <span className="text-gray-500">·</span>
              <span className="text-white">
                {metadata.layerCountsByType[type] ?? 0}
              </span>
            </span>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
