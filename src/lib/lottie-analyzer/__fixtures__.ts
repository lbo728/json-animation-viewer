import type { LottieJson } from "./types";

export const minimalLottie: LottieJson = {
  v: "5.7.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 512,
  h: 512,
  nm: "minimal",
  ddd: 0,
  assets: [],
  layers: [
    {
      ty: 4,
      nm: "Shape 1",
      ind: 1,
      ip: 0,
      op: 60,
      shapes: [
        {
          ty: "sh",
          ks: { k: [{ i: [[0, 0]], o: [[0, 0]], v: [[0, 0]] }] },
        },
      ],
    },
  ],
  meta: { g: "After Effects 22.0" },
};

export const complexLottie: LottieJson = {
  v: "5.10.0",
  fr: 60,
  ip: 0,
  op: 180,
  w: 1920,
  h: 1080,
  nm: "complex",
  ddd: 1,
  assets: [
    {
      id: "image_0",
      w: 5000,
      h: 5000,
      p: "data:image/png;base64,iVBORw0K",
      e: 1,
    },
    {
      id: "image_1",
      w: 256,
      h: 256,
      p: "image_1.png",
      e: 0,
    },
    {
      id: "comp_0",
      layers: [
        {
          ty: 4,
          nm: "Inner Shape",
          ind: 1,
          ip: 0,
          op: 180,
          shapes: [
            {
              ty: "sh",
              ks: { k: [{ i: [[0, 0]], o: [[0, 0]], v: [[1, 1]] }] },
            },
          ],
          ks: {
            p: {
              k: [
                { t: 0, s: [0] },
                { t: 30, s: [100] },
              ],
              x: "time*100",
            },
          },
        },
      ],
    },
  ],
  layers: [
    {
      ty: 2,
      nm: "Image Layer",
      ind: 1,
      ip: 0,
      op: 180,
      refId: "image_0",
      ddd: 1,
    },
    {
      ty: 4,
      nm: "Shape Layer 1",
      ind: 2,
      ip: 0,
      op: 180,
      hd: true,
      shapes: [
        {
          ty: "sh",
          ks: { k: [{ i: [[0, 0]], o: [[0, 0]], v: [[5, 5]] }] },
        },
        {
          ty: "sh",
          ks: { k: [{ i: [[0, 0]], o: [[0, 0]], v: [[5, 5]] }] },
        },
        { ty: "mm" },
        { ty: "gs" },
        { ty: "tm" },
      ],
      ef: [{ ty: 1 }, { ty: 2 }],
      masksProperties: [{ mode: "a" }, { mode: "s" }],
    },
    {
      ty: 5,
      nm: "Text Layer",
      ind: 3,
      ip: 0,
      op: 180,
      t: {
        d: { k: [{ t: 0, s: { t: "hello" } }] },
        m: { g: 2 },
        a: [{ foo: 1 }],
      },
      tt: 1,
    },
  ],
  markers: [{ tm: 0, cm: "start" }],
  meta: { g: "After Effects 23.0" },
};

export const lottieWithUnnamedLayers: LottieJson = {
  v: "5.7.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 512,
  h: 512,
  ddd: 0,
  assets: [],
  layers: Array.from({ length: 12 }).map((_, i) => ({
    ty: 4 as const,
    nm: `Shape Layer ${i + 1}`,
    ind: i + 1,
    ip: 0,
    op: 60,
  })),
};
