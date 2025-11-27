import { getDb } from "./db";
import { faq_search_analytics } from "../drizzle/schema";
import { desc, sql, eq } from "drizzle-orm";

interface LogSearchInput {
  query: string;
  resultsCount: number;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Log a FAQ search query to analytics
 */
export async function logFaqSearch(input: LogSearchInput) {
  const { query, resultsCount, userAgent, ipAddress } = input;
  
  // Only log non-empty queries
  if (!query.trim()) {
    return { success: false, message: "Empty query not logged" };
  }

  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };
  
  await db.insert(faq_search_analytics).values({
    query: query.trim(),
    resultsCount,
    userAgent: userAgent || null,
    ipAddress: ipAddress || null,
  });

  return { success: true };
}

/**
 * Get recent search analytics
 */
export async function getSearchAnalytics(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select()
    .from(faq_search_analytics)
    .orderBy(desc(faq_search_analytics.timestamp))
    .limit(limit);

  return results;
}

/**
 * Get top search queries with counts
 */
export async function getTopSearches(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select({
      query: faq_search_analytics.query,
      count: sql<number>`COUNT(*)`.as('count'),
      avgResults: sql<number>`AVG(${faq_search_analytics.resultsCount})`.as('avgResults'),
      lastSearched: sql<Date>`MAX(${faq_search_analytics.timestamp})`.as('lastSearched'),
    })
    .from(faq_search_analytics)
    .groupBy(faq_search_analytics.query)
    .orderBy(desc(sql`COUNT(*)`))
    .limit(limit);

  return results;
}

/**
 * Get searches that returned no results (potential content gaps)
 */
export async function getNoResultSearches() {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select({
      query: faq_search_analytics.query,
      count: sql<number>`COUNT(*)`.as('count'),
      lastSearched: sql<Date>`MAX(${faq_search_analytics.timestamp})`.as('lastSearched'),
    })
    .from(faq_search_analytics)
    .where(eq(faq_search_analytics.resultsCount, 0))
    .groupBy(faq_search_analytics.query)
    .orderBy(desc(sql`COUNT(*)`))
    .limit(20);

  return results;
}
