import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAdSense } from "@/pages/GoogleAdsense";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JSON Animation Viewer - Preview Your JSON Animations",
  description:
    "Easily preview your JSON animations with our user-friendly JSON Animation Viewer. Drag and drop your JSON files to see them in action!",
  keywords:
    "JSON, 애니메이션, 뷰어, json animation viewer, json viewer, json 미리보기, Lottie, 미리보기, JSON 미리보기",
  openGraph: {
    title: "JSON Animation Viewer",
    description: "Easily preview your JSON animations with our user-friendly JSON Animation Viewer.",
    type: "website",
    url: "https://yourwebsite.com",
    images: [
      {
        url: "https://yourwebsite.com/image.png",
        width: 800,
        height: 600,
        alt: "JSON Animation Viewer",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
      <GoogleAdSense />
    </html>
  );
}
