import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GoogleAdSense from "@/components/GoogleAdsense";
import JsonLd from "./JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "JSON Animation Viewer - Preview Your JSON Animations",
  description:
    "Easily preview your JSON animations with our user-friendly JSON Animation Viewer. Drag and drop your JSON files to see them in action instantly!",
  keywords:
    "JSON, 애니메이션, 뷰어, json animation viewer, json viewer, json 미리보기, Lottie, 미리보기, JSON 미리보기, lottie viewer, animation preview",
  authors: [{ name: "JSON Animation Viewer Team" }],
  creator: "JSON Animation Viewer Team",
  publisher: "JSON Animation Viewer",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://json-animation-viewer.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "JSON Animation Viewer - Preview Your JSON Animations",
    description:
      "Easily preview your JSON animations with our user-friendly JSON Animation Viewer. Drag and drop your JSON files to see them in action!",
    type: "website",
    url: "https://json-animation-viewer.vercel.app",
    siteName: "JSON Animation Viewer",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JSON Animation Viewer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Animation Viewer - Preview Your JSON Animations",
    description: "Easily preview your JSON animations with our user-friendly JSON Animation Viewer.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <GoogleAdSense />
        <JsonLd />
      </body>
    </html>
  );
}
