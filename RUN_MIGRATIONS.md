# Run Database Migrations

## ✅ Connection Verified!

Your database connection has been successfully verified. The connection string is correctly set in your `.env` file.

## 🚀 Next Step: Run Migrations

To complete the database setup, you need to run the migrations in your terminal (outside of Cursor's sandbox environment).

### Option 1: Using pnpm (Recommended)

Open PowerShell or Command Prompt in the project directory and run:

```bash
pnpm db:push
```

### Option 2: Using npm

If pnpm is not available, use npm:

```bash
npm run db:push
```

### Option 3: Using drizzle-kit directly

```bash
npx drizzle-kit push
```

## What This Will Do

The migration command will:
1. ✅ Read your schema from `drizzle/schema.ts`
2. ✅ Connect to your Neon database
3. ✅ Create all necessary tables, enums, and indexes
4. ✅ Set up the complete database structure

## Expected Output

You should see output similar to:

```
✓ Pushing schema to database...
✓ Tables created successfully
✓ Migration complete
```

## Verify Migration

After running migrations, you can:

1. **Check in Neon Dashboard**: https://console.neon.tech
   - Go to your project
   - Check the "Tables" section to see all created tables

2. **Run verification again**:
   ```bash
   pnpm db:setup
   ```
   This will show you all the tables that were created.

## Tables That Will Be Created

Based on your schema, the following tables will be created:
- `users` - User authentication and profiles
- `orders` - Order tracking and payments
- `blog_posts` - Blog content management
- `testimonials` - Client testimonials
- `services` - Service catalog
- `cart_items` - Shopping cart
- `contact_submissions` - Contact form submissions
- `case_studies` - Client success stories
- `email_subscribers` - Newsletter subscribers
- `client_intake_records` - Client intake forms
- And more...

## Troubleshooting

### "pnpm not found"
- Install pnpm: `npm install -g pnpm`
- Or use npm: `npm run db:push`

### "Connection failed"
- Verify DATABASE_URL is correct in `.env`
- Check Neon dashboard to ensure database is active
- Ensure connection string includes `sslmode=require`

### "Permission denied"
- Make sure you're running the command in your own terminal (not in Cursor's sandbox)
- Check that you have write permissions in the project directory

## Current Status

- ✅ Connection string: Set and verified
- ✅ Database connection: Successful
- ⏳ Migrations: Ready to run
- ⏳ Tables: Will be created after migration

## Quick Command Reference

```bash
# Verify connection
pnpm db:setup

# Run migrations
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Generate new migrations
pnpm db:generate

# Apply existing migrations
pnpm db:migrate
```

---

**Ready to proceed?** Open your terminal, navigate to the project directory, and run `pnpm db:push`!
