"use client";

import { usePathname } from "next/navigation";
import { normalizeContentPath } from "@/lib/adsense-policy";

export default function JsonLd() {
  const pathname = usePathname();
  if (normalizeContentPath(pathname) !== "/") {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JSON Animation Viewer",
    url: "https://json-animation-viewer.com",
    description:
      "Preview and inspect Lottie JSON animations in the browser, including playback, metadata, layers, static performance signals, compatibility flags, and starter code snippets.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Person",
      name: "byungsker",
      url: "https://github.com/byungsker",
    },
    screenshot: "https://json-animation-viewer.com/og-image.png",
    isAccessibleForFree: true,
    featureList: [
      "Local client-side JSON parsing",
      "Lottie web preview and playback controls",
      "Animation metadata and layer inspection",
      "Documented static performance heuristics",
      "Platform compatibility flags",
      "Starter integration snippets",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
