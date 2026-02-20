"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GEO_OPTIONS } from "@/lib/constants";

export function GeoFilter({ activeGeo = "all" }: { activeGeo?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClick(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("geo");
    } else {
      params.set("geo", slug);
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/", { scroll: false });
  }

  return (
    <div className="flex gap-1.5 overflow-x-auto py-2 pb-3 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {GEO_OPTIONS.map((geo) => (
        <button
          key={geo.slug}
          onClick={() => handleClick(geo.slug)}
          className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
            activeGeo === geo.slug
              ? "bg-warm-800 text-warm-50"
              : "bg-warm-100 text-warm-600 hover:bg-warm-200"
          }`}
        >
          {geo.label}
        </button>
      ))}
    </div>
  );
}
