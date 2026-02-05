# Neon Database Setup Guide

## Overview

This project uses **Neon** (serverless PostgreSQL) as the database. Neon provides a fully managed PostgreSQL database with automatic scaling and connection pooling.

## Connection String

Get your Neon database connection string from the [Neon Dashboard](https://console.neon.tech).

**⚠️ Never commit your actual connection string to git!**

Example format:
```
postgresql://user:password@host:port/database?sslmode=require&channel_binding=require
```

### Connection String Components

- **Protocol:** `postgresql://`
- **User:** Your database user (e.g., `neondb_owner`)
- **Password:** Your database password (get from Neon dashboard)
- **Host:** Your database host (e.g., `ep-xxx-pooler.ap-southeast-2.aws.neon.tech`)
- **Database:** Your database name (e.g., `neondb`)
- **SSL Mode:** `require` (required for Neon)
- **Channel Binding:** `require` (security feature)

### Important Notes

1. **Pooler Endpoint**: The connection string uses the `-pooler` endpoint, which is recommended for serverless environments like Vercel
2. **SSL Required**: Neon requires SSL connections (`sslmode=require`)
3. **Region**: Database is in `ap-southeast-2` (Asia Pacific - Sydney)

## Environment Variable

Set this in your Vercel project settings (use your actual connection string from Neon dashboard):

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require&channel_binding=require
```

## Running Migrations

After setting up the connection string, run migrations to create all tables:

```bash
pnpm db:push
```

This will:
1. Generate migration files from the schema
2. Apply migrations to your Neon database
3. Create all necessary tables and enums

### Services catalog (Packages page / Add to Cart)

The **Packages** page and **Add to Cart** need the `services` table to be **seeded**. After `pnpm db:push`, run:

```bash
node scripts/seed-services-postgres.mjs
```

Requires `DATABASE_URL` in `.env`. If you skip this, the Packages page will show "We couldn't load the full catalog" and only "Contact us to order" will be available.

## Database Schema

The project uses **Drizzle ORM** with PostgreSQL. Key features:

- **Auto-incrementing IDs**: Uses `serial()` for primary keys
- **Enums**: PostgreSQL enums for status fields
- **Timestamps**: Automatic `createdAt` and `updatedAt` fields
- **Relations**: Foreign keys for related tables

## Tables Created

The migration will create the following tables:

- `users` - User authentication and profiles
- `orders` - Order tracking
- `blog_posts` - Blog content
- `testimonials` - Client testimonials
- `services` - Service catalog
- `cart_items` - Shopping cart
- `contact_submissions` - Contact form submissions
- `case_studies` - Client success stories
- `email_subscribers` - Newsletter subscribers
- `client_intake_records` - Client intake forms
- And many more...

## Monitoring

You can monitor your Neon database:

1. **Neon Dashboard**: https://console.neon.tech
2. **Connection Pooling**: Monitor active connections
3. **Query Performance**: View slow queries and performance metrics
4. **Backups**: Automatic backups are enabled

## Troubleshooting

### Connection Timeout

- Ensure you're using the pooler endpoint (`-pooler` in hostname)
- Check SSL mode is set to `require`
- Verify connection string is correct

### Migration Errors

- Ensure `DATABASE_URL` is set correctly
- Check database permissions
- Verify schema file is correct

### SSL Errors

- Neon requires SSL - make sure `sslmode=require` is in connection string
- Some tools may need additional SSL configuration

## Security

- **Password**: Keep the connection string secure
- **Environment Variables**: Never commit connection strings to git
- **SSL**: Always use SSL connections (`sslmode=require`)
- **Connection Pooling**: Use pooler endpoint for better performance

## Performance Tips

1. **Use Pooler**: The pooler endpoint handles connection pooling automatically
2. **Indexes**: Drizzle will create indexes for unique and foreign key constraints
3. **Connection Limits**: Neon provides generous connection limits for serverless
4. **Query Optimization**: Monitor slow queries in Neon dashboard

## Backup and Restore

Neon provides:
- **Automatic Backups**: Point-in-time recovery
- **Branching**: Create database branches for testing
- **Restore**: Restore from any point in time

## Next Steps

1. ✅ Set `DATABASE_URL` in Vercel environment variables
2. ✅ Run `pnpm db:push` to create tables
3. ✅ Verify tables are created in Neon dashboard
4. ✅ Test database connection in your application
