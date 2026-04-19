"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AnimationItem, LottiePlayer } from "lottie-web";
import { AnalysisResult } from "@/components/analysis/AnalysisResult";
import type { LottieJson } from "@/lib/lottie-analyzer";

type AnimationData = LottieJson;

function LoadingFallback() {
  const t = useTranslations("common");
  return (
    <div className="flex items-center justify-center w-full h-96 bg-gray-800 rounded-lg">
      <div className="animate-pulse text-gray-400">{t("loading")}</div>
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
  const t = useTranslations("home");
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);
  const [animationData, setAnimationData] = useState<AnimationData | null>(
    null
  );
  const [animationSize, setAnimationSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSizeBytes, setFileSizeBytes] = useState<number | null>(null);
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

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        if (result) {
          const parsedData = JSON.parse(result) as AnimationData;
          setAnimationData(parsedData);
          setFileName(file.name);
          setFileSizeBytes(file.size);
        }
      } catch (error) {
        console.error("Invalid JSON file", error);
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) loadFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) loadFile(file);
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
    <div className="flex flex-col items-center bg-gray-900">
      <section className="flex flex-col items-center justify-center min-h-screen p-6 w-full">
        <h1 className="text-[40px] md:text-[48px] lg:text-[72px] font-extrabold text-white mb-2 text-center">
          {t("title")}
        </h1>
        <h2 className="text-[16px] md:text-[18px] lg:text-[20px] text-gray-300 mb-2 text-center">
          {t("subtitle")}
        </h2>
        <p className="text-[12px] md:text-[14px] lg:text-[16px] text-gray-400 mb-6 text-center">
          {t("privacyNote")}
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
            aria-label={t("selectFile")}
          >
            {t("selectFile")}
            <span className="absolute inset-0 w-full h-full border-2 border-transparent rounded-lg animate-pulse"></span>
          </button>
        </label>
        <div
          ref={containerRef}
          className="border border-gray-700 w-full max-w-md h-96 flex items-center justify-center mb-8 bg-gray-800 rounded-lg shadow-lg"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          aria-label={t("dropHere")}
          role="region"
        >
          {!animationData && (
            <p className="text-gray-400">{t("dropHere")}</p>
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
            {t("animationSize")} {animationSize.width} x{" "}
            {animationSize.height}
          </p>
        </div>
      </section>

      {animationData ? (
        <section className="w-full max-w-5xl mx-auto px-6 pb-16">
          <AnalysisResult data={animationData} fileSizeBytes={fileSizeBytes} />
        </section>
      ) : null}

      <section className="w-full max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          {t("howItWorks")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
              <span className="text-3xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t("step1Title")}</h3>
            <p className="text-gray-400">
              {t("step1Desc")}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
              <span className="text-3xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t("step2Title")}</h3>
            <p className="text-gray-400">
              {t("step2Desc")}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
              <span className="text-3xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t("step3Title")}</h3>
            <p className="text-gray-400">
              {t("step3Desc")}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          {t("whyChoose")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">{t("privacyTitle")}</h3>
            <p className="text-gray-400 leading-relaxed">
              {t("privacyDesc")}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">{t("fastTitle")}</h3>
            <p className="text-gray-400 leading-relaxed">
              {t("fastDesc")}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">{t("everywhereTitle")}</h3>
            <p className="text-gray-400 leading-relaxed">
              {t("everywhereDesc")}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">{t("devFriendlyTitle")}</h3>
            <p className="text-gray-400 leading-relaxed">
              {t("devFriendlyDesc")}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-3xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {t("whatAreLottie")}
        </h2>
        <div className="text-gray-400 leading-relaxed space-y-4">
          <p>{t("lottieDesc1")}</p>
          <p>{t("lottieDesc2")}</p>
          <p>{t("lottieDesc3")}</p>
        </div>
      </section>

      <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          {t("learnMore")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/guide"
            className="block bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">{t("learnGuideTitle")}</h3>
            <p className="text-gray-400 text-sm">
              {t("learnGuideDesc")}
            </p>
          </Link>
          <Link
            href="/blog"
            className="block bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">{t("learnBlogTitle")}</h3>
            <p className="text-gray-400 text-sm">
              {t("learnBlogDesc")}
            </p>
          </Link>
          <Link
            href="/about"
            className="block bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">{t("learnAboutTitle")}</h3>
            <p className="text-gray-400 text-sm">
              {t("learnAboutDesc")}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
