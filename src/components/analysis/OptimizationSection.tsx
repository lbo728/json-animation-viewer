"use client";

import { useTranslations } from "next-intl";
import type {
  OptimizationSuggestion,
  SuggestionCode,
  SuggestionSeverity,
} from "@/lib/lottie-analyzer";
import { SectionCard } from "./SectionCard";

interface OptimizationSectionProps {
  suggestions: OptimizationSuggestion[];
  onJumpToLayer: (layerIndex: number) => void;
}

const SEVERITY_STYLES: Record<SuggestionSeverity, { border: string; dot: string; label: string }> = {
  info: {
    border: "border-sky-500/40",
    dot: "bg-sky-400",
    label: "bg-sky-500/20 text-sky-200 border-sky-500/40",
  },
  warning: {
    border: "border-amber-500/40",
    dot: "bg-amber-400",
    label: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  },
  error: {
    border: "border-rose-500/40",
    dot: "bg-rose-400",
    label: "bg-rose-500/20 text-rose-200 border-rose-500/40",
  },
};

const CODE_I18N_KEYS: Record<SuggestionCode, string> = {
  EMBEDDED_IMAGES: "embeddedImages",
  UNNAMED_LAYERS: "unnamedLayers",
  EXPRESSIONS: "expressions",
  HIDDEN_LAYERS: "hiddenLayers",
  DUPLICATE_SHAPE_PATHS: "duplicateShapePaths",
  EXCESSIVE_KEYFRAMES: "excessiveKeyframes",
  LARGE_IMAGE_RESIZE: "largeImageResize",
  MISSING_MARKERS: "missingMarkers",
};

export function OptimizationSection({
  suggestions,
  onJumpToLayer,
}: OptimizationSectionProps) {
  const t = useTranslations("analysis.optimization");
  const severityRank = { error: 0, warning: 1, info: 2 } as const;
  const sorted = [...suggestions].sort(
    (a, b) => severityRank[a.severity] - severityRank[b.severity],
  );

  return (
    <SectionCard
      id="analysis-optimization"
      title={t("title")}
      subtitle={t("subtitle", { count: suggestions.length })}
    >
      {sorted.length === 0 ? (
        <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          {t("allClear")}
        </p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((s, idx) => {
            const style = SEVERITY_STYLES[s.severity];
            const key = CODE_I18N_KEYS[s.code];
            return (
              <li
                key={`${s.code}-${idx}`}
                className={`rounded-md border bg-gray-900/50 p-4 ${style.border}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${style.dot}`}
                    aria-hidden
                  />
                  <h4 className="text-sm font-semibold text-white">
                    {t(`codes.${key}.title`)}
                  </h4>
                  <span
                    className={`ml-auto inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${style.label}`}
                  >
                    {t(`severity.${s.severity}`)}
                  </span>
                  {s.metric !== undefined ? (
                    <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[10px] text-gray-300">
                      {t(`codes.${key}.metric`, { value: s.metric })}
                    </span>
                  ) : null}
                </div>

                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-gray-500">
                      {t("what")}
                    </dt>
                    <dd className="text-gray-200">
                      {t(`codes.${key}.what`)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-gray-500">
                      {t("why")}
                    </dt>
                    <dd className="text-gray-300">
                      {t(`codes.${key}.why`)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-gray-500">
                      {t("how")}
                    </dt>
                    <dd className="text-gray-300">
                      {t(`codes.${key}.how`)}
                    </dd>
                  </div>
                </dl>

                {s.relatedLayerIndexes.length > 0 ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] uppercase text-gray-500">
                      {t("relatedLayers")}
                    </span>
                    {s.relatedLayerIndexes.slice(0, 8).map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onJumpToLayer(idx)}
                        className="rounded border border-gray-700 px-2 py-0.5 font-mono text-[11px] text-gray-200 hover:border-yellow-400 hover:text-yellow-200"
                      >
                        #{idx}
                      </button>
                    ))}
                    {s.relatedLayerIndexes.length > 8 ? (
                      <span className="text-[11px] text-gray-500">
                        +{s.relatedLayerIndexes.length - 8}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
