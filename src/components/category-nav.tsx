"use client";

import { useEffect, useState, useRef } from "react";

type CategoryInfo = { name: string; slug: string };

export default function CategoryNav({
  categories,
}: {
  categories: CategoryInfo[];
}) {
  const [active, setActive] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);

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
            const tab = navRef.current?.querySelector(
              `[data-slug="${entry.target.id}"]`
            );
            tab?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
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
    <div
      ref={navRef as React.RefObject<HTMLDivElement>}
      className="flex gap-1 overflow-x-auto py-2 scrollbar-hide"
    >
      {categories.map((cat) => (
        <a
          key={cat.slug}
          href={`#${cat.slug}`}
          data-slug={cat.slug}
          className={`whitespace-nowrap px-3 py-1.5 text-sm font-display font-medium transition-all shrink-0 border-b-2 ${
            active === cat.slug
              ? "border-crimson-500 text-white"
              : "border-transparent text-porch-tan/70 hover:text-white hover:border-porch-tan/30"
          }`}
        >
          {cat.name}
        </a>
      ))}
    </div>
  );
}
