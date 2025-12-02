import { getDb } from './db';
import { case_studies } from '../drizzle/schema';
import { eq, desc, and } from 'drizzle-orm';

export interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  category: string;
  clientName: string;
  challenge: string;
  solution: string;
  result: string;
  testimonialQuote: string | null;
  image: string | null;
  published: number;
  featured: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllCaseStudies(publishedOnly: boolean = true) {
  const db = await getDb();
  if (!db) return [];
  
  const query = publishedOnly
    ? db.select().from(case_studies).where(eq(case_studies.published, 1)).orderBy(desc(case_studies.createdAt))
    : db.select().from(case_studies).orderBy(desc(case_studies.createdAt));
  
  return await query;
}

export async function getCaseStudyBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  
  const studies = await db.select().from(case_studies).where(eq(case_studies.slug, slug)).limit(1);
  return studies[0] || null;
}

export async function getCaseStudyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const studies = await db.select().from(case_studies).where(eq(case_studies.id, id)).limit(1);
  return studies[0] || null;
}

export async function getFeaturedCaseStudies(limit: number = 3) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(case_studies)
    .where(and(eq(case_studies.published, 1), eq(case_studies.featured, 1)))
    .orderBy(desc(case_studies.createdAt))
    .limit(limit);
}

export async function createCaseStudy(study: Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.insert(case_studies).values({
    ...study,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
}

export async function updateCaseStudy(id: number, study: Partial<Omit<CaseStudy, 'id' | 'createdAt'>>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.update(case_studies)
    .set({
      ...study,
      updatedAt: new Date(),
    })
    .where(eq(case_studies.id, id));
  return result;
}

export async function deleteCaseStudy(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.delete(case_studies).where(eq(case_studies.id, id));
  return result;
}

export async function incrementCaseStudyViewCount(slug: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const { sql } = await import('drizzle-orm');
  await db.update(case_studies)
    .set({ viewCount: sql`${case_studies.viewCount} + 1` })
    .where(eq(case_studies.slug, slug));
  
  return { success: true };
}
