"use client";

import { useState, type ReactNode } from "react";

interface SectionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}

export function SectionCard({
  id,
  title,
  subtitle,
  defaultOpen = true,
  actions,
  children,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = `${id}-content`;

  return (
    <section
      id={id}
      className="w-full rounded-lg border border-gray-700 bg-gray-800/60 shadow-sm"
    >
      <header className="flex items-center justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center justify-between text-left text-white"
          aria-expanded={open}
          aria-controls={contentId}
        >
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle ? (
              <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
            ) : null}
          </div>
          <span
            aria-hidden
            className={`ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-600 text-gray-300 transition-transform ${
              open ? "rotate-90" : ""
            }`}
          >
            ›
          </span>
        </button>
        {actions ? <div className="flex-shrink-0">{actions}</div> : null}
      </header>
      {open ? (
        <div id={contentId} className="border-t border-gray-700 px-5 py-5">
          {children}
        </div>
      ) : null}
    </section>
  );
}
