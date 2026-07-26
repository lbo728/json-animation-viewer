import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/Breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.guide" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "en" ? "/guide" : `/${locale}/guide`,
      languages: { en: "/guide", ko: "/ko/guide" },
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guide");
  const tc = await getTranslations("common");

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Breadcrumb
          locale={locale}
          items={[
            { name: locale === "ko" ? "홈" : "Home", href: "/" },
            { name: locale === "ko" ? "사용법" : "How to Use", href: "/guide" },
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
            <p>{t("intro")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("step1Title")}
            </h2>
            <p>
              {t.rich("step1Desc", {
                link: (chunks) => (
                  <Link href="/" className="text-blue-400 hover:underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("step2Title")}
            </h2>
            <p>{t("step2Desc")}</p>
            <ul className="list-disc pl-6 mt-3 space-y-3">
              <li>
                {t.rich("step2DragDrop", {
                  strong: (chunks) => (
                    <strong className="text-white">{chunks}</strong>
                  ),
                })}
              </li>
              <li>
                {t.rich("step2ClickSelect", {
                  strong: (chunks) => (
                    <strong className="text-white">{chunks}</strong>
                  ),
                })}
              </li>
            </ul>
            <p className="mt-3">{t("step2Note")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("step3Title")}
            </h2>
            <p>{t("step3Desc1")}</p>
            <p className="mt-3">{t("step3Desc2")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("step4Title")}
            </h2>
            <p>{t("step4Desc1")}</p>
            <p className="mt-3">{t("step4Desc2")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("step5Title")}
            </h2>
            <p>{t("step5Desc1")}</p>
            <p className="mt-3">{t("step5Desc2")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("step6Title")}
            </h2>
            <p>{t("step6Desc")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("tipsTitle")}
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              {(
                [
                  "tipOptimize",
                  "tipMultipleSizes",
                  "tipValidate",
                  "tipCrossBrowser",
                  "tipDuringDev",
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
              {t("privacyTitle")}
            </h2>
            <p>{t("privacyDesc")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("formatsTitle")}
            </h2>
            <p>{t("formatsDesc")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("helpTitle")}
            </h2>
            <p>
              {t.rich("helpDesc", {
                faqLink: (chunks) => (
                  <Link href="/faq" className="text-blue-400 hover:underline">
                    {chunks}
                  </Link>
                ),
                githubLink: (chunks) => (
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
              {t("relatedTitle")}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link
                  href="/blog/what-is-lottie"
                  className="text-blue-400 hover:underline"
                >
                  {t("relatedWhatIsLottie")}
                </Link>{" "}
                {t("relatedWhatIsLottieDesc")}
              </li>
              <li>
                <Link
                  href="/blog/json-animation-tutorial"
                  className="text-blue-400 hover:underline"
                >
                  {t("relatedTutorial")}
                </Link>{" "}
                {t("relatedTutorialDesc")}
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-blue-400 hover:underline"
                >
                  {t("relatedAbout")}
                </Link>{" "}
                {t("relatedAboutDesc")}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
