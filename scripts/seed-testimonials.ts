/**
 * Seed the testimonials table from scraped_testimonials.json (Postgres/Drizzle).
 * Use when the DB was reset or testimonials are empty.
 *
 * Usage:
 *   pnpm exec tsx scripts/seed-testimonials.ts          # Insert all (no delete)
 *   pnpm exec tsx scripts/seed-testimonials.ts --clear  # Delete existing then insert
 *
 * Requires: DATABASE_URL in .env and scraped_testimonials.json in project root.
 */

import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getDb } from "../server/db";
import { testimonials } from "../drizzle/schema";

const BATCH_SIZE = 50;
const FEATURED_COUNT = 6; // First N inserted are featured on homepage

type ScrapedItem = { name: string; testimonial: string; date?: string };

function inferServiceUsed(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("cover letter") && lower.includes("linkedin")) return "Resume, Cover Letter & LinkedIn";
  if (lower.includes("linkedin")) return "LinkedIn Profile";
  if (lower.includes("cover letter")) return "Resume & Cover Letter";
  if (lower.includes("selection criteria")) return "Selection Criteria";
  return "Resume Writing";
}

function deduplicate(items: ScrapedItem[]): ScrapedItem[] {
  const seen = new Set<string>();
  return items.filter((t) => {
    const key = `${t.name}-${(t.testimonial || "").substring(0, 50)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  const clearFirst = process.argv.includes("--clear");

  const jsonPath = resolve(process.cwd(), "scraped_testimonials.json");
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(jsonPath, "utf-8"));
  } catch (err) {
    console.error("Failed to read scraped_testimonials.json:", err);
    process.exit(1);
  }

  if (!Array.isArray(raw)) {
    console.error("scraped_testimonials.json must be a JSON array of { name, testimonial }");
    process.exit(1);
  }

  const scraped = raw as ScrapedItem[];
  const unique = deduplicate(scraped);
  console.log(`Loaded ${scraped.length} testimonials, ${unique.length} unique after dedup.`);

  const db = await getDb();
  if (!db) {
    console.error("Database not available. Set DATABASE_URL in .env.");
    process.exit(1);
  }

  if (clearFirst) {
    await db.delete(testimonials);
    console.log("Cleared existing testimonials.");
  } else {
    const existing = await db.select({ id: testimonials.id }).from(testimonials).limit(1);
    if (existing.length > 0) {
      console.log("Table already has testimonials. Use --clear to replace, or run without --clear to skip.");
      process.exit(0);
    }
  }

  let inserted = 0;
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    const values = batch.map((t, batchIndex) => {
      const globalIndex = i + batchIndex;
      return {
        clientName: (t.name || "Client").slice(0, 255),
        clientTitle: null,
        clientPhoto: null,
        rating: 5,
        testimonialText: t.testimonial || "",
        serviceUsed: inferServiceUsed(t.testimonial || "").slice(0, 100),
        approved: 1,
        featured: globalIndex < FEATURED_COUNT ? 1 : 0,
      };
    });
    await db.insert(testimonials).values(values);
    inserted += values.length;
    console.log(`Inserted ${inserted}/${unique.length} testimonials.`);
  }

  console.log(`Done. Inserted ${inserted} testimonials (first ${FEATURED_COUNT} featured).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
