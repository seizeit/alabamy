"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GEO_OPTIONS } from "@/lib/constants";

export function GeoFilter({ activeGeo = "all" }: { activeGeo?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("geo");
    } else {
      params.set("geo", slug);
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/", { scroll: false });
  }

  const activeLabel =
    GEO_OPTIONS.find((g) => g.slug === activeGeo)?.label || "All Alabama";

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-xs uppercase tracking-wider text-porch-tan/60 font-medium shrink-0">
        Region
      </span>

      {/* Mobile: compact select dropdown */}
      <select
        value={activeGeo}
        onChange={(e) => handleChange(e.target.value)}
        className="sm:hidden bg-transparent text-porch-tan text-sm font-medium border border-porch-tan/30 rounded px-2 py-1 focus:outline-none focus:border-crimson-500"
      >
        {GEO_OPTIONS.map((geo) => (
          <option key={geo.slug} value={geo.slug}>
            {geo.label}
          </option>
        ))}
      </select>

      {/* Desktop: button row */}
      <div className="hidden sm:flex gap-1.5">
        {GEO_OPTIONS.map((geo) => (
          <button
            key={geo.slug}
            onClick={() => handleChange(geo.slug)}
            className={`whitespace-nowrap px-3 py-1 rounded text-xs font-medium transition-all shrink-0 ${
              activeGeo === geo.slug
                ? "bg-crimson-500 text-white"
                : "text-porch-tan/80 hover:text-white hover:bg-porch-tan/10"
            }`}
          >
            {geo.label}
          </button>
        ))}
      </div>
    </div>
  );
}
