import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/db";
import { headlines, sourceTopics } from "@/db/schema";
import { isNull, eq } from "drizzle-orm";

const VALID_TOPICS = [
  "politics",
  "crime",
  "sports",
  "business",
  "education",
  "faith",
  "health",
  "military",
  "culture",
  "weather",
  "social",
] as const;

const VALID_TOPIC_SET = new Set<string>(VALID_TOPICS);

const CLASSIFICATION_PROMPT = `You are a news headline classifier for Alabama news. Classify each headline into exactly ONE topic.

Topics:
- politics: Government, legislature, elections, policy, governors, mayors, city councils
- crime: Crime, courts, police, arrests, trials, sentencing, law enforcement
- sports: All sports — college football (Alabama, Auburn), high school, pro teams, recruiting
- business: Economy, jobs, real estate, development, companies, startups, agriculture
- education: Schools, universities, K-12, school boards, higher education, students
- faith: Churches, religion, ministry, faith community events
- health: Healthcare, hospitals, medical research, public health, mental health, science
- military: Military bases, veterans, defense, National Guard, Redstone Arsenal
- culture: Arts, entertainment, music, food, festivals, history, lifestyle, human interest
- weather: Weather events, storms, tornadoes, flooding, environment, climate, outdoors
- social: Community events, nonprofits, volunteering, local gatherings, civic organizations

Respond with ONLY a JSON object mapping headline numbers to topic slugs. Example:
{"1":"sports","2":"crime","3":"politics"}

Headlines to classify:
`;

export async function classifyHeadlines(): Promise<{ classified: number; failed: number }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("ANTHROPIC_API_KEY not set, skipping classification");
    return { classified: 0, failed: 0 };
  }

  // Get unclassified headlines with source info
  const unclassified = await db
    .select({
      id: headlines.id,
      title: headlines.title,
      source_id: headlines.source_id,
    })
    .from(headlines)
    .where(isNull(headlines.topic));

  if (unclassified.length === 0) {
    return { classified: 0, failed: 0 };
  }

  // Build the numbered list for the prompt
  const headlineList = unclassified
    .map((h, i) => `${i + 1}. ${h.title}`)
    .join("\n");

  const client = new Anthropic({ apiKey });

  let parsed: Record<string, string> = {};
  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: CLASSIFICATION_PROMPT + headlineList,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    // Extract JSON from response (may be wrapped in markdown code block)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error("AI classification failed:", err);
    // Fall through to fallback logic below
  }

  // Build source -> primary topic fallback map
  const sourcePrimaryTopics = await db
    .select({
      source_id: sourceTopics.source_id,
      topic: sourceTopics.topic,
    })
    .from(sourceTopics)
    .where(eq(sourceTopics.is_primary, 1));

  const fallbackMap = new Map<number, string>();
  for (const row of sourcePrimaryTopics) {
    fallbackMap.set(row.source_id, row.topic);
  }

  const now = new Date().toISOString();
  let classified = 0;
  let failed = 0;

  for (let i = 0; i < unclassified.length; i++) {
    const h = unclassified[i];
    const aiTopic = parsed[String(i + 1)];
    const topic =
      aiTopic && VALID_TOPIC_SET.has(aiTopic)
        ? aiTopic
        : fallbackMap.get(h.source_id) || "culture"; // ultimate fallback

    try {
      await db
        .update(headlines)
        .set({ topic, classified_at: now })
        .where(eq(headlines.id, h.id));
      classified++;
    } catch {
      failed++;
    }
  }

  console.log(
    `Classified ${classified} headlines (${failed} failed, ${Object.keys(parsed).length} from AI, ${classified - Object.keys(parsed).length} fallback)`
  );
  return { classified, failed };
}
