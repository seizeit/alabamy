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
            const pill = navRef.current?.querySelector(
              `[data-slug="${entry.target.id}"]`
            );
            pill?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <nav
      ref={navRef}
      className="flex gap-2 overflow-x-auto py-2 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      {categories.map((cat) => (
        <a
          key={cat.slug}
          href={`#${cat.slug}`}
          data-slug={cat.slug}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-display font-medium transition-all shrink-0 ${
            active === cat.slug
              ? "bg-crimson-500 text-white shadow-sm"
              : "bg-warm-200 text-warm-800 hover:bg-warm-300"
          }`}
        >
          {cat.name}
        </a>
      ))}
    </nav>
  );
}
