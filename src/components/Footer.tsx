"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full border-t border-gray-800 bg-gray-900 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">JSON Animation Viewer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">{t("pages")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t("howToUse")}
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t("methodology")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t("blog")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">{t("legal")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t("termsOfService")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://github.com/byungsker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              byungsker
            </a>
            . {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
