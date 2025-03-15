"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import type { AnimationItem, LottiePlayer } from "lottie-web";

interface AnimationData {
  w?: number;
  h?: number;
  [key: string]: unknown;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-96 bg-gray-800 rounded-lg">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  );
}

function AnimationContainer({
  lottie,
  animationData,
  containerRef,
  setAnimationSize,
}: {
  lottie: LottiePlayer | null;
  animationData: AnimationData | null;
  containerRef: React.RefObject<HTMLDivElement>;
  setAnimationSize: (size: { width: number; height: number }) => void;
}) {
  const animationRef = useRef<AnimationItem | null>(null);

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
  }, [lottie, animationData, containerRef, setAnimationSize]);

  return null;
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

  useEffect(() => {
    const loadLottie = async () => {
      try {
        const lottieModule = await import("lottie-web");
        setLottie(lottieModule.default);
      } catch (error) {
        console.error("Failed to load lottie-web:", error);
      }
    };

    loadLottie();

    const updateViewportSize = () => {};

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
    };
  }, []);

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-900">
      <h1 className="text-[40px] md:text-[48px] lg:text-[72px] font-extrabold text-white mb-2 text-center">
        JSON Animation Viewer
      </h1>
      <h2 className="text-[16px] md:text-[18px] lg:text-[20px] text-gray-300 mb-2 text-center">
        Easily preview your JSON animations by dragging them here!
      </h2>
      <p className="text-[12px] md:text-[14px] lg:text-[16px] text-gray-400 mb-6 text-center">
        Your JSON will not be stored on this site. You can rest assured as this
        site has no database.
      </p>

      <label className="mb-4 w-fit text-center">
        {fileName && (
          <span className="mt-2 mr-2 text-gray-200">{fileName}</span>
        )}
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          className="relative bg-opacity-30 bg-gray-800 text-white px-[48px] py-3 rounded-lg shadow-md hover:bg-opacity-50 transition-all w-full md:w-auto backdrop-blur-md border border-gray-700 overflow-hidden cursor-pointer hover:bg-gray-900"
          onClick={handleButtonClick}
          aria-label="Select JSON file"
        >
          Select File
          <span className="absolute inset-0 w-full h-full border-2 border-transparent rounded-lg animate-pulse"></span>
        </button>
      </label>
      <div
        ref={containerRef}
        className="border border-gray-700 w-full max-w-md h-96 flex items-center justify-center mb-8 bg-gray-800 rounded-lg shadow-lg"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        aria-label="Drop zone for JSON animation files"
        role="region"
      >
        {!animationData && (
          <p className="text-gray-400">Drag and drop your JSON here!</p>
        )}
      </div>
      {lottie && animationData && (
        <Suspense fallback={<LoadingFallback />}>
          <AnimationContainer
            lottie={lottie}
            animationData={animationData}
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
            setAnimationSize={setAnimationSize}
          />
        </Suspense>
      )}
      <div className="mt-4">
        <p className="animation-size text-gray-300">
          Animation Size(include viewport): {animationSize.width} x{" "}
          {animationSize.height}
        </p>
      </div>
    </div>
  );
}
