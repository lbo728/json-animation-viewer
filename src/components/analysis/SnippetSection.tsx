"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { generateSnippet, type SnippetPlatform } from "@/lib/snippets/generate";
import { SectionCard } from "./SectionCard";

interface SnippetSectionProps {
  fileName: string;
  width: number | null;
  height: number | null;
}

const PLATFORMS: SnippetPlatform[] = [
  "react",
  "next",
  "vue",
  "html",
  "swift",
  "kotlin",
];

function highlight(code: string, language: string): React.ReactNode {
  const keywordPatterns: Record<string, RegExp> = {
    tsx: /\b(import|from|export|function|const|let|var|return|async|await|dynamic|default|as|style|true|false|null)\b/g,
    vue: /\b(script|setup|lang|import|from|template)\b/g,
    html: /\b(src|background|speed|style|loop|autoplay|script)\b/g,
    swift: /\b(import|class|final|override|func|let|var|return|true|false|super|init)\b/g,
    kotlin: /\b(import|val|var|implementation|fun|class)\b/g,
  };
  const pattern = keywordPatterns[language];
  if (!pattern) return code;
  const parts: (string | { kw: string; idx: number })[] = [];
  let lastIndex = 0;
  const globalPattern = new RegExp(pattern.source, "g");
  let match;
  let counter = 0;
  while ((match = globalPattern.exec(code)) !== null) {
    if (match.index > lastIndex) {
      parts.push(code.slice(lastIndex, match.index));
    }
    parts.push({ kw: match[0], idx: counter++ });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < code.length) parts.push(code.slice(lastIndex));

  return parts.map((part, i) =>
    typeof part === "string" ? (
      <span key={`t-${i}`}>{part}</span>
    ) : (
      <span key={`k-${part.idx}`} className="text-sky-300">
        {part.kw}
      </span>
    ),
  );
}

export function SnippetSection({ fileName, width, height }: SnippetSectionProps) {
  const t = useTranslations("analysis.snippets");
  const [platform, setPlatform] = useState<SnippetPlatform>("react");
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(
    () => generateSnippet(platform, { fileName, width, height }),
    [platform, fileName, width, height],
  );

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <SectionCard
      id="analysis-snippets"
      title={t("title")}
      subtitle={t("subtitle")}
    >
      <div className="mb-4 flex flex-wrap gap-1 rounded-md border border-gray-700 bg-gray-900/60 p-0.5">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`rounded px-3 py-1 text-xs ${
              platform === p
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t(`platforms.${p}`)}
          </button>
        ))}
      </div>

      {snippet.install ? (
        <div className="mb-2 rounded-md border border-gray-800 bg-gray-950/60 px-3 py-2 font-mono text-xs text-gray-300">
          <span className="mr-2 text-gray-500">$</span>
          <span className="whitespace-pre">{snippet.install}</span>
        </div>
      ) : null}

      <div className="relative">
        <pre className="max-h-[420px] overflow-auto rounded-md border border-gray-800 bg-gray-950/80 p-4 font-mono text-xs leading-relaxed text-gray-200">
          <code>{highlight(snippet.code, snippet.language)}</code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-3 top-3 rounded border border-gray-700 bg-gray-900/80 px-2 py-1 text-[11px] text-gray-200 hover:bg-gray-800"
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>

      <p className="mt-3 text-[11px] text-gray-500">
        {t("reflectedContext", {
          file: fileName,
          width: width ?? "—",
          height: height ?? "—",
        })}
      </p>
    </SectionCard>
  );
}
