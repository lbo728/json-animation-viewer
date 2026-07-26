import { MetadataRoute } from "next";

const BASE_URL = "https://json-animation-viewer.com";
const locales = ["en", "ko"] as const;

type SitemapEntry = {
  path: string;
  lastModified: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

const pages: SitemapEntry[] = [
  {
    path: "",
    lastModified: "2026-07-26",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/about",
    lastModified: "2026-07-26",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/guide",
    lastModified: "2026-07-26",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/methodology",
    lastModified: "2026-07-26",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/faq",
    lastModified: "2026-07-26",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/blog",
    lastModified: "2026-07-26",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    path: "/blog/what-is-lottie",
    lastModified: "2026-07-26",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/blog/json-animation-tutorial",
    lastModified: "2026-07-26",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/blog/lottie-vs-gif",
    lastModified: "2026-07-26",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/blog/best-lottie-resources",
    lastModified: "2026-07-26",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/blog/how-to-create-lottie-animation",
    lastModified: "2026-07-26",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    path: "/privacy",
    lastModified: "2026-07-26",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/terms",
    lastModified: "2026-07-26",
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url:
        locale === "en"
          ? `${BASE_URL}${page.path || "/"}`
          : `${BASE_URL}/${locale}${page.path}`,
      lastModified: new Date(page.lastModified),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            l,
            l === "en"
              ? `${BASE_URL}${page.path || "/"}`
              : `${BASE_URL}/${l}${page.path}`,
          ])
        ),
      },
    }))
  );
}
