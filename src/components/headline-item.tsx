import { HeadlineItem as HeadlineItemType } from "@/lib/queries";

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

export function HeadlineItem({
  headline,
  large = false,
}: {
  headline: HeadlineItemType;
  large?: boolean;
}) {
  const timestamp = relativeTime(headline.published_at ?? headline.fetched_at);

  return (
    <li>
      <a
        href={headline.url}
        target="_blank"
        rel="noopener"
        className="group block"
      >
        <span
          className={`leading-snug font-serif text-gray-900 group-hover:text-crimson-600 transition-colors ${
            large ? "text-lg sm:text-xl font-medium" : "text-[15px]"
          }`}
        >
          {headline.title}
        </span>
        {timestamp && (
          <span className="inline-block text-xs text-gray-400 ml-2">
            {timestamp}
          </span>
        )}
      </a>
    </li>
  );
}
