import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { BLOG_SLUGS, getBlogPost } from "@/content/blog-posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.blog" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "en" ? "/blog" : `/${locale}/blog`,
      languages: { en: "/blog", ko: "/ko/blog" },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const tc = await getTranslations("common");
  const posts = BLOG_SLUGS.map((slug) => getBlogPost(slug, locale));

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Breadcrumb
          locale={locale}
          items={[
            { name: locale === "ko" ? "홈" : "Home", href: "/" },
            { name: locale === "ko" ? "블로그" : "Blog", href: "/blog" },
          ]}
        />
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block transition-colors"
        >
          {tc("backToHome")}
        </Link>

        <h1 className="text-4xl font-bold text-white mb-4">{t("title")}</h1>
        <p className="text-gray-400 mb-12 text-lg">{t("description")}</p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-gray-700 rounded-lg p-6 hover:border-gray-500 transition-colors"
            >
              <time
                className="text-sm text-gray-500 block mb-2"
                dateTime="2026-07-26"
              >
                {locale === "ko"
                  ? "최초 게시 2026-02-23 · 검토 2026-07-26"
                  : "Published 2026-02-23 · reviewed 2026-07-26"}
              </time>
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-400 mb-3">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                {tc("readMore")}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
