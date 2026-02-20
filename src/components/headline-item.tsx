import { HeadlineItem as HeadlineItemType } from "@/lib/queries";

export function HeadlineItem({ headline }: { headline: HeadlineItemType }) {
  return (
    <li>
      <a href={headline.url} target="_blank" rel="noopener" className="group block">
        <span className="text-[15px] leading-snug font-serif text-ink group-hover:text-crimson transition-colors">
          {headline.title}
        </span>
      </a>
    </li>
  );
}
