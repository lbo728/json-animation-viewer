import { describe, expect, it } from "vitest";
import {
  isAdSenseEligiblePath,
  normalizeContentPath,
} from "@/lib/adsense-policy";

describe("normalizeContentPath", () => {
  it.each([
    ["/", "/"],
    ["/en", "/"],
    ["/ko/", "/"],
    ["/ko/guide/", "/guide"],
    ["/blog/what-is-lottie", "/blog/what-is-lottie"],
  ])("normalizes %s to %s", (pathname, expected) => {
    expect(normalizeContentPath(pathname)).toBe(expected);
  });
});

describe("isAdSenseEligiblePath", () => {
  it.each([
    "/",
    "/about",
    "/methodology",
    "/ko/faq",
    "/en/blog",
    "/ko/blog/lottie-vs-gif",
  ])("allows substantive content path %s", (pathname) => {
    expect(isAdSenseEligiblePath(pathname)).toBe(true);
  });

  it.each([
    "/privacy",
    "/ko/terms",
    "/not-found",
    "/blog/missing-post",
    "/ko/blog/missing-post",
  ])("does not load advertising code on %s", (pathname) => {
    expect(isAdSenseEligiblePath(pathname)).toBe(false);
  });
});
