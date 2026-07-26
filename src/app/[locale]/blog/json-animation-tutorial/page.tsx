import { setRequestLocale } from "next-intl/server";
import BlogArticle, {
  buildBlogMetadata,
} from "../_components/BlogArticle";

const SLUG = "json-animation-tutorial";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildBlogMetadata(locale, SLUG);
}

export default async function JsonAnimationTutorialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BlogArticle locale={locale} slug={SLUG} />;
}
