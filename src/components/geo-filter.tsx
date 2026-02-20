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

  return (
    <div className="flex items-center gap-2">
      <select
        value={isFiltered ? activeGeo : ""}
        onChange={(e) => navigate(e.target.value || "all")}
        className="bg-transparent text-porch-tan text-xs font-medium border border-porch-tan/30 rounded px-2 py-1 focus:outline-none focus:border-crimson-500 appearance-none cursor-pointer pr-6"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D9CEBF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" }}
      >
        <option value="">Region...</option>
        {REGIONS.map((r) => (
          <option key={r.slug} value={r.slug}>
            {r.label}
          </option>
        ))}
      </select>
      {isFiltered && (
        <button
          onClick={() => navigate("all")}
          className="text-porch-tan/60 hover:text-white text-xs transition-colors"
          aria-label="Clear region filter"
        >
          &times;
        </button>
      )}
    </div>
  );
}
