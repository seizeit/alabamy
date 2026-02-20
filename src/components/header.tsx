import Image from "next/image";
import Link from "next/link";
import CategoryNav from "./category-nav";
import { GeoFilter } from "./geo-filter";
import { SmartNav } from "./smart-nav";

type CategoryInfo = { name: string; slug: string };

export default function Header({
  categories = [],
  activeGeo = "all",
  headlineCount = 0,
  sourceCount = 44,
}: {
  categories?: CategoryInfo[];
  activeGeo?: string;
  headlineCount?: number;
  sourceCount?: number;
}) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Hero */}
      <header className="bg-porch-dark text-porch-cream">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 sm:py-14 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2 sm:gap-3">
            <Image
              src="/alabamy-icon.png"
              alt=""
              width={72}
              height={48}
              className="h-10 sm:h-12 w-auto"
              aria-hidden="true"
            />
            <Image
              src="/alabamy-wordmark.png"
              alt="Alabamy"
              width={200}
              height={44}
              className="h-8 sm:h-10 w-auto brightness-0 invert"
              priority
            />
          </Link>
          <p className="font-serif italic text-porch-tan text-sm sm:text-base mt-2 sm:mt-3 tracking-wide">
            Boundless.
          </p>
          <p className="text-xs sm:text-sm text-porch-tan/70 mt-3 sm:mt-4 font-sans">
            {today}
            {headlineCount > 0 && (
              <>
                {" "}&mdash; {headlineCount} headlines from {sourceCount} sources
              </>
            )}
          </p>
        </div>
      </header>

      {/* Sticky nav — dropdown left, topic tabs right */}
      <SmartNav>
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-1.5">
          <div className="flex items-start gap-2">
            <div className="shrink-0 pt-1">
              <GeoFilter activeGeo={activeGeo} />
            </div>
            <div className="flex-1 min-w-0">
              <CategoryNav categories={categories} />
            </div>
          </div>
        </div>
      </SmartNav>
    </>
  );
}
