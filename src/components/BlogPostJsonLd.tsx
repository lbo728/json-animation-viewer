interface BlogPostJsonLdProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  slug: string;
  locale: string;
}

export default function BlogPostJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  slug,
  locale,
}: BlogPostJsonLdProps) {
  const path =
    locale === "en" ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
  const url = `https://json-animation-viewer.com${path}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished,
    dateModified,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
    author: {
      "@type": "Person",
      name: "byungsker",
      url: "https://github.com/byungsker",
    },
    publisher: {
      "@type": "Organization",
      name: "JSON Animation Viewer",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: "https://json-animation-viewer.com/og-image.png",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
