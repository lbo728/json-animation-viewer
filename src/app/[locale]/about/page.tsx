import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/Breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "en" ? "/about" : `/${locale}/about`,
      languages: { en: "/about", ko: "/ko/about" },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tc = await getTranslations("common");

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Breadcrumb
          locale={locale}
          items={[
            { name: locale === "ko" ? "홈" : "Home", href: "/" },
            { name: locale === "ko" ? "소개" : "About", href: "/about" },
          ]}
        />
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block transition-colors"
        >
          {tc("backToHome")}
        </Link>

        <h1 className="text-4xl font-bold text-white mb-6">{t("title")}</h1>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("whatIsTitle")}
            </h2>
            <p>
              {t.rich("whatIsDesc", {
                strong: (chunks) => (
                  <strong className="text-white">{chunks}</strong>
                ),
              })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("whyBuiltTitle")}
            </h2>
            <p>{t("whyBuiltDesc1")}</p>
            <p className="mt-3">{t("whyBuiltDesc2")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("featuresTitle")}
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              {(
                [
                  "featureInstantPreview",
                  "featurePrivacy",
                  "featureSizeDetection",
                  "featureAnalysis",
                  "featureDragDrop",
                  "featureMobile",
                  "featureFree",
                ] as const
              ).map((key) => (
                <li key={key}>
                  {t.rich(key, {
                    strong: (chunks) => (
                      <strong className="text-white">{chunks}</strong>
                    ),
                  })}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("whatAreLottieTitle")}
            </h2>
            <p>{t("whatAreLottieDesc")}</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              {(
                [
                  "lottieFeatureLightweight",
                  "lottieFeatureScalable",
                  "lottieFeatureInteractive",
                  "lottieFeatureCrossPlatform",
                ] as const
              ).map((key) => (
                <li key={key}>
                  {t.rich(key, {
                    strong: (chunks) => (
                      <strong className="text-white">{chunks}</strong>
                    ),
                  })}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("technologyTitle")}
            </h2>
            <p>{t("technologyDesc")}</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              {(
                [
                  "techNextjs",
                  "techReact",
                  "techLottie",
                  "techTailwind",
                  "techTypescript",
                ] as const
              ).map((key) => (
                <li key={key}>
                  {t.rich(key, {
                    strong: (chunks) => (
                      <strong className="text-white">{chunks}</strong>
                    ),
                  })}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("methodologyTitle")}
            </h2>
            <p>
              {t.rich("methodologyDesc", {
                link: (chunks) => (
                  <Link
                    href="/methodology"
                    className="text-blue-400 hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("openSourceTitle")}
            </h2>
            <p>
              {t.rich("openSourceDesc", {
                link: (chunks) => (
                  <a
                    href="https://github.com/byungsker/json-animation-viewer"
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("contactTitle")}
            </h2>
            <p>
              {t.rich("contactDesc", {
                link: (chunks) => (
                  <a
                    href="https://github.com/byungsker/json-animation-viewer/issues"
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("exploreTitle")}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link href="/guide" className="text-blue-400 hover:underline">
                  {t("exploreGuide")}
                </Link>{" "}
                {t("exploreGuideDesc")}
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-blue-400 hover:underline"
                >
                  {t("exploreMethodology")}
                </Link>{" "}
                {t("exploreMethodologyDesc")}
              </li>
              <li>
                <Link href="/blog" className="text-blue-400 hover:underline">
                  {t("exploreBlog")}
                </Link>{" "}
                {t("exploreBlogDesc")}
              </li>
              <li>
                <Link href="/faq" className="text-blue-400 hover:underline">
                  {t("exploreFaq")}
                </Link>{" "}
                {t("exploreFaqDesc")}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
