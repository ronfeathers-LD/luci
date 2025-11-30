#!/usr/bin/env node

/**
 * Production to Local Database Sync Script for LUCI
 * Copies data from production Supabase to local Supabase instance
 */

const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logInfo(message) {
  log(`[INFO] ${message}`, 'green');
}

function logWarning(message) {
  log(`[WARNING] ${message}`, 'yellow');
}

function logError(message) {
  log(`[ERROR] ${message}`, 'red');
}

function logHeader(message) {
  log(`[SYNC] ${message}`, 'blue');
}

// Load environment variables for production config
// Try to load from .env.local.backup if it exists
function loadEnvFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const envVars = {};
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          }
        }
      });
      return envVars;
    }
  } catch (error) {
    // Ignore errors - file might not exist
  }
  return {};
}

// Load from .env.local.backup or use environment variables
const envBackup = loadEnvFile(path.join(process.cwd(), '.env.local.backup'));

// Production Supabase config - reads from .env.local.backup or environment variables
const PROD_CONFIG = {
  url: envBackup.PROD_SUPABASE_URL || envBackup.SUPABASE_URL || process.env.PROD_SUPABASE_URL || process.env.SUPABASE_URL || '',
  serviceRoleKey: envBackup.PROD_SUPABASE_SERVICE_ROLE_KEY || envBackup.SUPABASE_SERVICE_ROLE_KEY || process.env.PROD_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
};

// Local Supabase config
const LOCAL_CONFIG = {
  host: '127.0.0.1',
  port: 54332,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres'
};

// Tables to sync (in order - respecting foreign key dependencies)
// Order matters: parent tables must come before child tables
const TABLES_TO_SYNC = [
  // Core user tables
  'users',
  
  // Configuration tables (independent)
  'salesforce_configs',
  'avoma_configs',
  'linkedin_configs',
  
  // Roles system (users must exist first)
  'roles',
  'user_roles',
  
  // Accounts (depends on users for owner_id potentially)
  'accounts',
  'user_accounts',
  
  // Account-related data (depends on accounts)
  'transcriptions',
  'cases',
  'contacts',
  'sentiment_history',
  'linkedin_profiles',
  'calendar_event_account_matches',
  
  // User-specific data (depends on users)
  'google_calendar_tokens',
  'google_calendar_events',
  'user_logins',
  
  // System settings (independent)
  'system_settings'
];

// Tables to skip (system tables, etc.)
const TABLES_TO_SKIP = [
  'schema_migrations',
  'supabase_functions',
  'supabase_migrations'
];

/**
 * Connect to local PostgreSQL database
 */
async function connectToLocal() {
  const client = new Client(LOCAL_CONFIG);
  try {
    await client.connect();
    logInfo('Connected to local Supabase database');
    return client;
  } catch (error) {
    logError(`Failed to connect to local database: ${error.message}`);
    throw error;
  }
}

/**
 * Get Supabase client for production
 */
function getProdSupabase() {
  if (!PROD_CONFIG.url || !PROD_CONFIG.serviceRoleKey) {
    logError('Production Supabase credentials not found!');
    logInfo('Please create .env.local.backup with:');
    logInfo('  PROD_SUPABASE_URL=https://your-project.supabase.co');
    logInfo('  PROD_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    logInfo('');
    logInfo('Or set them as environment variables before running this script.');
    process.exit(1);
  }
  
  return createClient(PROD_CONFIG.url, PROD_CONFIG.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Get all rows from a table in production
 */
async function getProdTableData(supabase, tableName) {
  try {
    logInfo(`Fetching ${tableName} from production...`);
    
    // Use select with no limit to get all rows
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) {
      // Table might not exist or might be empty - that's okay
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        logWarning(`Table ${tableName} not found or empty in production`);
        return [];
      }
      throw error;
    }
    
    logInfo(`Fetched ${data?.length || 0} rows from ${tableName}`);
    return data || [];
  } catch (error) {
    logError(`Error fetching ${tableName}: ${error.message}`);
    return [];
  }
}

/**
 * Clear table in local database
 */
async function clearLocalTable(client, tableName) {
  try {
    logInfo(`Clearing local ${tableName} table...`);
    await client.query(`TRUNCATE TABLE ${tableName} CASCADE`);
    logInfo(`Cleared ${tableName}`);
  } catch (error) {
    logWarning(`Could not clear ${tableName}: ${error.message}`);
    // Continue anyway - might not exist yet
  }
}

/**
 * Insert data into local table
 */
async function insertLocalData(client, tableName, rows) {
  if (!rows || rows.length === 0) {
    logInfo(`No data to insert into ${tableName}`);
    return 0;
  }

  try {
    logInfo(`Inserting ${rows.length} rows into local ${tableName}...`);
    
    // Get column names from first row
    const columns = Object.keys(rows[0]);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const columnNames = columns.join(', ');
    
    // Build insert query
    const query = `INSERT INTO ${tableName} (${columnNames}) VALUES ${rows.map((_, i) => 
      `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`
    ).join(', ')} ON CONFLICT DO NOTHING`;
    
    // Flatten values array
    const values = rows.flatMap(row => columns.map(col => row[col]));
    
    const result = await client.query(query, values);
    logInfo(`Inserted ${rows.length} rows into ${tableName}`);
    return rows.length;
  } catch (error) {
    logError(`Error inserting into ${tableName}: ${error.message}`);
    // Try row-by-row as fallback
    logInfo(`Trying row-by-row insert for ${tableName}...`);
    let successCount = 0;
    for (const row of rows) {
      try {
        const columns = Object.keys(row);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const values = columns.map(col => row[col]);
        const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
        await client.query(query, values);
        successCount++;
      } catch (rowError) {
        logWarning(`Skipped row in ${tableName}: ${rowError.message}`);
      }
    }
    logInfo(`Inserted ${successCount}/${rows.length} rows into ${tableName}`);
    return successCount;
  }
}

/**
 * Sync a single table
 */
async function syncTable(supabase, client, tableName) {
  logHeader(`Syncing ${tableName}...`);
  
  try {
    // Get data from production
    const prodData = await getProdTableData(supabase, tableName);
    
    if (prodData.length === 0) {
      logInfo(`No data to sync for ${tableName}`);
      return 0;
    }
    
    // Clear local table
    await clearLocalTable(client, tableName);
    
    // Insert into local
    const inserted = await insertLocalData(client, tableName, prodData);
    
    return inserted;
  } catch (error) {
    logError(`Error syncing ${tableName}: ${error.message}`);
    return 0;
  }
}

/**
 * Main sync function
 */
async function syncAll() {
  logHeader('Starting production to local sync...');
  
  // Connect to databases
  const supabase = getProdSupabase();
  const client = await connectToLocal();
  
  try {
    let totalSynced = 0;
    
    // Sync each table
    for (const tableName of TABLES_TO_SYNC) {
      const count = await syncTable(supabase, client, tableName);
      totalSynced += count;
      log(''); // Empty line for readability
    }
    
    logHeader(`Sync complete! Synced ${totalSynced} total rows.`);
    logInfo('Local database is now synced with production data.');
    
  } catch (error) {
    logError(`Sync failed: ${error.message}`);
    throw error;
  } finally {
    await client.end();
    logInfo('Disconnected from local database');
  }
}

// Run sync
if (require.main === module) {
  syncAll()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      logError(`Fatal error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { syncAll, syncTable };

