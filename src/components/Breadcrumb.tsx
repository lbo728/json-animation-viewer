import { Link } from "@/i18n/navigation";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale?: string;
}

function localizedPath(href: string, locale?: string): string {
  if (locale !== "ko") {
    return href;
  }

  return href === "/" ? "/ko" : `/ko${href}`;
}

export default function Breadcrumb({ items, locale }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://json-animation-viewer.com${localizedPath(item.href, locale)}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-400">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-300">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
