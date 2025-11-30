/**
 * Health Check API Route
 * Simple endpoint to test database connectivity
 */

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabase-server';

export async function GET() {
  try {
    // Check environment variables
    const hasUrl = !!process.env.SUPABASE_URL;
    const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const envStatus = {
      SUPABASE_URL: hasUrl ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: hasKey ? '✅ Set' : '❌ Missing',
    };
    
    if (!hasUrl || !hasKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Environment variables not configured',
        environment: envStatus,
        timestamp: new Date().toISOString(),
      }, { status: 503 });
    }
    
    // Try to create Supabase client
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to create Supabase client',
        environment: envStatus,
        timestamp: new Date().toISOString(),
      }, { status: 503 });
    }
    
    // Try a simple query to test connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database query failed',
        error: error.message,
        code: error.code,
        environment: envStatus,
        timestamp: new Date().toISOString(),
      }, { status: 503 });
    }
    
    // Check which database we're using (local vs production)
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const isLocal = supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost');
    const databaseType = isLocal ? 'Local Supabase' : 'Production Supabase';
    
    // Try to get user count to verify database has data
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      status: 'ok',
      message: 'Database connection successful',
      database: {
        type: databaseType,
        url: supabaseUrl.replace(/\/$/, ''),
        userCount: countError ? 'unknown' : count,
      },
      environment: envStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

