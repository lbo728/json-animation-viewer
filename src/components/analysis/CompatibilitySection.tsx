"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import type {
  PlatformCompatibility,
  PlatformFeatureSupport,
  PlatformKey,
  PlatformSupportLevel,
} from "@/lib/lottie-analyzer";
import { SectionCard } from "./SectionCard";

type TranslateFn = ReturnType<typeof useTranslations>;

interface CompatibilitySectionProps {
  compatibility: PlatformCompatibility;
  onJumpToLayer: (layerIndex: number) => void;
}

const PLATFORMS: PlatformKey[] = ["web", "ios", "android"];

const LEVEL_STYLES: Record<
  PlatformSupportLevel,
  { icon: string; text: string; bg: string; ring: string }
> = {
  supported: {
    icon: "✓",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/40",
  },
  partial: {
    icon: "!",
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/40",
  },
  unsupported: {
    icon: "✗",
    text: "text-rose-300",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/40",
  },
};

const AIRBNB_DOC_URL = "https://airbnb.io/lottie/#/supported-features";

export function CompatibilitySection({
  compatibility,
  onJumpToLayer,
}: CompatibilitySectionProps) {
  const t = useTranslations("analysis.compatibility");
  const [expanded, setExpanded] = useState<PlatformKey | null>(null);
  const detailPanelId = useId();

  const detected = compatibility.features.filter((f) => f.detectedInFile);

  return (
    <SectionCard
      id="analysis-compatibility"
      title={t("title")}
      subtitle={t("subtitle")}
      actions={
        <a
          href={AIRBNB_DOC_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="text-xs text-sky-300 hover:underline"
        >
          {t("officialDoc")}
        </a>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {PLATFORMS.map((platform) => {
          const summary = compatibility.summary[platform];
          const style = LEVEL_STYLES[summary.overall];
          const isOpen = expanded === platform;
          return (
            <button
              key={platform}
              type="button"
              onClick={() => setExpanded(isOpen ? null : platform)}
              className={`flex flex-col items-start rounded-lg p-4 text-left ring-1 ${style.bg} ${style.ring}`}
              aria-expanded={isOpen}
              aria-controls={detailPanelId}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  {t(`platforms.${platform}`)}
                </span>
                <span className={`text-2xl font-black ${style.text}`}>
                  {style.icon}
                </span>
              </div>
              <span className={`mt-2 text-xs ${style.text}`}>
                {t(`levels.${summary.overall}`)}
              </span>
              <span className="mt-1 text-[11px] text-gray-400">
                {t("issueBreakdown", {
                  unsupported: summary.unsupportedCount,
                  partial: summary.partialCount,
                })}
              </span>
            </button>
          );
        })}
      </div>

      {expanded ? (
        <CompatibilityPlatformDetail
          panelId={detailPanelId}
          platform={expanded}
          features={detected}
          onJumpToLayer={onJumpToLayer}
          t={t}
        />
      ) : null}

      <div className="mt-5 overflow-x-auto rounded-md border border-gray-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-900/80 text-xs uppercase tracking-wide text-gray-400">
            <tr>
              <th className="px-3 py-2">{t("columnFeature")}</th>
              {PLATFORMS.map((platform) => (
                <th key={platform} className="px-3 py-2 text-center">
                  {t(`platforms.${platform}`)}
                </th>
              ))}
              <th className="px-3 py-2 text-center">{t("columnDetected")}</th>
            </tr>
          </thead>
          <tbody>
            {compatibility.features.map((f) => (
              <tr
                key={f.feature}
                className="border-t border-gray-800 text-sm text-gray-200"
              >
                <td className="px-3 py-2">{f.feature}</td>
                {PLATFORMS.map((platform) => {
                  const level = f[platform];
                  const style = LEVEL_STYLES[level];
                  return (
                    <td
                      key={platform}
                      className={`px-3 py-2 text-center font-semibold ${style.text}`}
                    >
                      {style.icon}
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-center text-xs text-gray-400">
                  {f.detectedInFile ? t("yes") : t("no")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

interface CompatibilityPlatformDetailProps {
  panelId: string;
  platform: PlatformKey;
  features: PlatformFeatureSupport[];
  onJumpToLayer: (layerIndex: number) => void;
  t: TranslateFn;
}

function CompatibilityPlatformDetail({
  panelId,
  platform,
  features,
  onJumpToLayer,
  t,
}: CompatibilityPlatformDetailProps) {
  const issues = features.filter((f) => f[platform] !== "supported");

  return (
    <div
      id={panelId}
      className="mt-4 rounded-md border border-gray-700 bg-gray-900/40 p-4"
    >
      <h4 className="mb-2 text-sm font-semibold text-white">
        {t("detectedIssues", { platform: t(`platforms.${platform}`) })}
      </h4>
      {issues.length === 0 ? (
        <p className="text-xs text-gray-400">{t("noIssues")}</p>
      ) : (
        <ul className="space-y-2">
          {issues.map((f) => {
            const level = f[platform];
            const style = LEVEL_STYLES[level];
            return (
              <li
                key={f.feature}
                className="flex flex-wrap items-center gap-3 rounded border border-gray-800 bg-gray-900/60 px-3 py-2 text-sm"
              >
                <span className={`font-semibold ${style.text}`}>
                  {style.icon}
                </span>
                <span className="text-gray-200">{f.feature}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {t(`levels.${level}`)}
                </span>
                {f.relatedLayerIndexes.length > 0 ? (
                  <div className="flex w-full flex-wrap gap-1 pt-1">
                    {f.relatedLayerIndexes.slice(0, 6).map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onJumpToLayer(idx)}
                        className="rounded border border-gray-700 px-2 py-0.5 font-mono text-[10px] text-gray-200 hover:border-yellow-400 hover:text-yellow-200"
                      >
                        #{idx}
                      </button>
                    ))}
                    {f.relatedLayerIndexes.length > 6 ? (
                      <span className="text-[10px] text-gray-500">
                        +{f.relatedLayerIndexes.length - 6}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
