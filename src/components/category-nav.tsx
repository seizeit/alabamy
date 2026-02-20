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
  return (
    <nav className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
      {categories.map((cat) => (
        <a
          key={cat.slug}
          href={`#${cat.slug}`}
          className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium bg-cream-dark text-ink-secondary hover:bg-card-border transition-colors"
        >
          {cat.name}
        </a>
      ))}
    </nav>
  );
}
