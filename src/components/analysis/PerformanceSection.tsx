"use client";

import { useTranslations } from "next-intl";
import type { PerformanceGrade, PerformanceScore } from "@/lib/lottie-analyzer";
import { SectionCard } from "./SectionCard";

interface PerformanceSectionProps {
  score: PerformanceScore;
}

const GRADE_COLORS: Record<PerformanceGrade, { ring: string; text: string; bg: string }> = {
  A: { ring: "ring-emerald-500", text: "text-emerald-300", bg: "bg-emerald-500/10" },
  B: { ring: "ring-lime-500", text: "text-lime-300", bg: "bg-lime-500/10" },
  C: { ring: "ring-amber-500", text: "text-amber-300", bg: "bg-amber-500/10" },
  D: { ring: "ring-orange-500", text: "text-orange-300", bg: "bg-orange-500/10" },
  F: { ring: "ring-rose-500", text: "text-rose-300", bg: "bg-rose-500/10" },
};

export function PerformanceSection({ score }: PerformanceSectionProps) {
  const t = useTranslations("analysis.performance");
  const colors = GRADE_COLORS[score.grade];
  const sortedBreakdown = [...score.breakdown].sort(
    (a, b) => a.contribution - b.contribution,
  );

  return (
    <SectionCard
      id="analysis-performance"
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div
          className={`flex flex-col items-center justify-center rounded-xl p-6 ${colors.bg} ring-2 ${colors.ring}`}
        >
          <span className={`text-6xl font-black ${colors.text}`}>
            {score.grade}
          </span>
          <span className="mt-2 text-3xl font-bold text-white">
            {score.score}
          </span>
          <span className="mt-1 text-xs uppercase tracking-widest text-gray-400">
            /100
          </span>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-300">
            {t("breakdownHeading")}
          </h4>
          <ul className="space-y-2">
            {sortedBreakdown.map((metric) => {
              const contributionPct = metric.score;
              return (
                <li key={metric.key}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">
                      {t(`metric.${metric.key}`)}
                    </span>
                    <span className="font-mono text-gray-400">
                      {metric.score}/100 × {Math.round(metric.weight * 100)}% ={" "}
                      <span className="text-white">
                        {metric.contribution.toFixed(1)}
                      </span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                      style={{ width: `${contributionPct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[10px] text-gray-500">
                    {t("rawValue", { value: metric.rawValue })}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}
