"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  getBlendModeName,
  type AnalyzedLayer,
  type LayerAnalysisResult,
  type LayerTreeNode,
} from "@/lib/lottie-analyzer";
import { SectionCard } from "./SectionCard";

interface LayersSectionProps {
  data: LayerAnalysisResult;
  highlightedLayerIndex: number | null;
  onClearHighlight: () => void;
}

const TYPE_BADGE_CLASSES: Record<string, string> = {
  Shape: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  Image: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  Text: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  Precomp: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
  Solid: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  Null: "bg-gray-500/20 text-gray-300 border-gray-500/40",
  Audio: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
};

function typeBadgeClass(typeName: string): string {
  return (
    TYPE_BADGE_CLASSES[typeName] ??
    "bg-gray-700/60 text-gray-200 border-gray-600"
  );
}

const PAGE_SIZE = 50;

interface LayerRowProps {
  layer: AnalyzedLayer;
  highlighted: boolean;
  registerRef: (idx: number, el: HTMLTableRowElement | null) => void;
}

function LayerRow({ layer, highlighted, registerRef }: LayerRowProps) {
  return (
    <tr
      ref={(el) => registerRef(layer.index, el)}
      className={`border-t border-gray-800 text-sm transition-colors ${
        highlighted ? "bg-yellow-500/10" : "hover:bg-gray-800/40"
      }`}
    >
      <td className="px-3 py-2 text-gray-400">{layer.index}</td>
      <td className="px-3 py-2 text-white">
        <div className="flex items-center gap-2">
          <span>{layer.name}</span>
          {layer.isHidden ? (
            <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] uppercase text-red-300">
              hidden
            </span>
          ) : null}
        </div>
      </td>
      <td className="px-3 py-2">
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${typeBadgeClass(
            layer.typeName,
          )}`}
        >
          {layer.typeName}
        </span>
      </td>
      <td className="px-3 py-2 text-right font-mono text-xs text-gray-300">
        {layer.startFrame} – {layer.endFrame}
      </td>
      <td className="px-3 py-2 text-xs text-gray-300">
        {getBlendModeName(layer.blendMode)}
      </td>
      <td className="px-3 py-2 text-center text-xs text-gray-300">
        {layer.is3D ? "3D" : "—"}
      </td>
      <td className="px-3 py-2 text-right text-xs text-gray-300">
        {layer.effectCount}
      </td>
      <td className="px-3 py-2 text-right text-xs text-gray-300">
        {layer.maskCount}
      </td>
    </tr>
  );
}

interface TreeNodeRowProps {
  node: LayerTreeNode;
  depth: number;
  highlightedLayerIndex: number | null;
}

function TreeNodeRow({ node, depth, highlightedLayerIndex }: TreeNodeRowProps) {
  const isHighlighted = highlightedLayerIndex === node.index;
  return (
    <li>
      <div
        className={`flex items-center gap-2 rounded px-2 py-1 text-sm ${
          isHighlighted ? "bg-yellow-500/10 text-yellow-200" : "text-gray-200"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${typeBadgeClass(
            node.typeName,
          )}`}
        >
          {node.typeName}
        </span>
        <span>{node.name}</span>
        <span className="ml-auto font-mono text-[11px] text-gray-500">
          #{node.index}
        </span>
      </div>
      {node.children.length > 0 ? (
        <ul>
          {node.children.map((child) => (
            <TreeNodeRow
              key={child.index}
              node={child}
              depth={depth + 1}
              highlightedLayerIndex={highlightedLayerIndex}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function LayersSection({
  data,
  highlightedLayerIndex,
  onClearHighlight,
}: LayersSectionProps) {
  const t = useTranslations("analysis.layers");
  const [mode, setMode] = useState<"list" | "tree">("list");
  const [page, setPage] = useState(0);
  const rowRefs = useRef(new Map<number, HTMLTableRowElement>());

  const totalPages = Math.max(1, Math.ceil(data.layers.length / PAGE_SIZE));
  const visibleLayers = useMemo(
    () => data.layers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [data.layers, page],
  );

  useEffect(() => {
    if (highlightedLayerIndex === null) return;
    if (mode !== "list") setMode("list");
    const targetIdx = data.layers.findIndex(
      (l) => l.index === highlightedLayerIndex,
    );
    if (targetIdx < 0) return;
    const targetPage = Math.floor(targetIdx / PAGE_SIZE);
    if (targetPage !== page) setPage(targetPage);
  }, [highlightedLayerIndex, data.layers, mode, page]);

  useEffect(() => {
    if (highlightedLayerIndex === null) return;
    const el = rowRefs.current.get(highlightedLayerIndex);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedLayerIndex, page, mode]);

  const registerRef = (idx: number, el: HTMLTableRowElement | null) => {
    if (el) rowRefs.current.set(idx, el);
    else rowRefs.current.delete(idx);
  };

  return (
    <SectionCard
      id="analysis-layers"
      title={t("title")}
      subtitle={t("subtitle", { count: data.layers.length })}
      actions={
        <div className="flex gap-1 rounded-md border border-gray-700 bg-gray-900/60 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("list")}
            className={`rounded px-2 py-1 ${
              mode === "list"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t("listMode")}
          </button>
          <button
            type="button"
            onClick={() => setMode("tree")}
            className={`rounded px-2 py-1 ${
              mode === "tree"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t("treeMode")}
          </button>
        </div>
      }
    >
      {data.layers.length === 0 ? (
        <p className="text-sm text-gray-400">{t("empty")}</p>
      ) : mode === "list" ? (
        <>
          <div className="max-h-[480px] overflow-auto rounded-md border border-gray-800">
            <table className="min-w-full divide-y divide-gray-800 text-left">
              <thead className="bg-gray-900/80 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">{t("columnName")}</th>
                  <th className="px-3 py-2">{t("columnType")}</th>
                  <th className="px-3 py-2 text-right">{t("columnFrames")}</th>
                  <th className="px-3 py-2">{t("columnBlend")}</th>
                  <th className="px-3 py-2 text-center">{t("column3D")}</th>
                  <th className="px-3 py-2 text-right">{t("columnEffects")}</th>
                  <th className="px-3 py-2 text-right">{t("columnMasks")}</th>
                </tr>
              </thead>
              <tbody>
                {visibleLayers.map((layer) => (
                  <LayerRow
                    key={layer.index}
                    layer={layer}
                    highlighted={highlightedLayerIndex === layer.index}
                    registerRef={registerRef}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 ? (
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>
                {t("pageStatus", {
                  from: page * PAGE_SIZE + 1,
                  to: Math.min((page + 1) * PAGE_SIZE, data.layers.length),
                  total: data.layers.length,
                })}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded border border-gray-700 px-2 py-1 disabled:opacity-40"
                >
                  {t("prev")}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="rounded border border-gray-700 px-2 py-1 disabled:opacity-40"
                >
                  {t("next")}
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <ul className="max-h-[480px] overflow-auto rounded-md border border-gray-800 bg-gray-900/40 p-2">
          {data.tree.map((node) => (
            <TreeNodeRow
              key={node.index}
              node={node}
              depth={0}
              highlightedLayerIndex={highlightedLayerIndex}
            />
          ))}
        </ul>
      )}

      {highlightedLayerIndex !== null ? (
        <button
          type="button"
          onClick={onClearHighlight}
          className="mt-3 rounded border border-gray-700 px-3 py-1 text-xs text-gray-300 hover:bg-gray-800"
        >
          {t("clearHighlight")}
        </button>
      ) : null}
    </SectionCard>
  );
}
