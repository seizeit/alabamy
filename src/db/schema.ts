import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const sources = sqliteTable("sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  url: text("url").notNull(),
  feed_url: text("feed_url"),
  feed_type: text("feed_type").notNull().default("rss"),
  category: text("category").notNull(),
  active: integer("active").notNull().default(1),
  last_fetched_at: text("last_fetched_at"),
  created_at: text("created_at").default(sql`(datetime('now'))`),
});

export const headlines = sqliteTable(
  "headlines",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    source_id: integer("source_id")
      .notNull()
      .references(() => sources.id),
    title: text("title").notNull(),
    url: text("url").notNull().unique(),
    published_at: text("published_at"),
    fetched_at: text("fetched_at").default(sql`(datetime('now'))`),
  },
  (table) => [
    index("idx_headlines_source").on(table.source_id, table.published_at),
    index("idx_headlines_fetched").on(table.fetched_at),
  ]
);

export const sourcesRelations = relations(sources, ({ many }) => ({
  headlines: many(headlines),
}));

export const headlinesRelations = relations(headlines, ({ one }) => ({
  source: one(sources, {
    fields: [headlines.source_id],
    references: [sources.id],
  }),
}));
