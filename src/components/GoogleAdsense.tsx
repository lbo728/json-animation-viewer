"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { isAdSenseEligiblePath } from "@/lib/adsense-policy";

export const GoogleAdSense = () => {
  const pathname = usePathname();

  if (!isAdSenseEligiblePath(pathname)) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2826132306659672"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};

export default GoogleAdSense;
