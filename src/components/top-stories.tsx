import { TopStory } from "@/lib/queries";

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "";
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "yesterday";
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TopStories({ stories }: { stories: TopStory[] }) {
  if (stories.length === 0) return null;

  const [lead, ...rest] = stories;

  return (
    <section className="mb-12 pb-12 border-b border-dashed border-porch-tan">
      <h2 className="font-display text-xs uppercase tracking-[0.2em] text-porch-brown mb-6">
        Today&apos;s Lead
      </h2>

      {/* Lead story */}
      <a
        href={lead.url}
        target="_blank"
        rel="noopener"
        className="group block mb-8"
      >
        <span className="text-xs font-sans font-semibold uppercase tracking-wider text-crimson-500">
          {lead.source_name}
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl lg:text-[2.25rem] leading-tight font-medium text-warm-900 group-hover:text-crimson-600 transition-colors mt-2">
          {lead.title}
        </h3>
        <span className="block text-sm text-porch-brown mt-2">
          {relativeTime(lead.published_at ?? lead.fetched_at)}
        </span>
      </a>

      {/* Supporting stories — two column on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
        {rest.map((story) => (
          <a
            key={story.id}
            href={story.url}
            target="_blank"
            rel="noopener"
            className="group block"
          >
            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-crimson-500">
              {story.source_name}
            </span>
            <h3 className="font-serif text-lg leading-snug font-medium text-warm-900 group-hover:text-crimson-600 transition-colors mt-1">
              {story.title}
            </h3>
            <span className="block text-xs text-porch-brown mt-1">
              {relativeTime(story.published_at ?? story.fetched_at)}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
