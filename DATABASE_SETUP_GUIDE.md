# Database Setup Guide - Neon PostgreSQL

This guide will help you set up and migrate your Neon PostgreSQL database.

## Prerequisites

1. **Neon Account**: Sign up at [neon.tech](https://neon.tech) if you don't have one
2. **Neon Database**: Create a new database in the Neon dashboard
3. **Connection String**: Get your database connection string from the Neon dashboard

## Quick Start

### Step 1: Get Your Neon Connection String

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project (or create a new one)
3. Go to your database settings
4. Copy the connection string (use the **pooler** endpoint for serverless environments)

**Connection String Format:**
```
postgresql://user:password@ep-xxx-pooler.ap-southeast-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

**Important Notes:**
- Use the **pooler** endpoint (contains `-pooler` in the hostname) for better connection handling
- Always include `sslmode=require` (required by Neon)
- Include `channel_binding=require` for enhanced security

### Step 2: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Neon connection string:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require&channel_binding=require
   ```

   **⚠️ Never commit your `.env` file to git!** It's already in `.gitignore`.

### Step 3: Verify Database Connection

Run the setup script to check your connection:

```bash
pnpm db:setup
```

This will:
- ✅ Verify `DATABASE_URL` is set
- ✅ Test the database connection
- ✅ Check existing tables
- ✅ Check migration status
- ✅ Provide recommendations for next steps

### Step 4: Run Migrations

Once your connection is verified, apply the database schema:

```bash
pnpm db:push
```

This command will:
1. Push the schema from `drizzle/schema.ts` to your Neon database
2. Create all necessary tables, enums, and indexes
3. Set up the database structure

**Alternative Migration Commands:**

- `pnpm db:generate` - Generate migration files from schema changes
- `pnpm db:migrate` - Apply existing migration files
- `pnpm db:studio` - Open Drizzle Studio to view/edit database

## Using Neon MCP (Model Context Protocol)

If you have Neon MCP configured in Cursor, you can use it to:

1. **List Projects**: View your Neon projects
2. **Get Connection Strings**: Retrieve connection strings programmatically
3. **Create Databases**: Set up new databases
4. **Manage Branches**: Create database branches for testing

To use Neon MCP, ensure it's configured in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "neon": {
      "url": "https://mcp.neon.tech/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_NEON_API_TOKEN"
      }
    }
  }
}
```

Get your API token from: [Neon API Settings](https://console.neon.tech/app/settings/api-keys)

## Database Schema

The project uses **Drizzle ORM** with PostgreSQL. The schema is defined in `drizzle/schema.ts`.

### Key Tables

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

### Schema Features

- **Auto-incrementing IDs**: Uses `serial()` for primary keys
- **Enums**: PostgreSQL enums for status fields (e.g., `order_status`, `role`)
- **Timestamps**: Automatic `createdAt` and `updatedAt` fields
- **Relations**: Foreign keys for related tables
- **Indexes**: Automatic indexes for unique and foreign key constraints

## Troubleshooting

### Connection Timeout

**Problem**: Database connection times out

**Solutions**:
- Ensure you're using the pooler endpoint (`-pooler` in hostname)
- Check SSL mode is set to `require`
- Verify connection string is correct
- Check Neon dashboard to ensure database is active

### Migration Errors

**Problem**: Migrations fail to apply

**Solutions**:
- Ensure `DATABASE_URL` is set correctly in `.env`
- Check database permissions
- Verify schema file is correct
- Check for conflicting migrations

### SSL Errors

**Problem**: SSL connection errors

**Solutions**:
- Neon requires SSL - make sure `sslmode=require` is in connection string
- Some tools may need additional SSL configuration
- Try using the pooler endpoint instead of direct connection

### Schema Mismatch

**Problem**: Schema doesn't match expected structure

**Solutions**:
- Review `drizzle/schema.ts` for current schema definition
- Check migration files in `drizzle/` directory
- Use `pnpm db:studio` to inspect database structure
- Consider resetting database if in development (⚠️ **WARNING**: This deletes all data!)

## Monitoring

### Neon Dashboard

Monitor your database at: [Neon Console](https://console.neon.tech)

Features:
- **Connection Pooling**: Monitor active connections
- **Query Performance**: View slow queries and performance metrics
- **Backups**: Automatic backups are enabled
- **Branches**: Create database branches for testing
- **Metrics**: CPU, memory, and storage usage

### Health Check

The application includes a health check endpoint that monitors database status:

```bash
curl http://localhost:3000/api/trpc/health.check
```

## Backup and Restore

Neon provides automatic backups with point-in-time recovery:

1. **Automatic Backups**: Enabled by default
2. **Point-in-Time Recovery**: Restore from any point in time
3. **Branches**: Create database branches for testing without affecting production
4. **Manual Backups**: Use the backup service in `server/services/databaseBackup.ts`

## Performance Tips

1. **Use Pooler**: The pooler endpoint handles connection pooling automatically
2. **Indexes**: Drizzle creates indexes for unique and foreign key constraints
3. **Connection Limits**: Neon provides generous connection limits for serverless
4. **Query Optimization**: Monitor slow queries in Neon dashboard
5. **Connection Reuse**: The application reuses database connections efficiently

## Security Best Practices

- ✅ **Never commit** connection strings to git
- ✅ **Use SSL**: Always use `sslmode=require`
- ✅ **Use Pooler**: Use pooler endpoint for better security and performance
- ✅ **Rotate Credentials**: Regularly rotate database passwords
- ✅ **Environment Variables**: Store credentials in environment variables only
- ✅ **Least Privilege**: Use database users with minimal required permissions

## Next Steps

After setting up the database:

1. ✅ Verify connection with `pnpm db:setup`
2. ✅ Run migrations with `pnpm db:push`
3. ✅ Verify tables are created in Neon dashboard
4. ✅ Test database connection in your application
5. ✅ Set up monitoring and alerts in Neon dashboard
6. ✅ Configure backups and retention policies

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon Console](https://console.neon.tech)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Neon dashboard for database status
3. Check application logs for detailed error messages
4. Verify environment variables are set correctly
5. Test connection with `pnpm db:setup`
