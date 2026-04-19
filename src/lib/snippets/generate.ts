export type SnippetPlatform =
  | "react"
  | "vue"
  | "next"
  | "html"
  | "swift"
  | "kotlin";

export interface SnippetInput {
  fileName: string;
  width: number | null;
  height: number | null;
}

export interface SnippetOutput {
  platform: SnippetPlatform;
  language: "tsx" | "vue" | "html" | "swift" | "kotlin";
  install: string | null;
  code: string;
}

function safeVar(fileName: string): string {
  const base = fileName.replace(/\.[^.]+$/, "");
  const cleaned = base.replace(/[^a-zA-Z0-9]+/g, "_");
  const trimmed = cleaned.replace(/^_+|_+$/g, "");
  if (!trimmed) return "animation";
  if (/^[0-9]/.test(trimmed)) return `_${trimmed}`;
  return trimmed;
}

function dimensionStyle(width: number | null, height: number | null): string {
  if (width && height) return `width: ${width}px; height: ${height}px`;
  return "width: 100%; height: 100%";
}

export function generateSnippet(
  platform: SnippetPlatform,
  input: SnippetInput,
): SnippetOutput {
  const varName = safeVar(input.fileName);
  const w = input.width ?? 300;
  const h = input.height ?? 300;

  switch (platform) {
    case "react":
      return {
        platform,
        language: "tsx",
        install: "npm install lottie-react",
        code: `import Lottie from "lottie-react";
import ${varName} from "./${input.fileName}";

export function ${capitalize(varName)}Animation() {
  return <Lottie animationData={${varName}} style={{ width: ${w}, height: ${h} }} loop />;
}
`,
      };
    case "next":
      return {
        platform,
        language: "tsx",
        install: "npm install lottie-react",
        code: `"use client";

import dynamic from "next/dynamic";
import ${varName} from "./${input.fileName}";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function ${capitalize(varName)}Animation() {
  return <Lottie animationData={${varName}} style={{ width: ${w}, height: ${h} }} loop />;
}
`,
      };
    case "vue":
      return {
        platform,
        language: "vue",
        install: "npm install vue3-lottie",
        code: `<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie";
import ${varName} from "./${input.fileName}";
</script>

<template>
  <Vue3Lottie :animationData="${varName}" :width="${w}" :height="${h}" loop />
</template>
`,
      };
    case "html":
      return {
        platform,
        language: "html",
        install: null,
        code: `<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
<lottie-player
  src="./${input.fileName}"
  background="transparent"
  speed="1"
  style="${dimensionStyle(input.width, input.height)}"
  loop
  autoplay
></lottie-player>
`,
      };
    case "swift":
      return {
        platform,
        language: "swift",
        install:
          "// Swift Package Manager\n// https://github.com/airbnb/lottie-ios",
        code: `import Lottie
import UIKit

final class ${capitalize(varName)}ViewController: UIViewController {
  private let animationView = LottieAnimationView(name: "${stripExtension(
    input.fileName,
  )}")

  override func viewDidLoad() {
    super.viewDidLoad()
    animationView.frame = CGRect(x: 0, y: 0, width: ${w}, height: ${h})
    animationView.contentMode = .scaleAspectFit
    animationView.loopMode = .loop
    view.addSubview(animationView)
    animationView.play()
  }
}
`,
      };
    case "kotlin":
      return {
        platform,
        language: "kotlin",
        install:
          "// build.gradle(.kts)\n// implementation(\"com.airbnb.android:lottie:6.5.2\")",
        code: `// res/raw/${stripExtension(input.fileName)}.json 에 파일을 배치
// layout XML
/*
<com.airbnb.lottie.LottieAnimationView
    android:id="@+id/${varName}"
    android:layout_width="${w}dp"
    android:layout_height="${h}dp"
    app:lottie_rawRes="@raw/${stripExtension(input.fileName)}"
    app:lottie_autoPlay="true"
    app:lottie_loop="true" />
*/

import com.airbnb.lottie.LottieAnimationView

val animationView: LottieAnimationView = findViewById(R.id.${varName})
animationView.setAnimation(R.raw.${stripExtension(input.fileName)})
animationView.repeatCount = LottieDrawable.INFINITE
animationView.playAnimation()
`,
      };
  }
}

function capitalize(v: string): string {
  if (!v) return v;
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function stripExtension(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}
