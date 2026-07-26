import { setRequestLocale } from "next-intl/server";
import BlogArticle, {
  buildBlogMetadata,
} from "../_components/BlogArticle";

const SLUG = "what-is-lottie";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildBlogMetadata(locale, SLUG);
}

export default async function WhatIsLottiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BlogArticle locale={locale} slug={SLUG} />;
}
