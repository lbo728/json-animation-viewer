"use client";

import { useEffect } from "react";

export default function JsonLd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "JSON Animation Viewer",
      description:
        "Easily preview your JSON animations with our user-friendly JSON Animation Viewer. Drag and drop your JSON files to see them in action instantly!",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      author: {
        "@type": "Organization",
        name: "JSON Animation Viewer Team",
      },
      screenshot: "https://json-animation-viewer.vercel.app/og-image.png",
      softwareVersion: "1.0",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        ratingCount: "10",
        bestRating: "5",
        worstRating: "1",
      },
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
