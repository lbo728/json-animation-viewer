"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function Header() {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();

  const navLinks = [
    { href: "/" as const, label: t("home") },
    { href: "/about" as const, label: t("about") },
    { href: "/guide" as const, label: t("guide") },
    { href: "/methodology" as const, label: t("methodology") },
    { href: "/faq" as const, label: t("faq") },
    { href: "/blog" as const, label: t("blog") },
  ];

  return (
    <header className="w-full border-b border-gray-800 bg-gray-900">
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-bold text-lg hover:text-gray-300 transition-colors"
        >
          {tHeader("siteName")}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={pathname}
            locale={locale === "en" ? "ko" : "en"}
            className="text-gray-400 hover:text-white text-sm transition-colors border border-gray-700 rounded px-2 py-1"
          >
            {locale === "en" ? "한국어" : "English"}
          </Link>
        </div>

        <details className="md:hidden group relative">
          <summary className="list-none cursor-pointer p-2 text-gray-400 hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 group-open:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hidden group-open:block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </summary>
          <ul className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg py-2 shadow-lg z-50">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-gray-700 mt-2 pt-2">
              <Link
                href={pathname}
                locale={locale === "en" ? "ko" : "en"}
                className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors"
              >
                {locale === "en" ? "한국어" : "English"}
              </Link>
            </li>
          </ul>
        </details>
      </nav>
    </header>
  );
}
