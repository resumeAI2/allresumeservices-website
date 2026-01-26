# Database Setup Instructions

Your Neon API key has been added to `.env`. Here's how to complete the setup:

## Step 1: Get Connection String

You have two options:

### Option A: Use the PowerShell Script (Recommended)

Run this command in PowerShell from the project directory:

```powershell
powershell -ExecutionPolicy Bypass -File get-neon-connection.ps1
```

This will:
- Fetch your Neon projects
- Get the connection string for the first project
- Automatically update your `.env` file

### Option B: Manual Setup

1. Go to https://console.neon.tech
2. Select your project
3. Go to "Connection Details" or find the connection string
4. Copy the **pooler** connection string (should contain `-pooler` in the hostname)
5. Update your `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require
   ```

## Step 2: Verify Connection

Once `DATABASE_URL` is set in `.env`, run:

```bash
pnpm db:setup
```

This will:
- ✅ Verify the connection string is set
- ✅ Test the database connection
- ✅ Show existing tables
- ✅ Display migration status

## Step 3: Run Migrations

After verifying the connection, apply the database schema:

```bash
pnpm db:push
```

This will create all necessary tables, enums, and indexes in your Neon database.

## Troubleshooting

### If the PowerShell script fails:

1. **Check your API key**: Make sure `NEON_API_KEY` is correct in `.env`
2. **Try manual setup**: Use Option B above
3. **Check network**: Ensure you can access https://console.neon.tech

### If connection fails:

1. **Verify connection string format**: Must start with `postgresql://`
2. **Check SSL mode**: Must include `sslmode=require`
3. **Use pooler endpoint**: Should contain `-pooler` in hostname
4. **Check Neon dashboard**: Ensure database is active

## Current Status

✅ Neon API key added to `.env`  
⏳ Waiting for connection string  
⏳ Database connection not yet verified  
⏳ Migrations not yet run  

## Next Steps

1. Run `get-neon-connection.ps1` or manually add `DATABASE_URL` to `.env`
2. Run `pnpm db:setup` to verify
3. Run `pnpm db:push` to migrate

## Files Created

- `setup-database.mjs` - Database setup verification script
- `get-neon-connection.mjs` - Node.js script to fetch connection string
- `get-neon-connection.ps1` - PowerShell script to fetch connection string
- `.env` - Environment file (with API key, needs DATABASE_URL)
- `DATABASE_SETUP_GUIDE.md` - Detailed documentation
- `QUICK_START.md` - Quick reference guide
