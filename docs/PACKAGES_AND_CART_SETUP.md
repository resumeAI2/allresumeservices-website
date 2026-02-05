# Packages & Cart Setup

## Why "No services found" or packages don’t add to cart?

The **Packages** page (`/packages`) and **Add to Cart** depend on the **`services`** table in your PostgreSQL database. If that table is empty, you’ll see **"No services found"** (or the new empty-state message) and nothing can be added to the cart.

## Fix: Seed the services table

1. **Ensure `DATABASE_URL` is set** in `.env` (your Neon or other PostgreSQL connection string).

2. **Run the seed script** (only needed once, or when the table is empty):

   ```bash
   pnpm db:seed-services
   ```

   Or:

   ```bash
   node scripts/seed-services-postgres.mjs
   ```

3. **What the seed does**
   - Inserts individual services (resumes, cover letters, LinkedIn, selection criteria) with current prices.
   - Inserts the three packages (Basic, Standard, Premium) and add-ons (Rush Delivery, Phone Consultation).
   - If the table already has rows, the script skips inserting (to avoid duplicates).

4. **To re-seed from scratch**  
   Truncate the table first (e.g. in Drizzle Studio or Neon SQL Editor):

   ```sql
   TRUNCATE services RESTART IDENTITY CASCADE;
   ```

   Then run `pnpm db:seed-services` again.

After the seed runs successfully, refresh `/packages` and you should see all services and packages with working **Add to Cart** and cart/checkout.
