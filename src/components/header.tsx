import Image from "next/image";
import Link from "next/link";
import CategoryNav from "./category-nav";

type CategoryInfo = { name: string; slug: string };

export default function Header({
  categories = [],
}: {
  categories?: CategoryInfo[];
}) {
  return (
    <header className="sticky top-0 z-50 bg-[#111111] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link href="/">
            <Image
              src="/alabamy-wordmark.png"
              alt="Alabamy"
              width={140}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <span className="hidden sm:block text-xs text-ink-muted">
            Boundless.
          </span>
        </div>
        <CategoryNav categories={categories} />
      </div>
    </header>
  );
}
