"use client";

import { useEffect, useState } from "react";

type CategoryInfo = { name: string; slug: string };

const SHORT_NAMES: Record<string, string> = {
  "Politics & Government": "Politics",
  "Crime & Courts": "Crime",
  "Business & Economy": "Business",
  "Faith & Religion": "Faith",
  "Health & Science": "Health",
  "Military & Defense": "Military",
  "Culture & Life": "Culture",
  "Weather & Environment": "Weather",
  "Social & Community": "Social",
};

export default function CategoryNav({
  categories,
}: {
  categories: readonly CategoryInfo[];
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
      { rootMargin: "-60px 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-0.5 gap-y-0.5 py-1">
      {categories.map((cat) => {
        const label = SHORT_NAMES[cat.name] || cat.name;
        return (
          <a
            key={cat.slug}
            href={`#${cat.slug}`}
            data-slug={cat.slug}
            className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-display font-medium rounded transition-all ${
              active === cat.slug
                ? "bg-crimson-500 text-white"
                : "text-porch-tan/70 hover:bg-porch-tan/10 hover:text-white"
            }`}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
