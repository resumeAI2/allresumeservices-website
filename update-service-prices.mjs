/**
 * Script to update service prices in the database
 * Run with: pnpm tsx update-service-prices.mjs
 */

import { getDb } from './server/db.ts';
import { services } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const priceUpdates = [
  { name: 'Entry Level Resume', price: '125.00' },
  { name: 'Entry Level Cover Letter', price: '55.00' },
  { name: 'Professional Resume', price: '185.00' },
  { name: 'Professional Cover Letter', price: '85.00' },
  { name: 'Executive Resume', price: '355.00' },
  { name: 'Executive Cover Letter', price: '125.00' },
];

async function updatePrices() {
  const db = await getDb();
  if (!db) {
    console.error('Database connection failed');
    process.exit(1);
  }

  console.log('Updating service prices...\n');

  for (const update of priceUpdates) {
    try {
      const result = await db
        .update(services)
        .set({ 
          price: update.price,
          updatedAt: new Date()
        })
        .where(eq(services.name, update.name))
        .returning();

      if (result.length > 0) {
        console.log(`✓ Updated ${update.name}: $${update.price}`);
      } else {
        console.log(`⚠ Service not found: ${update.name}`);
      }
    } catch (error) {
      console.error(`✗ Error updating ${update.name}:`, error.message);
    }
  }

  console.log('\nPrice update complete!');
  process.exit(0);
}

updatePrices().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
