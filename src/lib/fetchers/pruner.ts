import { db } from "@/db";
import { headlines, sources } from "@/db/schema";
import { eq, sql, notInArray } from "drizzle-orm";

const MAX_HEADLINES_PER_SOURCE = 20;

export async function pruneHeadlines(): Promise<{ deletedCount: number }> {
  const allSources = await db.select({ id: sources.id }).from(sources);

  let deletedCount = 0;

  for (const source of allSources) {
    // Get the IDs of the top 20 most recent headlines for this source
    const keepRows = await db
      .select({ id: headlines.id })
      .from(headlines)
      .where(eq(headlines.source_id, source.id))
      .orderBy(sql`${headlines.fetched_at} DESC`)
      .limit(MAX_HEADLINES_PER_SOURCE);

    const keepIds = keepRows.map((r) => r.id);

    if (keepIds.length === 0) continue;

    // Delete all headlines for this source that are NOT in the keep list
    const result = await db
      .delete(headlines)
      .where(
        sql`${headlines.source_id} = ${source.id} AND ${headlines.id} NOT IN (${sql.join(keepIds.map((id) => sql`${id}`), sql`, `)})`
      );

    deletedCount += result.rowsAffected;
  }

  return { deletedCount };
}
