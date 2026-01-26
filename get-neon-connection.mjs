#!/usr/bin/env node
/**
 * Get Neon Database Connection String
 * 
 * This script uses the Neon API to retrieve connection strings for your databases.
 * It requires a Neon API token to be set in NEON_API_KEY environment variable.
 */

import { config } from 'dotenv';
import { writeFileSync, readFileSync, existsSync } from 'fs';

config();

const NEON_API_KEY = process.env.NEON_API_KEY || process.env.NEON_API_TOKEN;
const NEON_API_BASE = 'https://console.neon.tech/api/v2';

async function getProjects() {
  if (!NEON_API_KEY) {
    console.error('❌ ERROR: NEON_API_KEY or NEON_API_TOKEN environment variable is not set!');
    console.log('\n📝 To get your API key:');
    console.log('   1. Go to https://console.neon.tech/app/settings/api-keys');
    console.log('   2. Create a new API key');
    console.log('   3. Add it to your .env file: NEON_API_KEY=your_key_here\n');
    return null;
  }

  try {
    const response = await fetch(`${NEON_API_BASE}/projects`, {
      headers: {
        'Authorization': `Bearer ${NEON_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Authentication failed. Please check your NEON_API_KEY.');
        return null;
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('❌ Error fetching projects:', error.message);
    return null;
  }
}

async function getConnectionString(projectId, branchId = null) {
  if (!NEON_API_KEY) return null;

  try {
    // Get project endpoints
    const endpointsResponse = await fetch(`${NEON_API_BASE}/projects/${projectId}/endpoints`, {
      headers: {
        'Authorization': `Bearer ${NEON_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!endpointsResponse.ok) {
      throw new Error(`Failed to get endpoints: ${endpointsResponse.status}`);
    }

    const endpointsData = await endpointsResponse.json();
    const endpoints = endpointsData.endpoints || [];

    if (endpoints.length === 0) {
      console.error('❌ No endpoints found for this project.');
      return null;
    }

    // Use the first endpoint (or filter by branch if specified)
    const endpoint = branchId 
      ? endpoints.find(e => e.branch_id === branchId) || endpoints[0]
      : endpoints[0];

    // Get connection string - prefer pooler endpoint
    const poolerEndpoint = endpoint.host?.includes('pooler') 
      ? endpoint.host 
      : endpoint.host?.replace('.neon.tech', '-pooler.neon.tech');

    if (!endpoint.password || !endpoint.user || !endpoint.database_name) {
      console.error('❌ Incomplete endpoint information.');
      return null;
    }

    const connectionString = `postgresql://${endpoint.user}:${endpoint.password}@${poolerEndpoint || endpoint.host}/${endpoint.database_name}?sslmode=require&channel_binding=require`;
    
    return {
      connectionString,
      host: poolerEndpoint || endpoint.host,
      database: endpoint.database_name,
      user: endpoint.user,
      endpoint
    };
  } catch (error) {
    console.error('❌ Error getting connection string:', error.message);
    return null;
  }
}

async function main() {
  console.log('🔍 Fetching Neon projects...\n');

  const projects = await getProjects();
  
  if (!projects || projects.length === 0) {
    console.log('💡 Alternative: Get your connection string manually from:');
    console.log('   https://console.neon.tech\n');
    console.log('   Then update your .env file with:');
    console.log('   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require\n');
    return;
  }

  console.log(`✓ Found ${projects.length} project(s):\n`);
  
  projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project.name || project.id}`);
    console.log(`   ID: ${project.id}`);
    console.log(`   Region: ${project.region_id || 'N/A'}`);
    console.log('');
  });

  // Use the first project (or you could add interactive selection)
  const selectedProject = projects[0];
  console.log(`📡 Getting connection string for: ${selectedProject.name || selectedProject.id}\n`);

  const connectionInfo = await getConnectionString(selectedProject.id);
  
  if (!connectionInfo) {
    console.log('❌ Could not retrieve connection string.');
    console.log('💡 Please get it manually from the Neon dashboard.\n');
    return;
  }

  console.log('✅ Connection string retrieved!\n');
  console.log('📋 Connection Details:');
  console.log(`   Host: ${connectionInfo.host}`);
  console.log(`   Database: ${connectionInfo.database}`);
  console.log(`   User: ${connectionInfo.user}\n`);

  // Update .env file
  const envPath = '.env';
  if (existsSync(envPath)) {
    let envContent = readFileSync(envPath, 'utf-8');
    
    // Update or add DATABASE_URL
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL=${connectionInfo.connectionString}`
      );
    } else {
      envContent = `DATABASE_URL=${connectionInfo.connectionString}\n${envContent}`;
    }
    
    writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with connection string!\n');
  } else {
    console.log('📝 Add this to your .env file:');
    console.log(`DATABASE_URL=${connectionInfo.connectionString}\n`);
  }

  console.log('🚀 Next step: Run "pnpm db:setup" to verify the connection.\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
