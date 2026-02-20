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
    <header className="sticky top-0 z-50 bg-warm-50 border-b border-warm-300 shadow-sm">
      <div className="h-0.5 bg-crimson-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/alabamy-icon.png"
              alt=""
              width={48}
              height={32}
              className="h-8 w-auto"
              aria-hidden="true"
            />
            <Image
              src="/alabamy-wordmark.png"
              alt="Alabamy"
              width={140}
              height={32}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <span className="hidden sm:block font-display text-sm font-light uppercase tracking-[0.15em] text-warm-600">
            Boundless.
          </span>
        </div>
        <CategoryNav categories={categories} />
        <GeoFilter activeGeo={activeGeo} />
      </div>
    </header>
  );
}
