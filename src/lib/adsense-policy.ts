const ADSENSE_CONTENT_PATHS = new Set([
  "/",
  "/about",
  "/guide",
  "/methodology",
  "/faq",
  "/blog",
  "/blog/what-is-lottie",
  "/blog/json-animation-tutorial",
  "/blog/lottie-vs-gif",
  "/blog/best-lottie-resources",
  "/blog/how-to-create-lottie-animation",
]);

export function normalizeContentPath(pathname: string): string {
  const withoutLocale = pathname.replace(/^\/(?:en|ko)(?=\/|$)/, "");
  if (withoutLocale === "" || withoutLocale === "/") {
    return "/";
  }

  return withoutLocale.replace(/\/+$/, "");
}

export function isAdSenseEligiblePath(pathname: string): boolean {
  return ADSENSE_CONTENT_PATHS.has(normalizeContentPath(pathname));
}
