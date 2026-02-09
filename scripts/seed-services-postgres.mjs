#!/usr/bin/env node
/**
 * Seed the services table (PostgreSQL) for Packages/Cart to work.
 * Run: node scripts/seed-services-postgres.mjs
 * Requires: DATABASE_URL in .env
 */

import { config } from 'dotenv';
import postgres from 'postgres';

config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL || !DATABASE_URL.startsWith('postgresql://')) {
  console.error('DATABASE_URL (PostgreSQL) is required. Set it in .env');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { max: 1 });

const services = [
  // Individual - Resume
  { name: 'Entry Level Resume', description: 'Professional resume writing for entry-level positions and recent graduates', type: 'individual', category: 'Resume', tier: 'Entry Level', price: '125.00', originalPrice: null, features: '["ATS-optimized format","1-2 pages","Professional summary","Skills section","We work with you until you\'re 100% satisfied","2-5 business days delivery"]', active: 1, sortOrder: 1 },
  { name: 'Professional Resume', description: 'Comprehensive resume for mid-level professionals with 3-10 years experience', type: 'individual', category: 'Resume', tier: 'Professional', price: '185.00', originalPrice: null, features: '["ATS-optimized format","2-3 pages","Executive summary","Achievement-focused content","Skills & certifications","We work with you until you\'re 100% satisfied","2-5 business days delivery"]', active: 1, sortOrder: 2 },
  { name: 'Executive Resume', description: 'Premium resume for senior executives and C-level professionals', type: 'individual', category: 'Resume', tier: 'Executive', price: '355.00', originalPrice: null, features: '["ATS-optimized format","2-3 pages","Executive branding","Leadership achievements","Board experience highlight","We work with you until you\'re 100% satisfied","2-5 business days delivery"]', active: 1, sortOrder: 3 },
  // Individual - Cover Letter
  { name: 'Entry Level Cover Letter', description: 'Compelling cover letter for entry-level applications', type: 'individual', category: 'Cover Letter', tier: 'Entry Level', price: '55.00', originalPrice: null, features: '["Tailored to job description","1 page","Professional tone","We work with you until you\'re 100% satisfied","1-2 business days delivery"]', active: 1, sortOrder: 4 },
  { name: 'Professional Cover Letter', description: 'Strategic cover letter for professional positions', type: 'individual', category: 'Cover Letter', tier: 'Professional', price: '85.00', originalPrice: null, features: '["Customized to role","1 page","Achievement highlights","We work with you until you\'re 100% satisfied","1-2 business days delivery"]', active: 1, sortOrder: 5 },
  { name: 'Executive Cover Letter', description: 'Executive-level cover letter showcasing leadership', type: 'individual', category: 'Cover Letter', tier: 'Executive', price: '125.00', originalPrice: null, features: '["Executive positioning","1 page","Leadership narrative","We work with you until you\'re 100% satisfied","1-2 business days delivery"]', active: 1, sortOrder: 6 },
  // LinkedIn
  { name: 'LinkedIn Profile Optimisation', description: 'Complete LinkedIn profile makeover for maximum visibility', type: 'individual', category: 'LinkedIn', tier: 'Professional', price: '125.00', originalPrice: null, features: '["Keyword-optimized headline","Compelling summary","Experience section rewrite","Skills optimization","We work with you until you\'re 100% satisfied","2-5 business days delivery"]', active: 1, sortOrder: 7 },
  // Selection Criteria
  { name: 'Selection Criteria Response', description: 'Professional responses to government selection criteria using STAR method (up to 5 criteria)', type: 'individual', category: 'Selection Criteria', tier: 'Professional', price: '100.00', originalPrice: null, features: '["STAR/CAR method","Up to 5 criteria","Evidence-based responses","We work with you until you\'re 100% satisfied","2-5 business days delivery"]', active: 1, sortOrder: 8 },
  // Packages
  { name: 'Basic Package', description: 'Resume + Cover Letter for entry-level professionals', type: 'package', category: 'Package', tier: null, price: '155.00', originalPrice: '180.00', features: '["Entry Level Resume","Entry Level Cover Letter","ATS-optimised formatting","Delivered in Word & PDF","2-4 business days delivery","Save $25"]', active: 1, sortOrder: 20 },
  { name: 'Standard Package', description: 'Resume + Cover Letter + LinkedIn for professionals', type: 'package', category: 'Package', tier: null, price: '255.00', originalPrice: '395.00', features: '["Professional Resume","Professional Cover Letter","LinkedIn Profile Optimisation","ATS-optimised formatting","Delivered in Word & PDF","2-4 business days delivery","Save $140"]', active: 1, sortOrder: 21 },
  { name: 'Premium Package', description: 'Complete career package for executives', type: 'package', category: 'Package', tier: null, price: '355.00', originalPrice: '605.00', features: '["Executive Resume","Executive Cover Letter","LinkedIn Profile Optimisation","ATS-optimised formatting","Delivered in Word & PDF","1 day express turnaround","Save $250"]', active: 1, sortOrder: 22 },
  // Add-ons
  { name: 'Rush Delivery (24-48 hours)', description: 'Expedited delivery within 24-48 hours', type: 'addon', category: 'Add-on', tier: null, price: '50.00', originalPrice: null, features: '["Priority processing","24-48 hour turnaround","Applies to all items in order"]', active: 1, sortOrder: 30 },
  { name: 'Phone Consultation (30 min)', description: 'One-on-one career consultation with expert', type: 'addon', category: 'Add-on', tier: null, price: '75.00', originalPrice: null, features: '["30-minute phone call","Career strategy discussion","Interview preparation tips","Personalized advice"]', active: 1, sortOrder: 32 },
];

async function seed() {
  const existing = await sql`SELECT COUNT(*)::int as c FROM services`;
  const count = existing[0]?.c ?? 0;
  if (count > 0) {
    console.log(`Services table already has ${count} row(s). Skipping seed to avoid duplicates.`);
    console.log('To re-seed, truncate the table first (e.g. in Drizzle Studio or: TRUNCATE services RESTART IDENTITY CASCADE;)');
    await sql.end();
    return;
  }

  console.log('Seeding services...');
  for (const s of services) {
    await sql`
      INSERT INTO services (name, description, type, category, tier, price, "originalPrice", features, active, "sortOrder")
      VALUES (${s.name}, ${s.description}, ${s.type}, ${s.category}, ${s.tier}, ${s.price}, ${s.originalPrice}, ${s.features}, ${s.active}, ${s.sortOrder})
    `;
    console.log('  ✓', s.name);
  }
  console.log('\n✅ All services seeded. You can now use Packages and Add to Cart.');
  await sql.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
