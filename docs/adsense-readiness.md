# AdSense readiness runbook

Last reviewed: 2026-07-26

This checklist reduces known site-quality and consent risks. It does not guarantee Google AdSense approval; Google makes the final decision.

## Current decision context

- The AdSense review reason observed on 2026-07-26 was “low value content.”
- Site ownership was verified.
- `ads.txt` was reachable in the live audit. Recheck it after every domain or deployment change.
- Search traffic was growing, but traffic volume alone does not resolve a content-value rejection.

## Technical quality gate

- [ ] Every URL in `sitemap.xml` returns the intended `200` page.
- [ ] Unknown URLs return `404` and do not render a localized homepage fallback.
- [ ] English pages use `lang="en"` and Korean pages use `lang="ko"`.
- [ ] Every indexable page has a self-referencing canonical URL.
- [ ] English and Korean counterparts expose reciprocal hreflang links.
- [ ] Blog article structured data uses the article's canonical localized URL.
- [ ] Visible publication and revision dates match structured data and repository history.
- [ ] Direct loads of legal, error, and unknown routes do not initiate the AdSense script; separately test client navigation from a page where advertising code has already executed.
- [ ] `ads.txt` contains the authorized publisher entry and returns `200` as plain text.

## Content-value gate

- [ ] Every indexable route has a distinct purpose, title, description, and substantive body.
- [ ] Korean article bodies are genuinely localized, not English text inside a Korean shell.
- [ ] Product claims describe implemented behavior and documented limits.
- [ ] Performance and compatibility outputs link to a transparent methodology.
- [ ] Numeric comparisons, benchmarks, company-usage claims, and “always/never” promises have evidence or are removed.
- [ ] Navigation, About, Guide, FAQ, Methodology, Privacy, Terms, and Blog agree on current functionality.
- [ ] Thin, duplicate, placeholder, or broken pages are removed from the sitemap until ready.

## Privacy and advertising gate

- [ ] The Privacy Policy distinguishes local JSON parsing from hosting, advertising, and external-asset requests.
- [ ] A Google-certified consent management platform is configured before serving ads where Google requires consent for users in the EEA, UK, and Switzerland.
- [ ] Consent choices are tested for accept, reject, and later withdrawal.
- [ ] Ad behavior is tested without assuming that browser cookie controls replace a required consent flow.
- [ ] Provider names and data-use descriptions match the live implementation.

## Release and resubmission

- [ ] Run unit tests, lint, production build, and end-to-end tests.
- [ ] Crawl all sitemap URLs in the production build and inspect status, language, canonical, and hreflang output.
- [ ] Visually inspect representative English and Korean desktop and mobile pages.
- [ ] Deploy only with owner authorization.
- [ ] Request Search Console indexing for repaired or newly substantive pages.
- [ ] Allow the deployed pages to be crawled before requesting another AdSense review.
- [ ] Record the deployed commit and the date the AdSense review was requested.

## Rollback

If a release introduces broken routes, incorrect localization, consent failure, or accidental ad initialization on a directly excluded page:

1. Stop the review request if it has not been submitted.
2. Restore the last verified deployment.
3. Capture the failing URL and evidence.
4. Fix and rerun every applicable gate before redeploying.
