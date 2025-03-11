"use client";

import { useState, useEffect, useRef } from "react";

// lottie-web의 타입 정의
interface LottiePlayer {
  loadAnimation: (params: {
    container: HTMLElement;
    renderer: string;
    loop: boolean;
    autoplay: boolean;
    animationData: any;
  }) => LottieAnimation;
}

interface LottieAnimation {
  destroy: () => void;
}

export default function Home() {
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [animationSize, setAnimationSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [fileName, setFileName] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<LottieAnimation | null>(null);

  useEffect(() => {
    // 동적으로 lottie-web 불러오기
    import("lottie-web").then((lottieModule) => {
      setLottie(lottieModule.default);
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
      // 이전 애니메이션이 있으면 제거
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

      if (typeof animationData === "object" && animationData !== null) {
        const data = animationData as { w?: number; h?: number };
        if (data.w && data.h) {
          setAnimationSize({ width: data.w, height: data.h });
        }
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
          setAnimationData(JSON.parse(e.target?.result as string));
          setFileName(file.name);
        } catch {
          console.error("Invalid JSON file");
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
          setAnimationData(JSON.parse(e.target?.result as string));
          setFileName(file.name);
        } catch {
          console.error("Invalid JSON file");
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
        <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" ref={fileInputRef} />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-900 transition-all"
          onClick={handleButtonClick}
        >
          파일 선택
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
          애니메이션 사이즈(뷰포트 포함): {animationSize.width} x {animationSize.height}
        </p>
      </div>
    </div>
  );
}
