export type LoopMode = "loop" | "once" | "pingpong";

export type BackgroundKind = "transparent" | "color" | "image";

export interface BackgroundValue {
  kind: BackgroundKind;
  color?: string;
  imageUrl?: string;
}

export interface PlayerState {
  speed: number;
  direction: 1 | -1;
  loopMode: LoopMode;
  segment: { from: number; to: number } | null;
  background: BackgroundValue;
}
