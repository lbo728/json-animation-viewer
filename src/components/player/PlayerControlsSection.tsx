"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { SectionCard } from "@/components/analysis/SectionCard";
import type { LottiePlayerHandle } from "./LottiePlayerStage";
import type { LoopMode, PlayerState } from "./types";

interface PlayerControlsSectionProps {
  state: PlayerState;
  onChange: (partial: Partial<PlayerState>) => void;
  playerHandle: React.RefObject<LottiePlayerHandle | null>;
  currentFrame: number;
  totalFrames: number;
  frameRate: number;
  isPlaying: boolean;
}

const SPEEDS = [0.25, 0.5, 1, 2, 4] as const;
const LOOP_MODES: LoopMode[] = ["loop", "once", "pingpong"];

export function PlayerControlsSection({
  state,
  onChange,
  playerHandle,
  currentFrame,
  totalFrames,
  frameRate,
  isPlaying,
}: PlayerControlsSectionProps) {
  const t = useTranslations("analysis.playerControls");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (playerHandle.current?.isPaused()) {
          playerHandle.current?.play();
        } else {
          playerHandle.current?.pause();
        }
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        playerHandle.current?.stepFrame(e.shiftKey ? -10 : -1);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        playerHandle.current?.stepFrame(e.shiftKey ? 10 : 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [playerHandle]);

  const currentSeconds =
    frameRate > 0 ? (currentFrame / frameRate).toFixed(2) : "0.00";
  const totalSeconds =
    frameRate > 0 && totalFrames > 0
      ? (totalFrames / frameRate).toFixed(2)
      : "0.00";

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    playerHandle.current?.goToFrame(value);
  };

  const segmentFrom = state.segment?.from ?? 0;
  const segmentTo = state.segment?.to ?? (totalFrames > 0 ? totalFrames : 0);

  return (
    <SectionCard
      id="analysis-player-controls"
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (isPlaying) {
                playerHandle.current?.pause();
              } else {
                playerHandle.current?.play();
              }
            }}
            className="rounded-md border border-gray-700 bg-gray-900/70 px-4 py-1.5 text-sm text-white hover:bg-gray-800"
          >
            {isPlaying ? t("pause") : t("play")}
          </button>

          <div className="flex items-center gap-1 rounded-md border border-gray-700 bg-gray-900/60 p-0.5">
            {SPEEDS.map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => onChange({ speed: sp })}
                className={`rounded px-2 py-1 text-xs ${
                  state.speed === sp
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              onChange({ direction: state.direction === 1 ? -1 : 1 })
            }
            className="rounded-md border border-gray-700 bg-gray-900/70 px-3 py-1.5 text-xs text-white hover:bg-gray-800"
            aria-label={t("directionToggle")}
          >
            {state.direction === 1 ? t("forward") : t("backward")}
          </button>

          <div className="flex items-center gap-1 rounded-md border border-gray-700 bg-gray-900/60 p-0.5">
            {LOOP_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onChange({ loopMode: mode })}
                className={`rounded px-2 py-1 text-xs ${
                  state.loopMode === mode
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t(`loopMode.${mode}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {t("frame")} <span className="text-white">{Math.round(currentFrame)}</span> /{" "}
              {totalFrames}
            </span>
            <span className="font-mono">
              {currentSeconds}s / {totalSeconds}s
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={totalFrames > 0 ? totalFrames : 100}
            step={1}
            value={Math.round(currentFrame)}
            onChange={handleScrub}
            className="mt-1 w-full accent-sky-500"
            aria-label={t("scrub")}
          />
        </div>

        <fieldset className="rounded-md border border-gray-700 bg-gray-900/40 p-3">
          <legend className="px-1 text-xs uppercase tracking-wide text-gray-400">
            {t("segmentLegend")}
          </legend>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-300">
              <input
                type="checkbox"
                checked={state.segment !== null}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange({
                      segment: {
                        from: 0,
                        to: Math.max(1, totalFrames),
                      },
                    });
                  } else {
                    onChange({ segment: null });
                  }
                }}
              />
              {t("segmentEnable")}
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-300">
              {t("from")}
              <input
                type="number"
                min={0}
                max={totalFrames}
                value={segmentFrom}
                disabled={state.segment === null}
                onChange={(e) =>
                  onChange({
                    segment: {
                      from: Number(e.target.value),
                      to: segmentTo,
                    },
                  })
                }
                className="w-20 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-white disabled:opacity-40"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-300">
              {t("to")}
              <input
                type="number"
                min={0}
                max={totalFrames}
                value={segmentTo}
                disabled={state.segment === null}
                onChange={(e) =>
                  onChange({
                    segment: {
                      from: segmentFrom,
                      to: Number(e.target.value),
                    },
                  })
                }
                className="w-20 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-white disabled:opacity-40"
              />
            </label>
          </div>
        </fieldset>

        <p className="text-[11px] text-gray-500">{t("shortcutsHelp")}</p>
      </div>
    </SectionCard>
  );
}
