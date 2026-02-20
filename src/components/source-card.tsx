import { SourceWithHeadlines } from "@/lib/queries";

export function SourceCard({ source }: { source: SourceWithHeadlines }) {
  return (
    <div className="bg-white rounded-lg border border-card-border p-5 hover:shadow-md transition-shadow">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-crimson mb-3">
        {source.name}
      </h3>
      <ul className="space-y-2">
        {source.headlines.map((headline) => (
          <li key={headline.id}>
            <span className="text-[15px] leading-snug text-ink">{headline.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
