"use client";

import { useState, useEffect, useRef } from "react";
import type { AnimationItem, LottiePlayer } from "lottie-web";

interface AnimationData {
  w?: number;
  h?: number;
  [key: string]: unknown;
}

export default function Home() {
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);
  const [animationData, setAnimationData] = useState<AnimationData | null>(
    null
  );
  const [animationSize, setAnimationSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const [fileName, setFileName] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    import("lottie-web")
      .then((lottieModule) => {
        setLottie(lottieModule.default);
      })
      .catch((error) => {
        console.error("Failed to load lottie-web:", error);
      });

    const updateViewportSize = () => {};

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
    };
  }, []);

  useEffect(() => {
    if (lottie && animationData && containerRef.current) {
      if (animationRef.current) {
        animationRef.current.destroy();
      }

      containerRef.current.innerHTML = "";
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      });

      if (animationData.w && animationData.h) {
        setAnimationSize({ width: animationData.w, height: animationData.h });
      }

      return () => {
        if (animationRef.current) {
          animationRef.current.destroy();
        }
      };
    }
  }, [lottie, animationData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          if (result) {
            const parsedData = JSON.parse(result) as AnimationData;
            setAnimationData(parsedData);
            setFileName(file.name);
          }
        } catch (error) {
          console.error("Invalid JSON file", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          if (result) {
            const parsedData = JSON.parse(result) as AnimationData;
            setAnimationData(parsedData);
            setFileName(file.name);
          }
        } catch (error) {
          console.error("Invalid JSON file", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <label className="mb-4">
        {fileName && <span className="mt-2 mr-2">{fileName}</span>}
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900 transition-all"
          onClick={handleButtonClick}
        >
          Select File
        </button>
      </label>
      <div
        ref={containerRef}
        className="border border-gray-300"
        style={{
          width: "480px",
          height: "480px",
          overflow: "hidden",
          position: "relative",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      ></div>
      <div className="mt-4">
        <p>
          Animation Size(include viewport): {animationSize.width} x{" "}
          {animationSize.height}
        </p>
      </div>
    </div>
  );
}
