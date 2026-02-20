"use client";

import { useRouter, useSearchParams } from "next/navigation";

const REGIONS = [
  { slug: "all", label: "Statewide" },
  { slug: "birmingham", label: "Birmingham" },
  { slug: "huntsville", label: "Huntsville" },
  { slug: "mobile", label: "Mobile" },
  { slug: "montgomery", label: "Montgomery" },
  { slug: "tuscaloosa", label: "Tuscaloosa" },
  { slug: "auburn", label: "Auburn" },
  { slug: "cullman", label: "Cullman" },
  { slug: "dothan", label: "Dothan" },
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

  return (
    <select
      value={activeGeo}
      onChange={(e) => navigate(e.target.value)}
      className="bg-white/10 text-white text-[10px] sm:text-[11px] font-display font-medium border-none rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-crimson-500 cursor-pointer"
    >
      {REGIONS.map((r) => (
        <option key={r.slug} value={r.slug}>
          {r.label}
        </option>
      ))}
    </select>
  );
}
