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
    <section className="mb-10">
      <div className="border-b-2 border-crimson-500 pb-2 mb-5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-warm-950 tracking-tight">
          Top Stories
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lead story — large */}
        <a
          href={lead.url}
          target="_blank"
          rel="noopener"
          className="lg:col-span-2 group block bg-white rounded-xl border border-warm-300 p-6 hover:shadow-md transition-shadow"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-crimson-500">
            {lead.source_name}
          </span>
          <h3 className="font-serif text-xl sm:text-2xl leading-tight text-warm-950 group-hover:text-crimson-600 transition-colors mt-2">
            {lead.title}
          </h3>
          <span className="block text-xs text-warm-500 mt-2">
            {relativeTime(lead.published_at ?? lead.fetched_at)}
          </span>
        </a>

        {/* Secondary stories */}
        <div className="space-y-3">
          {rest.map((story) => (
            <a
              key={story.id}
              href={story.url}
              target="_blank"
              rel="noopener"
              className="group block bg-white rounded-xl border border-warm-300 p-4 hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-crimson-500">
                {story.source_name}
              </span>
              <h3 className="font-serif text-[15px] leading-snug text-warm-950 group-hover:text-crimson-600 transition-colors mt-1">
                {story.title}
              </h3>
              <span className="block text-xs text-warm-500 mt-1">
                {relativeTime(story.published_at ?? story.fetched_at)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
