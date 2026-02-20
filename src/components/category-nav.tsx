"use client";

import { useEffect, useState } from "react";

const categories = [
  { name: "Statewide", slug: "statewide" },
  { name: "Birmingham", slug: "birmingham" },
  { name: "Huntsville", slug: "huntsville" },
  { name: "Mobile", slug: "mobile" },
  { name: "Montgomery", slug: "montgomery" },
  { name: "Tuscaloosa", slug: "tuscaloosa" },
  { name: "Auburn", slug: "auburn" },
  { name: "Sports", slug: "sports" },
  { name: "Government", slug: "government" },
  { name: "Public Radio", slug: "public-radio" },
];

export default function CategoryNav() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
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
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
      {categories.map((cat) => (
        <a
          key={cat.slug}
          href={`#${cat.slug}`}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === cat.slug
              ? "bg-crimson text-white"
              : "bg-cream-dark text-ink-secondary hover:bg-card-border"
          }`}
        >
          {cat.name}
        </a>
      ))}
    </nav>
  );
}
