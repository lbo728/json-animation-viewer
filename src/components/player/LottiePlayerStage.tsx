"use client";

import { useEffect, useImperativeHandle, useMemo, useRef } from "react";
import type { AnimationItem, LottiePlayer } from "lottie-web";
import type { LottieJson } from "@/lib/lottie-analyzer";
import type { BackgroundValue, LoopMode, PlayerState } from "./types";

export interface LottiePlayerHandle {
  play: () => void;
  pause: () => void;
  goToFrame: (frame: number) => void;
  stepFrame: (delta: number) => void;
  isPaused: () => boolean;
}

interface LottiePlayerStageProps {
  lottie: LottiePlayer | null;
  data: LottieJson;
  state: PlayerState;
  onFrame: (frame: number) => void;
  onReady: (totalFrames: number, frameRate: number) => void;
  onPlayStateChange: (playing: boolean) => void;
  handleRef: React.RefObject<LottiePlayerHandle | null>;
}

function backgroundStyle(bg: BackgroundValue): React.CSSProperties {
  if (bg.kind === "transparent") {
    return {
      backgroundImage:
        "linear-gradient(45deg, #444 25%, transparent 25%), linear-gradient(-45deg, #444 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #444 75%), linear-gradient(-45deg, transparent 75%, #444 75%)",
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
      backgroundColor: "#222",
    };
  }
  if (bg.kind === "color") {
    return { backgroundColor: bg.color ?? "#111" };
  }
  if (bg.kind === "image" && bg.imageUrl) {
    return {
      backgroundImage: `url(${bg.imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return {};
}

function mapLoopMode(mode: LoopMode): { loop: boolean } {
  switch (mode) {
    case "loop":
    case "pingpong":
      return { loop: true };
    case "once":
      return { loop: false };
  }
}

export function LottiePlayerStage({
  lottie,
  data,
  state,
  onFrame,
  onReady,
  onPlayStateChange,
  handleRef,
}: LottiePlayerStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const totalFramesRef = useRef(0);

  useEffect(() => {
    if (!lottie || !containerRef.current) return;

    if (animationRef.current) {
      animationRef.current.destroy();
      animationRef.current = null;
    }

    containerRef.current.innerHTML = "";
    const instance = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      autoplay: true,
      animationData: data as unknown as object,
      ...mapLoopMode(state.loopMode),
    });

    animationRef.current = instance;

    const handleDomLoaded = () => {
      const total = instance.totalFrames;
      const fr = instance.frameRate;
      totalFramesRef.current = total;
      onReady(total, fr);
      onPlayStateChange(!instance.isPaused);
    };

    const handleEnter = (event: unknown) => {
      const e = event as { currentTime?: number };
      if (typeof e?.currentTime === "number") {
        onFrame(e.currentTime);
      }
    };

    const handleComplete = () => {
      onPlayStateChange(false);
    };

    const handleLoopComplete = () => {
      if (state.loopMode === "pingpong") {
        const current = instance.playDirection;
        instance.setDirection(current === 1 ? -1 : 1);
        instance.play();
      }
    };

    instance.addEventListener("DOMLoaded", handleDomLoaded);
    instance.addEventListener("enterFrame", handleEnter);
    instance.addEventListener("complete", handleComplete);
    instance.addEventListener("loopComplete", handleLoopComplete);

    return () => {
      instance.removeEventListener("DOMLoaded", handleDomLoaded);
      instance.removeEventListener("enterFrame", handleEnter);
      instance.removeEventListener("complete", handleComplete);
      instance.removeEventListener("loopComplete", handleLoopComplete);
      instance.destroy();
      animationRef.current = null;
    };
  }, [
    lottie,
    data,
    state.loopMode,
    onFrame,
    onReady,
    onPlayStateChange,
  ]);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.setSpeed(state.speed);
    }
  }, [state.speed]);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.setDirection(state.direction);
    }
  }, [state.direction]);

  useEffect(() => {
    if (!animationRef.current) return;
    const total = totalFramesRef.current;
    if (total <= 0) return;
    if (state.segment) {
      const from = Math.max(0, Math.min(state.segment.from, total));
      const to = Math.max(from + 1, Math.min(state.segment.to, total));
      animationRef.current.playSegments([from, to], true);
    } else {
      animationRef.current.playSegments([0, total], true);
    }
  }, [state.segment]);

  useImperativeHandle(
    handleRef,
    (): LottiePlayerHandle => ({
      play: () => {
        animationRef.current?.play();
        onPlayStateChange(true);
      },
      pause: () => {
        animationRef.current?.pause();
        onPlayStateChange(false);
      },
      goToFrame: (frame: number) => {
        animationRef.current?.goToAndStop(frame, true);
        onPlayStateChange(false);
      },
      stepFrame: (delta: number) => {
        if (!animationRef.current) return;
        const current = animationRef.current.currentFrame;
        const next = current + delta;
        animationRef.current.goToAndStop(next, true);
        onPlayStateChange(false);
      },
      isPaused: () => animationRef.current?.isPaused ?? true,
    }),
    [onPlayStateChange],
  );

  const bgStyle = useMemo(() => backgroundStyle(state.background), [state.background]);

  return (
    <div
      ref={containerRef}
      className="h-96 w-full rounded-lg border border-gray-700"
      style={bgStyle}
      role="img"
    />
  );
}
