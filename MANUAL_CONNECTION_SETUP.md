# Manual Connection String Setup

Since the automated script is encountering API issues, here's how to get your connection string manually:

## Step 1: Get Connection String from Neon Dashboard

1. **Go to Neon Console**: https://console.neon.tech
2. **Log in** to your account
3. **Select your project** (or create one if you don't have one)
4. **Navigate to Connection Details**:
   - Click on your project
   - Look for "Connection Details" or "Connection String" section
   - You may find it in the project dashboard or settings

5. **Copy the Pooler Connection String**:
   - Look for the connection string that contains `-pooler` in the hostname
   - It should look like: `postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require`
   - **Important**: Use the pooler endpoint (not the direct connection)

## Step 2: Update .env File

1. Open the `.env` file in your project root
2. Find the line that says:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require&channel_binding=require
   ```

3. Replace it with your actual connection string:
   ```env
   DATABASE_URL=postgresql://your_user:your_password@ep-xxx-pooler.region.aws.neon.tech/your_database?sslmode=require&channel_binding=require
   ```

4. **Save the file**

## Step 3: Verify Connection

Run the setup script to verify:

```bash
pnpm db:setup
```

This will:
- ✅ Check if DATABASE_URL is set
- ✅ Test the database connection
- ✅ Show existing tables
- ✅ Display migration status

## Step 4: Run Migrations

Once connection is verified:

```bash
pnpm db:push
```

This will create all necessary tables in your database.

## Connection String Format

Your connection string should follow this format:

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require&channel_binding=require
```

**Key Components:**
- `[user]` - Your database username (usually something like `neondb_owner`)
- `[password]` - Your database password
- `[host]` - Should contain `-pooler` (e.g., `ep-xxx-pooler.ap-southeast-2.aws.neon.tech`)
- `[database]` - Your database name (e.g., `neondb`)
- `sslmode=require` - Required for Neon
- `channel_binding=require` - Security feature (optional but recommended)

## Troubleshooting

### Can't find connection string in dashboard?
- Look in the project's "Settings" or "Connection" tab
- Check the "Connection Details" section
- Some projects show it in the main dashboard

### Connection string doesn't have -pooler?
- You can manually add `-pooler` before `.neon.tech` in the hostname
- Example: `ep-xxx.neon.tech` → `ep-xxx-pooler.neon.tech`

### Still having issues?
- Make sure you're copying the entire connection string
- Verify there are no extra spaces
- Check that `sslmode=require` is included
- Ensure the database is active in the Neon dashboard

## Quick Reference

1. Get connection string from: https://console.neon.tech
2. Update `.env` file with `DATABASE_URL=...`
3. Run `pnpm db:setup` to verify
4. Run `pnpm db:push` to migrate
