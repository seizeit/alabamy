import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/db";
import { headlines, sources, dailyBriefs } from "@/db/schema";
import { eq, and, gte, isNotNull, sql } from "drizzle-orm";
import { GEO_OPTIONS } from "@/lib/constants";
import { ALL_TOPICS } from "@/lib/queries";

const BRIEF_PROMPT = `You are the editor of Alabamy, a warm and trusted Alabama news digest. Write a 3-4 paragraph daily briefing summarizing today's top stories across the state.

Guidelines:
- Warm, conversational tone — like a knowledgeable friend catching someone up
- Mention specific source names when citing stories (e.g., "AL.com reports..." or "According to the Cullman Times...")
- Cover the most significant stories across different topics
- Keep it under 250 words
- No bullet points — flowing paragraphs only
- No greeting or sign-off, just the briefing content

Today's headlines by topic:
`;

function getTodayCT(): string {
  const now = new Date();
  const ct = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  return ct.toISOString().split("T")[0];
}

export async function generateDailyBriefs(): Promise<{
  generated: number;
  skipped: number;
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("ANTHROPIC_API_KEY not set, skipping brief generation");
    return { generated: 0, skipped: 0 };
  }

  const today = getTodayCT();
  const client = new Anthropic({ apiKey });
  let generated = 0;
  let skipped = 0;

  for (const geoOption of GEO_OPTIONS) {
    const geo = geoOption.slug;

    // Fetch today's classified headlines for this region
    const conditions = [
      isNotNull(headlines.topic),
      gte(headlines.fetched_at, today),
    ];

    if (geo !== "all") {
      conditions.push(eq(sources.geo, geo));
    }

    const rows = await db
      .select({
        title: headlines.title,
        topic: headlines.topic,
        source_name: sources.name,
      })
      .from(headlines)
      .innerJoin(sources, eq(headlines.source_id, sources.id))
      .where(and(...conditions));

    console.log(`[briefs] ${geo}: ${rows.length} headlines (today=${today})`);
    if (rows.length < 1) {
      skipped++;
      continue;
    }

    // Group by topic for the prompt
    const byTopic = new Map<string, string[]>();
    for (const row of rows) {
      const topic = row.topic!;
      if (!byTopic.has(topic)) byTopic.set(topic, []);
      byTopic.get(topic)!.push(`${row.title} (${row.source_name})`);
    }

    const topicSections = ALL_TOPICS.filter((t) => byTopic.has(t.slug))
      .map((t) => {
        const items = byTopic.get(t.slug)!;
        return `## ${t.name}\n${items.map((h) => `- ${h}`).join("\n")}`;
      })
      .join("\n\n");

    const regionLabel =
      geo === "all"
        ? "all of Alabama"
        : `the ${geoOption.label} region of Alabama`;

    try {
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `${BRIEF_PROMPT}${topicSections}\n\nWrite the briefing for ${regionLabel}.`,
          },
        ],
      });

      const summary =
        response.content[0].type === "text" ? response.content[0].text : "";

      if (summary) {
        await db
          .insert(dailyBriefs)
          .values({
            geo,
            date: today,
            summary,
            headline_count: rows.length,
            generated_at: new Date().toISOString(),
          })
          .onConflictDoUpdate({
            target: [dailyBriefs.geo, dailyBriefs.date],
            set: {
              summary,
              headline_count: rows.length,
              generated_at: new Date().toISOString(),
            },
          });
        generated++;
      } else {
        console.error(`[briefs] ${geo}: empty summary from API`);
        skipped++;
      }
    } catch (err) {
      console.error(`[briefs] ${geo} failed:`, err instanceof Error ? err.message : err);
      skipped++;
    }
  }

  console.log(
    `Generated ${generated} daily briefs (${skipped} skipped)`
  );
  return { generated, skipped };
}
