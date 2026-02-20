import Image from "next/image";
import Link from "next/link";
import CategoryNav from "./category-nav";
import { GeoFilter } from "./geo-filter";

type CategoryInfo = { name: string; slug: string };

function formatDateLine(timestamp: string): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";
  const day = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  });
  return `${day} — Updated ${time} CT`;
}

export default function Header({
  categories = [],
  activeGeo = "all",
  lastUpdatedAt,
}: {
  categories?: CategoryInfo[];
  activeGeo?: string;
  lastUpdatedAt?: string | null;
}) {
  return (
    <>
      {/* Compact header */}
      <header className="bg-porch-dark text-porch-cream">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/alabamy-icon.png"
              alt=""
              width={48}
              height={32}
              className="h-7 w-auto"
              aria-hidden="true"
            />
            <Image
              src="/alabamy-wordmark.png"
              alt="Alabamy"
              width={140}
              height={32}
              className="h-6 w-auto brightness-0 invert"
              priority
            />
          </Link>
          <span className="hidden sm:block font-serif italic text-porch-tan text-sm tracking-wide">
            Boundless.
          </span>
        </div>
      </header>

      {/* Sticky nav — always visible */}
      <nav className="sticky top-0 z-50 bg-porch-dark-light border-b border-porch-tan/20 shadow-lg">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-1.5">
          {/* Mobile: dropdown above tabs, full width for each */}
          <div className="sm:hidden">
            <div className="pb-1.5 mb-1.5 border-b border-porch-tan/10">
              <GeoFilter activeGeo={activeGeo} />
            </div>
            <CategoryNav categories={categories} />
          </div>
          {/* Desktop: dropdown left, divider, tabs right */}
          <div className="hidden sm:flex items-center">
            <div className="shrink-0 pr-4 mr-3 border-r border-porch-tan/20">
              <GeoFilter activeGeo={activeGeo} />
            </div>
            <div className="flex-1 min-w-0">
              <CategoryNav categories={categories} />
            </div>
          </div>
          {lastUpdatedAt && (
            <div className="text-[10px] text-porch-tan/50 font-sans tracking-wide pt-1 pb-0.5 border-t border-porch-tan/10 mt-1.5">
              {formatDateLine(lastUpdatedAt)}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
