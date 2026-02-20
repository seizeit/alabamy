"use client";

import { useRouter, useSearchParams } from "next/navigation";

const REGIONS = [
  { slug: "birmingham", label: "Birmingham" },
  { slug: "huntsville", label: "Huntsville" },
  { slug: "mobile", label: "Mobile" },
  { slug: "montgomery", label: "Montgomery" },
  { slug: "tuscaloosa", label: "Tuscaloosa" },
  { slug: "auburn", label: "Auburn" },
];

export function GeoFilter({ activeGeo = "all" }: { activeGeo?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("geo");
    } else {
      params.set("geo", slug);
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/", { scroll: false });
  }

  const isFiltered = activeGeo !== "all";
  const activeLabel = REGIONS.find((r) => r.slug === activeGeo)?.label;

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={isFiltered ? activeGeo : ""}
        onChange={(e) => navigate(e.target.value || "all")}
        className="bg-porch-tan/10 text-porch-tan text-[10px] sm:text-[11px] font-medium border-none rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-crimson-500 cursor-pointer"
      >
        <option value="">Region</option>
        {REGIONS.map((r) => (
          <option key={r.slug} value={r.slug}>
            {r.label}
          </option>
        ))}
      </select>
      {isFiltered && (
        <button
          onClick={() => navigate("all")}
          className="text-porch-tan/50 hover:text-white text-xs leading-none transition-colors"
          aria-label="Clear region filter"
        >
          &times;
        </button>
      )}
    </div>
  );
}
