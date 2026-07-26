import Breadcrumb from "@/components/Breadcrumb";
import BlogPostJsonLd from "@/components/BlogPostJsonLd";
import { Link } from "@/i18n/navigation";
import {
  BLOG_MODIFIED_AT,
  BLOG_PUBLISHED_AT,
  getBlogPost,
} from "@/content/blog-posts";

interface BlogArticleProps {
  locale: string;
  slug: string;
}

export function buildBlogMetadata(locale: string, slug: string) {
  const post = getBlogPost(slug, locale);
  const path = locale === "ko" ? `/ko/blog/${slug}` : `/blog/${slug}`;

  return {
    title: `${post.title} - JSON Animation Viewer`,
    description: post.description,
    alternates: {
      canonical: path,
      languages: {
        en: `/blog/${slug}`,
        ko: `/ko/blog/${slug}`,
      },
    },
    openGraph: {
      type: "article" as const,
      url: `https://json-animation-viewer.com${path}`,
      title: post.title,
      description: post.description,
      publishedTime: BLOG_PUBLISHED_AT,
      modifiedTime: BLOG_MODIFIED_AT,
    },
  };
}

export default function BlogArticle({ locale, slug }: BlogArticleProps) {
  const post = getBlogPost(slug, locale);
  const isKorean = locale === "ko";

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Breadcrumb
          locale={locale}
          items={[
            { name: isKorean ? "홈" : "Home", href: "/" },
            { name: isKorean ? "블로그" : "Blog", href: "/blog" },
            { name: post.title, href: `/blog/${slug}` },
          ]}
        />
        <BlogPostJsonLd
          title={post.title}
          description={post.description}
          datePublished={BLOG_PUBLISHED_AT}
          dateModified={BLOG_MODIFIED_AT}
          slug={slug}
          locale={locale}
        />

        <Link
          href="/blog"
          className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block transition-colors"
        >
          {isKorean ? "← 블로그로 돌아가기" : "← Back to Blog"}
        </Link>

        <article>
          <p className="text-sm text-gray-500 mb-4">
            <time dateTime="2026-02-23">
              {isKorean ? "최초 게시: 2026년 2월 23일" : "Published: February 23, 2026"}
            </time>
            <span aria-hidden="true"> · </span>
            <time dateTime="2026-07-26">
              {isKorean ? "검토·수정: 2026년 7월 26일" : "Reviewed and revised: July 26, 2026"}
            </time>
          </p>
          <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>
          <p className="text-lg text-gray-300 leading-relaxed border-l-4 border-blue-500/70 pl-5 mb-10">
            {post.summary}
          </p>

          <div className="prose prose-invert max-w-none space-y-10 text-gray-300 leading-relaxed">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 first:mt-0">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="list-disc pl-6 mt-4 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {section.note ? (
                  <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-950/20 p-4 text-amber-100">
                    {section.note}
                  </p>
                ) : null}
              </section>
            ))}
          </div>
        </article>

        <aside className="mt-12 pt-8 border-t border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">
            {isKorean ? "관련 글" : "Related posts"}
          </h2>
          <ul className="space-y-3">
            {post.related.map((relatedSlug) => {
              const related = getBlogPost(relatedSlug, locale);
              return (
                <li key={relatedSlug}>
                  <Link
                    href={`/blog/${relatedSlug}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {related.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
