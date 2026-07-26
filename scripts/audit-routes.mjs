const baseUrl = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const productionOrigin = "https://json-animation-viewer.com";

function getLinkHref(html, rel, hrefLang) {
  const tags = [...html.matchAll(/<link [^>]+>/g)].map((match) => match[0]);
  const tag = tags.find(
    (candidate) =>
      candidate.includes(`rel="${rel}"`) &&
      (!hrefLang || candidate.includes(`hrefLang="${hrefLang}"`)),
  );
  return tag?.match(/href="([^"]+)"/)?.[1] || null;
}

function sameUrl(actual, expected) {
  if (!actual) return false;
  return new URL(actual).href === new URL(expected).href;
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
if (!sitemapResponse.ok) {
  throw new Error(`sitemap.xml returned ${sitemapResponse.status}`);
}

const sitemap = await sitemapResponse.text();
const productionUrls = [
  ...sitemap.matchAll(/<loc>(https:\/\/json-animation-viewer\.com[^<]*)<\/loc>/g),
].map((match) => match[1]);

if (productionUrls.length === 0) {
  throw new Error("No sitemap URLs found");
}

const rows = [];
const failures = [];

for (const productionUrl of productionUrls) {
  const path = new URL(productionUrl).pathname;
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const expectedLocale = path === "/ko" || path.startsWith("/ko/") ? "ko" : "en";
  const englishPath = path === "/ko" ? "/" : path.replace(/^\/ko/, "");
  const koreanPath = englishPath === "/" ? "/ko" : `/ko${englishPath}`;
  const expectedEnglish = `${productionOrigin}${englishPath}`;
  const expectedKorean = `${productionOrigin}${koreanPath}`;
  const normalizedPath = expectedLocale === "ko" ? path.replace(/^\/ko/, "") || "/" : path;
  const shouldLoadAdsense = normalizedPath !== "/privacy" && normalizedPath !== "/terms";
  const hasAdsense = html.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || "(missing)";
  const checks = {
    status: response.status === 200,
    language: html.includes(`<html lang="${expectedLocale}"`),
    canonical: sameUrl(getLinkHref(html, "canonical"), productionUrl),
    englishAlternate: sameUrl(
      getLinkHref(html, "alternate", "en"),
      expectedEnglish,
    ),
    koreanAlternate: sameUrl(
      getLinkHref(html, "alternate", "ko"),
      expectedKorean,
    ),
    adsensePolicy: shouldLoadAdsense ? hasAdsense : !hasAdsense,
  };

  for (const [name, passed] of Object.entries(checks)) {
    if (!passed) failures.push(`${path}: ${name}`);
  }

  if (
    expectedLocale === "ko" &&
    path.startsWith("/ko/blog/") &&
    (html.match(/[가-힣]/g)?.length || 0) < 100
  ) {
    failures.push(`${path}: Korean article body`);
  }

  rows.push({
    path,
    status: response.status,
    lang: expectedLocale,
    title,
    passed: Object.values(checks).every(Boolean),
  });
}

const missingResponse = await fetch(`${baseUrl}/route-that-must-not-exist`);
if (missingResponse.status !== 404) {
  failures.push(`/route-that-must-not-exist: expected 404, got ${missingResponse.status}`);
}
const missingHtml = await missingResponse.text();
if (missingHtml.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) {
  failures.push("/route-that-must-not-exist: advertising script");
}

console.table(rows);
console.log(`Audited ${rows.length} sitemap URLs; missing-route status=${missingResponse.status}`);

if (failures.length > 0) {
  console.error("Route audit failures:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("All route audit checks passed.");
}
