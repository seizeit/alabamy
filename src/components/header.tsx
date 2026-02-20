import Image from "next/image";
import Link from "next/link";
import CategoryNav from "./category-nav";
import { GeoFilter } from "./geo-filter";

type CategoryInfo = { name: string; slug: string };

export default function Header({
  categories = [],
  activeGeo = "all",
}: {
  categories?: CategoryInfo[];
  activeGeo?: string;
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
          <div className="flex items-center">
            <div className="shrink-0 pr-4 mr-3 border-r border-porch-tan/20">
              <GeoFilter activeGeo={activeGeo} />
            </div>
            <div className="flex-1 min-w-0">
              <CategoryNav categories={categories} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
