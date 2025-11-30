/**
 * Next.js App Router API Route for System Settings Management
 * 
 * Handles:
 * - GET /api/system-settings - Get all system settings or filter by category
 * - GET /api/system-settings?integrationStatus=true - Get integration status
 * - GET /api/system-settings?integrationConfigs=true - Get all integration configs
 * - GET /api/system-settings?integrationConfigs=true&type=X - Get specific integration config
 * - PUT /api/system-settings - Update system settings
 * - POST /api/system-settings - Update integration config or test integration
 * Uses Supabase for data persistence
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabase-server';
import { handlePreflight, sendErrorResponse, sendSuccessResponse, validateSupabase, logError, isProduction } from '../../../lib/next-api-helpers';

/**
 * Get all settings organized by category
 */
async function getAllSettings(supabase) {
  const { data: settings, error } = await supabase
    .from('system_settings')
    .select('*')
    .order('category', { ascending: true })
    .order('setting_key', { ascending: true });

  if (error) {
    logError('Error fetching system settings:', error);
    throw error;
  }

  // Organize by category
  const organized = {};
  (settings || []).forEach(setting => {
    if (!organized[setting.category]) {
      organized[setting.category] = {};
    }
    organized[setting.category][setting.setting_key] = {
      id: setting.id,
      value: setting.setting_value,
      description: setting.description,
      updated_at: setting.updated_at,
      updated_by: setting.updated_by,
    };
  });

  return organized;
}

/**
 * Get settings for a specific category
 */
async function getSettingsByCategory(supabase, category) {
  const { data: settings, error } = await supabase
    .from('system_settings')
    .select('*')
    .eq('category', category)
    .order('setting_key', { ascending: true });

  if (error) {
    logError('Error fetching system settings by category:', error);
    throw error;
  }

  const organized = {};
  (settings || []).forEach(setting => {
    organized[setting.setting_key] = {
      id: setting.id,
      value: setting.setting_value,
      description: setting.description,
      updated_at: setting.updated_at,
      updated_by: setting.updated_by,
    };
  });

  return organized;
}

/**
 * Update a system setting
 */
async function updateSetting(supabase, category, settingKey, value, userId) {
  // Check if setting exists
  const { data: existing, error: fetchError } = await supabase
    .from('system_settings')
    .select('id')
    .eq('category', category)
    .eq('setting_key', settingKey)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    logError('Error checking existing setting:', fetchError);
    throw fetchError;
  }

  // Convert value to appropriate JSON type
  let jsonValue;
  if (typeof value === 'string') {
    // Try to parse as number or boolean, otherwise keep as string
    if (value === 'true') jsonValue = true;
    else if (value === 'false') jsonValue = false;
    else if (!isNaN(value) && !isNaN(parseFloat(value))) {
      jsonValue = parseFloat(value);
    } else {
      jsonValue = value;
    }
  } else {
    jsonValue = value;
  }

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('system_settings')
      .update({
        setting_value: jsonValue,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('category', category)
      .eq('setting_key', settingKey)
      .select()
      .single();

    if (error) {
      logError('Error updating system setting:', error);
      throw error;
    }

    return data;
  } else {
    // Create new
    const { data, error } = await supabase
      .from('system_settings')
      .insert({
        category,
        setting_key: settingKey,
        setting_value: jsonValue,
        updated_by: userId,
      })
      .select()
      .single();

    if (error) {
      logError('Error creating system setting:', error);
      throw error;
    }

    return data;
  }
}

/**
 * Get integration status for all configured integrations
 */
async function getIntegrationStatuses(supabase, userId) {
  const statuses = {};

  // Check Salesforce
  try {
    const { data: sfConfig, error: sfError } = await supabase
      .from('salesforce_configs')
      .select('id, is_active, last_tested, last_error')
      .eq('is_active', true)
      .single();
    
    statuses.salesforce = {
      configured: !!sfConfig && !sfError,
      active: sfConfig?.is_active === true,
      lastTested: sfConfig?.last_tested || null,
      lastError: sfConfig?.last_error || null,
    };
  } catch (e) {
    statuses.salesforce = {
      configured: false,
      active: false,
      error: e.message,
    };
  }

  // Check Avoma
  try {
    const { data: avomaConfig, error: avomaError } = await supabase
      .from('avoma_configs')
      .select('id, is_active, last_tested, last_error')
      .eq('is_active', true)
      .single();
    
    statuses.avoma = {
      configured: !!avomaConfig && !avomaError,
      active: avomaConfig?.is_active === true,
      lastTested: avomaConfig?.last_tested || null,
      lastError: avomaConfig?.last_error || null,
    };
  } catch (e) {
    statuses.avoma = {
      configured: false,
      active: false,
      error: e.message,
    };
  }

  // Check Google Calendar (via user accounts table)
  try {
    if (userId) {
      const { data: calendarAccounts, error: calendarError } = await supabase
        .from('google_calendar_accounts')
        .select('id, user_id, access_token, token_expires_at')
        .eq('user_id', userId)
        .limit(1);
      
      const hasActiveToken = calendarAccounts && calendarAccounts.length > 0 && 
        calendarAccounts[0].access_token && 
        (!calendarAccounts[0].token_expires_at || new Date(calendarAccounts[0].token_expires_at) > new Date());
      
      statuses.googleCalendar = {
        configured: !!calendarAccounts && !calendarError && calendarAccounts.length > 0,
        connected: hasActiveToken,
        lastChecked: new Date().toISOString(),
      };
    } else {
      statuses.googleCalendar = {
        configured: false,
        connected: false,
        error: 'userId required',
      };
    }
  } catch (e) {
    statuses.googleCalendar = {
      configured: false,
      connected: false,
      error: e.message,
    };
  }

  return statuses;
}

/**
 * Get integration config for a specific type (without sensitive data)
 */
async function getIntegrationConfig(supabase, type) {
  let tableName;
  
  switch (type) {
    case 'salesforce':
      tableName = 'salesforce_configs';
      break;
    case 'avoma':
      tableName = 'avoma_configs';
      break;
    default:
      throw new Error(`Unknown integration type: ${type}`);
  }

  const { data: config, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') {
    logError(`Error fetching ${type} config:`, error);
    throw error;
  }

  // Remove sensitive data before sending to client
  if (config) {
    const sanitized = { ...config };
    // Mask sensitive fields (show only first 8 chars)
    if (sanitized.password) {
      sanitized.password_masked = sanitized.password.substring(0, 8) + '••••••••';
      delete sanitized.password;
    }
    if (sanitized.api_key) {
      sanitized.api_key_masked = sanitized.api_key.substring(0, 8) + '••••••••';
      delete sanitized.api_key;
    }
    if (sanitized.client_secret) {
      sanitized.client_secret_masked = '••••••••';
      delete sanitized.client_secret;
    }
    if (sanitized.access_token) {
      sanitized.access_token_masked = '••••••••';
      delete sanitized.access_token;
    }
    if (sanitized.refresh_token) {
      sanitized.refresh_token_masked = '••••••••';
      delete sanitized.refresh_token;
    }
    return sanitized;
  }

  return null;
}

/**
 * Get all integration configs (without sensitive data)
 */
async function getAllIntegrationConfigs(supabase) {
  const configs = {};

  // Salesforce
  try {
    const sf = await getIntegrationConfig(supabase, 'salesforce');
    configs.salesforce = sf;
  } catch (e) {
    logError('Error fetching Salesforce config:', e);
    configs.salesforce = null;
  }

  // Avoma
  try {
    const avoma = await getIntegrationConfig(supabase, 'avoma');
    configs.avoma = avoma;
  } catch (e) {
    logError('Error fetching Avoma config:', e);
    configs.avoma = null;
  }

  return configs;
}

/**
 * Update or create integration config
 */
async function upsertIntegrationConfig(supabase, type, configData, userId) {
  let tableName;
  let updateFields = {};
  
  switch (type) {
    case 'salesforce':
      tableName = 'salesforce_configs';
      if (configData.username) updateFields.username = configData.username;
      if (configData.password) updateFields.password = configData.password;
      if (configData.security_token !== undefined) updateFields.security_token = configData.security_token;
      if (configData.login_url) updateFields.login_url = configData.login_url;
      break;
    case 'avoma':
      tableName = 'avoma_configs';
      if (configData.api_key) updateFields.api_key = configData.api_key;
      if (configData.api_url) updateFields.api_url = configData.api_url;
      break;
    default:
      throw new Error(`Unknown integration type: ${type}`);
  }

  // Check if active config exists
  const { data: existing, error: fetchError } = await supabase
    .from(tableName)
    .select('id')
    .eq('is_active', true)
    .single();

  // Deactivate old configs if creating new one
  if (configData.is_active !== false) {
    await supabase
      .from(tableName)
      .update({ is_active: false })
      .eq('is_active', true);
  }

  // Only update fields that were provided (not masked values)
  const cleanFields = {};
  Object.keys(updateFields).forEach(key => {
    if (updateFields[key] && !updateFields[key].includes('••••')) {
      cleanFields[key] = updateFields[key];
    }
  });

  if (existing && configData.id) {
    // Update existing - only update provided fields
    if (Object.keys(cleanFields).length > 0) {
      cleanFields.updated_at = new Date().toISOString();
      const { data, error } = await supabase
        .from(tableName)
        .update(cleanFields)
        .eq('id', configData.id)
        .select()
        .single();

      if (error) {
        logError(`Error updating ${type} config:`, error);
        throw error;
      }

      return data;
    }
    // No fields to update, return existing
    const { data } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', configData.id)
      .single();
    return data;
  } else {
    // Create new - require essential fields
    if (Object.keys(cleanFields).length === 0) {
      throw new Error('No valid configuration fields provided');
    }
    cleanFields.is_active = configData.is_active !== false;
    const { data, error } = await supabase
      .from(tableName)
      .insert(cleanFields)
      .select()
      .single();

    if (error) {
      logError(`Error creating ${type} config:`, error);
      throw error;
    }

    return data;
  }
}

/**
 * Test integration connection
 */
async function testIntegration(supabase, type) {
  try {
    switch (type) {
      case 'salesforce':
        const { authenticateSalesforce } = require('../../../../lib/salesforce-client');
        await authenticateSalesforce(supabase);
        return { success: true, message: 'Salesforce connection successful' };
      
      case 'avoma':
        const { data: avomaConfigData, error: avomaConfigError } = await supabase
          .from('avoma_configs')
          .select('*')
          .eq('is_active', true)
          .single();
        
        if (avomaConfigError || !avomaConfigData || !avomaConfigData.api_key) {
          throw new Error('Avoma API key not configured');
        }
        
        // Test with a simple API call
        const AvomaClient = require('../../../../lib/avoma-client').AvomaClient;
        const avomaClient = new AvomaClient(avomaConfigData.api_key, avomaConfigData.api_url || 'https://api.avoma.com/v1');
        // Try to fetch meetings with limit 1 as a test
        await avomaClient.searchMeetings('test', 1);
        return { success: true, message: 'Avoma connection successful' };
      
      default:
        throw new Error(`Testing not implemented for ${type}`);
    }
  } catch (error) {
    logError(`Error testing ${type} integration:`, error);
    throw error;
  }
}

// Handle OPTIONS preflight
export async function OPTIONS() {
  return handlePreflight(new NextRequest('http://localhost', { method: 'OPTIONS' }));
}

// GET /api/system-settings
export async function GET(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  try {
    // Get Supabase client
    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const integrationStatus = searchParams.get('integrationStatus');
    const integrationConfigs = searchParams.get('integrationConfigs');
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');

    // Check if requesting integration configs
    if (integrationConfigs === 'true') {
      if (type) {
        // Get config for specific type
        const config = await getIntegrationConfig(supabase, type);
        return sendSuccessResponse({
          type,
          config,
        });
      } else {
        // Get all configs
        const configs = await getAllIntegrationConfigs(supabase);
        return sendSuccessResponse({
          configs,
        });
      }
    }

    // Check if requesting integration status
    if (integrationStatus === 'true') {
      const statuses = await getIntegrationStatuses(supabase, userId || null);
      return sendSuccessResponse({
        statuses,
        checkedAt: new Date().toISOString(),
      });
    }

    // Otherwise, handle regular settings requests
    if (category) {
      // Get settings for specific category
      const settings = await getSettingsByCategory(supabase, category);
      return sendSuccessResponse({
        category,
        settings,
      });
    } else {
      // Get all settings
      const settings = await getAllSettings(supabase);
      return sendSuccessResponse({
        settings,
      });
    }
  } catch (error) {
    logError('Error in system-settings function:', error);
    return sendErrorResponse(error, 500);
  }
}

// PUT /api/system-settings
export async function PUT(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  try {
    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    const body = await request.json();
    const { category, settingKey, value, userId } = body;

    if (!category || !settingKey || value === undefined) {
      return sendErrorResponse(new Error('Missing required fields: category, settingKey, and value'), 400);
    }

    const updated = await updateSetting(supabase, category, settingKey, value, userId || null);
    
    return sendSuccessResponse({
      message: 'Setting updated successfully',
      setting: updated,
    });
  } catch (error) {
    logError('Error in system-settings function:', error);
    return sendErrorResponse(error, 500);
  }
}

// POST /api/system-settings
export async function POST(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  try {
    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    const body = await request.json();
    const { action, type, config, userId } = body;

    if (action === 'updateIntegrationConfig') {
      // Update or create integration config
      if (!type || !config) {
        return sendErrorResponse(new Error('Missing required fields: type and config'), 400);
      }

      const updated = await upsertIntegrationConfig(supabase, type, config, userId || null);
      
      return sendSuccessResponse({
        message: 'Integration configuration updated successfully',
        config: updated,
      });
    } else if (action === 'testIntegration') {
      // Test integration connection
      if (!type) {
        return sendErrorResponse(new Error('Missing required field: type'), 400);
      }

      const testResult = await testIntegration(supabase, type);
      
      // Update last_tested timestamp
      let tableName;
      switch (type) {
        case 'salesforce': tableName = 'salesforce_configs'; break;
        case 'avoma': tableName = 'avoma_configs'; break;
      }
      
      if (tableName) {
        await supabase
          .from(tableName)
          .update({ 
            last_tested: new Date().toISOString(),
            last_error: null,
          })
          .eq('is_active', true);
      }

      return sendSuccessResponse(testResult);
    } else {
      return sendErrorResponse(new Error('Invalid action. Use "updateIntegrationConfig" or "testIntegration"'), 400);
    }
  } catch (error) {
    logError('Error in system-settings function:', error);
    
    // Update last_error on integration config
    if (error.action === 'testIntegration' && error.type) {
      let tableName;
      switch (error.type) {
        case 'salesforce': tableName = 'salesforce_configs'; break;
        case 'avoma': tableName = 'avoma_configs'; break;
      }
      
      if (tableName) {
        const supabase = getSupabaseClient();
        await supabase
          .from(tableName)
          .update({ 
            last_error: error.message,
          })
          .eq('is_active', true);
      }
    }
    
    return sendErrorResponse(error, 500);
  }
}

