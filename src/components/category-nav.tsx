"use client";

import { useEffect, useState } from "react";

type CategoryInfo = { name: string; slug: string };

// Short labels that fit in compact tabs
const SHORT_NAMES: Record<string, string> = {
  "Politics & Government": "Politics",
  "Crime & Courts": "Crime",
  "Business & Economy": "Business",
  "Faith & Religion": "Faith",
  "Health & Science": "Health",
  "Military & Defense": "Military",
  "Culture & Life": "Culture",
  "Weather & Environment": "Weather",
};

export default function CategoryNav({
  categories,
}: {
  categories: CategoryInfo[];
}) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (categories.length === 0) return;

    const sections = categories
      .map((cat) => document.getElementById(cat.slug))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 py-2">
      {categories.map((cat) => {
        const label = SHORT_NAMES[cat.name] || cat.name;
        return (
          <a
            key={cat.slug}
            href={`#${cat.slug}`}
            data-slug={cat.slug}
            className={`px-2.5 py-1 text-[11px] sm:text-xs font-display font-medium rounded transition-all ${
              active === cat.slug
                ? "bg-crimson-500 text-white"
                : "bg-porch-tan/10 text-porch-tan/80 hover:bg-porch-tan/20 hover:text-white"
            }`}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
