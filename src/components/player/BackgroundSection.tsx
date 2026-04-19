"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SectionCard } from "@/components/analysis/SectionCard";
import type { BackgroundValue } from "./types";

interface BackgroundSectionProps {
  value: BackgroundValue;
  onChange: (value: BackgroundValue) => void;
}

interface Preset {
  id: string;
  labelKey: string;
  value: BackgroundValue;
  previewStyle: React.CSSProperties;
}

const PRESETS: Preset[] = [
  {
    id: "transparent",
    labelKey: "transparent",
    value: { kind: "transparent" },
    previewStyle: {
      backgroundImage:
        "linear-gradient(45deg, #bbb 25%, transparent 25%), linear-gradient(-45deg, #bbb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #bbb 75%), linear-gradient(-45deg, transparent 75%, #bbb 75%)",
      backgroundSize: "10px 10px",
      backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0",
      backgroundColor: "#eee",
    },
  },
  {
    id: "white",
    labelKey: "white",
    value: { kind: "color", color: "#ffffff" },
    previewStyle: { backgroundColor: "#ffffff" },
  },
  {
    id: "black",
    labelKey: "black",
    value: { kind: "color", color: "#000000" },
    previewStyle: { backgroundColor: "#000000" },
  },
  {
    id: "lightTone1",
    labelKey: "lightTone1",
    value: { kind: "color", color: "#f5f5f4" },
    previewStyle: { backgroundColor: "#f5f5f4" },
  },
  {
    id: "lightTone2",
    labelKey: "lightTone2",
    value: { kind: "color", color: "#e0f2fe" },
    previewStyle: { backgroundColor: "#e0f2fe" },
  },
  {
    id: "darkTone1",
    labelKey: "darkTone1",
    value: { kind: "color", color: "#0f172a" },
    previewStyle: { backgroundColor: "#0f172a" },
  },
  {
    id: "darkTone2",
    labelKey: "darkTone2",
    value: { kind: "color", color: "#1f2937" },
    previewStyle: { backgroundColor: "#1f2937" },
  },
];

const RECENT_STORAGE_KEY = "lottieViewer.recentBgColors";
const MAX_RECENT = 6;

function isValidHex(v: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string" && isValidHex(v));
  } catch {
    return [];
  }
}

function writeRecent(next: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage may be unavailable (private mode)
  }
}

export function BackgroundSection({ value, onChange }: BackgroundSectionProps) {
  const t = useTranslations("analysis.background");
  const [customColor, setCustomColor] = useState<string>(
    value.kind === "color" ? (value.color ?? "#111111") : "#111111",
  );
  const [recent, setRecent] = useState<string[]>([]);
  const imageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  useEffect(
    () => () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    },
    [],
  );

  const applyColor = (color: string) => {
    if (!isValidHex(color)) return;
    onChange({ kind: "color", color });
    setRecent((prev) => {
      const next = [color, ...prev.filter((c) => c.toLowerCase() !== color.toLowerCase())].slice(
        0,
        MAX_RECENT,
      );
      writeRecent(next);
      return next;
    });
  };

  const handleImage = (file: File) => {
    const url = URL.createObjectURL(file);
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
    }
    imageUrlRef.current = url;
    onChange({ kind: "image", imageUrl: url });
  };

  const activePresetId =
    value.kind === "transparent"
      ? "transparent"
      : value.kind === "color"
        ? PRESETS.find(
            (p) => p.value.kind === "color" && p.value.color === value.color,
          )?.id ?? null
        : null;

  return (
    <SectionCard
      id="analysis-background"
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="space-y-5">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-300">
            {t("presetsHeading")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const active = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onChange(preset.value)}
                  className={`flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-[11px] ${
                    active
                      ? "border-sky-500 text-white"
                      : "border-gray-700 text-gray-300 hover:border-gray-500"
                  }`}
                >
                  <span
                    className="h-10 w-10 rounded border border-gray-600"
                    style={preset.previewStyle}
                    aria-hidden
                  />
                  {t(`presets.${preset.labelKey}`)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-300">
            {t("customColorHeading")}
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-gray-700 bg-transparent"
              aria-label={t("customColorPicker")}
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#rrggbb"
              className="w-28 rounded border border-gray-700 bg-gray-900 px-2 py-1 font-mono text-sm text-white"
              aria-label={t("customColorHex")}
            />
            <button
              type="button"
              onClick={() => applyColor(customColor)}
              disabled={!isValidHex(customColor)}
              className="rounded-md border border-gray-700 bg-gray-900/70 px-3 py-1.5 text-xs text-white hover:bg-gray-800 disabled:opacity-40"
            >
              {t("applyColor")}
            </button>
          </div>

          {recent.length > 0 ? (
            <div className="mt-3">
              <p className="mb-1 text-[11px] uppercase text-gray-500">
                {t("recentColors")}
              </p>
              <div className="flex flex-wrap gap-2">
                {recent.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => applyColor(color)}
                    className="h-7 w-7 rounded border border-gray-700"
                    style={{ backgroundColor: color }}
                    title={color}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-300">
            {t("customImageHeading")}
          </h4>
          <p className="mb-2 text-[11px] text-gray-500">
            {t("customImageNote")}
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImage(file);
            }}
            className="text-xs text-gray-300"
            aria-label={t("customImageUpload")}
          />
        </div>
      </div>
    </SectionCard>
  );
}
