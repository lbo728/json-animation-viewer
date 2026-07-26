import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/Breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.faq" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "en" ? "/faq" : `/${locale}/faq`,
      languages: { en: "/faq", ko: "/ko/faq" },
    },
  };
}

async function FaqJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "faq" });
  const faqItems = [
    { q: t("jsonLdQ1"), a: t("jsonLdA1") },
    { q: t("jsonLdQ2"), a: t("jsonLdA2") },
    { q: t("jsonLdQ3"), a: t("jsonLdA3") },
    { q: t("jsonLdQ4"), a: t("jsonLdA4") },
    { q: t("jsonLdQ5"), a: t("jsonLdA5") },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const tc = await getTranslations("common");

  return (
    <>
      <FaqJsonLd locale={locale} />
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Breadcrumb
            locale={locale}
            items={[
              { name: locale === "ko" ? "홈" : "Home", href: "/" },
              { name: "FAQ", href: "/faq" },
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
            <p>{t("intro")}</p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {t("q1Title")}
              </h2>
              <p>{t("q1Answer")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {t("q2Title")}
              </h2>
              <p>{t("q2Answer")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {t("q3Title")}
              </h2>
              <p>{t("q3Answer")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {t("q4Title")}
              </h2>
              <p>{t("q4Answer")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {t("q5Title")}
              </h2>
              <p>{t("q5Intro")}</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                {(
                  [
                    "q5InvalidJson",
                    "q5NotLottie",
                    "q5ExternalAssets",
                    "q5Unsupported",
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
                {t("q6Title")}
              </h2>
              <p>{t("q6Answer")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {t("q7Title")}
              </h2>
              <p>
                {t.rich("q7Answer", {
                  link: (chunks) => (
                    <Link
                      href="/blog/how-to-create-lottie-animation"
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
                {t("q8Title")}
              </h2>
              <p>
                {t.rich("q8Answer", {
                  link: (chunks) => (
                    <Link
                      href="/blog/lottie-vs-gif"
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
                {t("q9Title")}
              </h2>
              <p>
                {t.rich("q9Answer", {
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
                {t("q10Title")}
              </h2>
              <p>{t("q10Answer")}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                {t("q11Title")}
              </h2>
              <p>
                {t.rich("q11Answer", {
                  lottiefilesLink: (chunks) => (
                    <a
                      href="https://lottiefiles.com"
                      className="text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {chunks}
                    </a>
                  ),
                  blogLink: (chunks) => (
                    <Link
                      href="/blog/best-lottie-resources"
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
                {t("q12Title")}
              </h2>
              <p>
                {t.rich("q12Answer", {
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
          </div>
        </div>
      </div>
    </>
  );
}
