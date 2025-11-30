/**
 * Next.js App Router API Route for Avoma Transcription
 * 
 * Fetches transcriptions from Avoma API with intelligent caching
 * Only calls Avoma API when cache is stale or missing
 */

import { NextRequest } from 'next/server';
import { getSupabaseClient } from '../../../lib/supabase-server';
import { handlePreflight, validateRequestSize, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, logWarn, isProduction } from '../../../lib/next-api-helpers';

// Can use require for lib files in Next.js API routes
const { AvomaClient } = require('../../../../lib/avoma-client');
const { MAX_REQUEST_SIZE, CACHE_TTL } = require('../../../../lib/constants');
const { isCacheFresh } = require('../../../../lib/cache-helpers');

/**
 * Get Avoma config from Supabase
 */
async function getAvomaConfig(supabase) {
  const { data: config, error: configError } = await supabase
    .from('avoma_configs')
    .select('*')
    .eq('is_active', true)
    .single();

  if (configError || !config) {
    throw new Error('Avoma configuration not found. Please configure Avoma API credentials.');
  }

  return config;
}

/**
 * Get cached transcription from Supabase
 */
async function getCachedTranscription(supabase, customerIdentifier, salesforceAccountId) {
  if (!supabase) return null;

  let query = supabase
    .from('transcriptions')
    .select('*')
    .order('meeting_date', { ascending: false })
    .limit(1);

  if (salesforceAccountId) {
    query = query.eq('salesforce_account_id', salesforceAccountId);
  } else if (customerIdentifier) {
    query = query.ilike('customer_identifier', `%${customerIdentifier}%`);
  } else {
    return null;
  }

  const { data: transcriptions, error } = await query;

  if (error || !transcriptions || transcriptions.length === 0) {
    return null;
  }

  const transcription = transcriptions[0];
  
  return {
    transcription: transcription,
    isFresh: isCacheFresh(transcription.last_synced_at, CACHE_TTL.TRANSCRIPTIONS),
  };
}

/**
 * Search Avoma for meetings matching customer identifier
 */
async function searchAvomaMeetings(avomaClient, customerIdentifier, salesforceAccountId = null) {
  const searchResult = await avomaClient.searchMeetings(customerIdentifier, 20, salesforceAccountId);
  
  const allMeetings = searchResult.results || searchResult.calls || [];
  const readyMeetings = allMeetings.filter(m => m.transcript_ready && m.transcription_uuid);
  
  if (readyMeetings.length === 0) {
    return {
      meeting: null,
      totalMeetings: allMeetings.length,
      readyMeetings: 0,
    };
  }

  const mostRecentMeeting = readyMeetings.sort((a, b) => {
    const dateA = new Date(a.start_at || a.meeting_date || 0);
    const dateB = new Date(b.start_at || b.meeting_date || 0);
    return dateB - dateA;
  })[0];

  return {
    meeting: mostRecentMeeting,
    totalMeetings: allMeetings.length,
    readyMeetings: readyMeetings.length,
  };
}

/**
 * Fetch transcription from Avoma API
 */
async function fetchFromAvoma(avomaClient, meetingUuid) {
  const meeting = await avomaClient.getMeeting(meetingUuid);
  
  if (!meeting.transcript_ready) {
    throw new Error('Transcript is not ready for this meeting');
  }

  const transcriptUuid = meeting.transcription_uuid || meetingUuid;
  
  let transcriptResult;
  try {
    transcriptResult = await avomaClient.getMeetingTranscriptText(transcriptUuid);
  } catch (transcriptError) {
    if (transcriptUuid !== meetingUuid) {
      logWarn(`Failed to get transcript with transcription_uuid ${transcriptUuid}, trying meeting UUID ${meetingUuid}`);
      transcriptResult = await avomaClient.getMeetingTranscriptText(meetingUuid);
    } else {
      throw transcriptError;
    }
  }
  
  return {
    transcription: transcriptResult.text,
    speakers: transcriptResult.speakers,
    meeting: {
      uuid: meetingUuid,
      transcription_uuid: meeting.transcription_uuid || meetingUuid,
      subject: meeting.subject,
      start_at: meeting.start_at,
      meeting_date: meeting.start_at ? new Date(meeting.start_at) : null,
      duration: meeting.duration,
      url: meeting.url,
      attendees: meeting.attendees,
    },
  };
}

/**
 * Save transcription to Supabase cache
 */
async function cacheTranscription(supabase, transcriptionData, customerIdentifier, salesforceAccountId) {
  if (!supabase || !transcriptionData) return null;

  const duration = transcriptionData.meeting.duration 
    ? Math.round(Number(transcriptionData.meeting.duration)) 
    : null;

  const transcriptionRecord = {
    avoma_meeting_uuid: transcriptionData.meeting.uuid,
    salesforce_account_id: salesforceAccountId || null,
    customer_identifier: customerIdentifier || null,
    transcription_text: transcriptionData.transcription,
    speakers: transcriptionData.speakers || null,
    meeting_subject: transcriptionData.meeting.subject || null,
    meeting_date: transcriptionData.meeting.meeting_date || null,
    meeting_duration: duration,
    meeting_url: transcriptionData.meeting.url || null,
    attendees: transcriptionData.meeting.attendees || null,
    last_synced_at: new Date().toISOString(),
  };

  const { data: saved, error } = await supabase
    .from('transcriptions')
    .upsert(transcriptionRecord, {
      onConflict: 'avoma_meeting_uuid',
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (error) {
    logError('Error caching transcription:', error);
    return null;
  }

  return saved;
}

// Handle OPTIONS preflight
export async function OPTIONS() {
  return handlePreflight(new NextRequest('http://localhost', { method: 'OPTIONS' }));
}

// GET /api/avoma-transcription
export async function GET(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  const sizeValidation = validateRequestSize(request, MAX_REQUEST_SIZE.LARGE);
  if (!sizeValidation.valid) {
    return sendErrorResponse(new Error(sizeValidation.error.message), sizeValidation.error.status);
  }

  try {
    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    const { searchParams } = new URL(request.url);
    const customerIdentifier = searchParams.get('customerIdentifier');
    const salesforceAccountId = searchParams.get('salesforceAccountId');
    const meetingUuid = searchParams.get('meetingUuid');
    const forceRefresh = searchParams.get('forceRefresh');
    const accountId = searchParams.get('accountId');
    const source = searchParams.get('source');

    // Handle account transcriptions list (cache-only)
    const isAccountTranscriptionsRequest = source === 'cache' || 
      ((accountId || salesforceAccountId) && !customerIdentifier && !meetingUuid);
    
    if (isAccountTranscriptionsRequest) {
      const lookupAccountId = accountId || salesforceAccountId;
      
      if (!lookupAccountId) {
        return sendErrorResponse(new Error('Missing required parameter: accountId or salesforceAccountId'), 400);
      }

      let query = supabase
        .from('transcriptions')
        .select('*')
        .order('meeting_date', { ascending: false });

      if (salesforceAccountId || (accountId && (!accountId.includes('-') || accountId.length !== 36))) {
        query = query.eq('salesforce_account_id', lookupAccountId);
      } else if (accountId && accountId.includes('-') && accountId.length === 36) {
        query = query.eq('account_id', accountId);
      }

      const { data: transcriptions, error } = await query;

      if (error) {
        logError('Error fetching transcriptions:', error);
        return sendErrorResponse(new Error('Failed to fetch transcriptions'), 500);
      }

      const mappedTranscriptions = (transcriptions || []).map(t => ({
        id: t.id,
        avoma_meeting_uuid: t.avoma_meeting_uuid,
        transcription: t.transcription_text,
        speakers: t.speakers,
        meeting: {
          subject: t.meeting_subject,
          meeting_date: t.meeting_date,
          duration: t.meeting_duration,
          url: t.meeting_url,
          attendees: t.attendees,
        },
        last_synced_at: t.last_synced_at,
        cached: true,
      }));

      return sendSuccessResponse({
        transcriptions: mappedTranscriptions,
        total: mappedTranscriptions.length,
      });
    }

    // Original functionality: fetch single transcription
    if (!customerIdentifier && !salesforceAccountId && !meetingUuid) {
      return sendErrorResponse(new Error('Missing required parameter: customerIdentifier, salesforceAccountId, or meetingUuid'), 400);
    }

    const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

    // Handle bulk re-sync
    if (shouldForceRefresh && salesforceAccountId && !meetingUuid) {
      const avomaConfig = await getAvomaConfig(supabase);
      const avomaClient = new AvomaClient(avomaConfig.api_key, avomaConfig.api_url);

      const searchResult = await avomaClient.searchMeetings(customerIdentifier || '', 50, salesforceAccountId);
      const allMeetings = searchResult.results || searchResult.calls || [];
      const readyMeetings = allMeetings.filter(m => m.transcript_ready && (m.transcription_uuid || m.uuid || m.id));

      if (readyMeetings.length === 0) {
        return sendSuccessResponse({
          transcription: '',
          meetingCounts: {
            total: allMeetings.length,
            ready: 0,
          },
          warning: 'No meetings with ready transcripts found for this account',
          synced: 0,
        });
      }

      let syncedCount = 0;
      let errors = [];

      for (const meeting of readyMeetings) {
        try {
          const meetingUuid = meeting.uuid || meeting.id || meeting.transcription_uuid;
          if (!meetingUuid) continue;

          const transcriptionData = await fetchFromAvoma(avomaClient, meetingUuid);
          
          await cacheTranscription(
            supabase,
            transcriptionData,
            customerIdentifier || '',
            salesforceAccountId
          );
          
          syncedCount++;
        } catch (error) {
          logError(`Error syncing meeting ${meeting.uuid || meeting.id}:`, error);
          errors.push(error.message);
        }
      }

      return sendSuccessResponse({
        transcription: '',
        meetingCounts: {
          total: allMeetings.length,
          ready: readyMeetings.length,
        },
        synced: syncedCount,
        errors: errors.length > 0 ? errors : undefined,
        message: `Successfully synced ${syncedCount} of ${readyMeetings.length} ready meetings`,
      });
    }

    // Check cache first (unless force refresh)
    if (!shouldForceRefresh && !meetingUuid) {
      const cached = await getCachedTranscription(supabase, customerIdentifier, salesforceAccountId);
      
      if (cached && cached.isFresh) {
        log('Returning cached transcription (fresh)');
        return sendSuccessResponse({
          transcription: cached.transcription.transcription_text,
          speakers: cached.transcription.speakers,
          meeting: {
            subject: cached.transcription.meeting_subject,
            meeting_date: cached.transcription.meeting_date,
            duration: cached.transcription.meeting_duration,
            url: cached.transcription.meeting_url,
            attendees: cached.transcription.attendees,
          },
          cached: true,
          last_synced_at: cached.transcription.last_synced_at,
        });
      }
    }

    // Get Avoma config
    const avomaConfig = await getAvomaConfig(supabase);
    const avomaClient = new AvomaClient(avomaConfig.api_key, avomaConfig.api_url);

    let transcriptionData;

    if (meetingUuid) {
      transcriptionData = await fetchFromAvoma(avomaClient, meetingUuid);
    } else {
      const searchResult = await searchAvomaMeetings(avomaClient, customerIdentifier, salesforceAccountId);
      
      if (!searchResult.meeting) {
        return sendSuccessResponse({ 
          transcription: '',
          meetingCounts: {
            total: searchResult.totalMeetings || 0,
            ready: searchResult.readyMeetings || 0,
          },
          warning: 'No meetings with ready transcripts found for this customer',
          searchMethod: salesforceAccountId ? 'crm_account_ids' : 'customer_name',
          customerIdentifier: customerIdentifier,
          salesforceAccountId: salesforceAccountId || 'not provided',
        });
      }

      const meetingUuid = searchResult.meeting.uuid || searchResult.meeting.id;
      if (!meetingUuid) {
        return sendErrorResponse(new Error('Meeting found but missing UUID'), 500);
      }

      transcriptionData = await fetchFromAvoma(avomaClient, meetingUuid);
      transcriptionData.meetingCounts = {
        total: searchResult.totalMeetings,
        ready: searchResult.readyMeetings,
      };
    }

    // Cache the transcription
    const cached = await cacheTranscription(
      supabase,
      transcriptionData,
      customerIdentifier,
      salesforceAccountId
    );

    return sendSuccessResponse({
      transcription: transcriptionData.transcription,
      speakers: transcriptionData.speakers,
      meeting: {
        subject: transcriptionData.meeting.subject,
        meeting_date: transcriptionData.meeting.meeting_date,
        duration: transcriptionData.meeting.duration,
        url: transcriptionData.meeting.url,
        attendees: transcriptionData.meeting.attendees,
      },
      meetingCounts: transcriptionData.meetingCounts || null,
      cached: !!cached,
      last_synced_at: cached?.last_synced_at || new Date().toISOString(),
    });

  } catch (error) {
    logError('Error in avoma-transcription function:', error);
    return sendErrorResponse(error, 500);
  }
}

// POST /api/avoma-transcription
export async function POST(request) {
  const preflight = await handlePreflight(request);
  if (preflight) return preflight;

  const sizeValidation = validateRequestSize(request, MAX_REQUEST_SIZE.LARGE);
  if (!sizeValidation.valid) {
    return sendErrorResponse(new Error(sizeValidation.error.message), sizeValidation.error.status);
  }

  try {
    const supabase = getSupabaseClient();
    const validation = validateSupabase(supabase);
    
    if (!validation.valid) {
      return sendErrorResponse(new Error(validation.error.message), validation.error.status);
    }

    const body = await request.json();
    const { customerIdentifier, salesforceAccountId, meetingUuid, forceRefresh, accountId, source } = body;

    // Handle account transcriptions list (cache-only)
    const isAccountTranscriptionsRequest = source === 'cache' || 
      ((accountId || salesforceAccountId) && !customerIdentifier && !meetingUuid);
    
    if (isAccountTranscriptionsRequest) {
      const lookupAccountId = accountId || salesforceAccountId;
      
      if (!lookupAccountId) {
        return sendErrorResponse(new Error('Missing required parameter: accountId or salesforceAccountId'), 400);
      }

      let query = supabase
        .from('transcriptions')
        .select('*')
        .order('meeting_date', { ascending: false });

      if (salesforceAccountId || (accountId && (!accountId.includes('-') || accountId.length !== 36))) {
        query = query.eq('salesforce_account_id', lookupAccountId);
      } else if (accountId && accountId.includes('-') && accountId.length === 36) {
        query = query.eq('account_id', accountId);
      }

      const { data: transcriptions, error } = await query;

      if (error) {
        logError('Error fetching transcriptions:', error);
        return sendErrorResponse(new Error('Failed to fetch transcriptions'), 500);
      }

      const mappedTranscriptions = (transcriptions || []).map(t => ({
        id: t.id,
        avoma_meeting_uuid: t.avoma_meeting_uuid,
        transcription: t.transcription_text,
        speakers: t.speakers,
        meeting: {
          subject: t.meeting_subject,
          meeting_date: t.meeting_date,
          duration: t.meeting_duration,
          url: t.meeting_url,
          attendees: t.attendees,
        },
        last_synced_at: t.last_synced_at,
        cached: true,
      }));

      return sendSuccessResponse({
        transcriptions: mappedTranscriptions,
        total: mappedTranscriptions.length,
      });
    }

    // Original functionality: fetch single transcription
    if (!customerIdentifier && !salesforceAccountId && !meetingUuid) {
      return sendErrorResponse(new Error('Missing required parameter: customerIdentifier, salesforceAccountId, or meetingUuid'), 400);
    }

    const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

    // Handle bulk re-sync
    if (shouldForceRefresh && salesforceAccountId && !meetingUuid) {
      const avomaConfig = await getAvomaConfig(supabase);
      const avomaClient = new AvomaClient(avomaConfig.api_key, avomaConfig.api_url);

      const searchResult = await avomaClient.searchMeetings(customerIdentifier || '', 50, salesforceAccountId);
      const allMeetings = searchResult.results || searchResult.calls || [];
      const readyMeetings = allMeetings.filter(m => m.transcript_ready && (m.transcription_uuid || m.uuid || m.id));

      if (readyMeetings.length === 0) {
        return sendSuccessResponse({
          transcription: '',
          meetingCounts: {
            total: allMeetings.length,
            ready: 0,
          },
          warning: 'No meetings with ready transcripts found for this account',
          synced: 0,
        });
      }

      let syncedCount = 0;
      let errors = [];

      for (const meeting of readyMeetings) {
        try {
          const meetingUuid = meeting.uuid || meeting.id || meeting.transcription_uuid;
          if (!meetingUuid) continue;

          const transcriptionData = await fetchFromAvoma(avomaClient, meetingUuid);
          
          await cacheTranscription(
            supabase,
            transcriptionData,
            customerIdentifier || '',
            salesforceAccountId
          );
          
          syncedCount++;
        } catch (error) {
          logError(`Error syncing meeting ${meeting.uuid || meeting.id}:`, error);
          errors.push(error.message);
        }
      }

      return sendSuccessResponse({
        transcription: '',
        meetingCounts: {
          total: allMeetings.length,
          ready: readyMeetings.length,
        },
        synced: syncedCount,
        errors: errors.length > 0 ? errors : undefined,
        message: `Successfully synced ${syncedCount} of ${readyMeetings.length} ready meetings`,
      });
    }

    // Check cache first (unless force refresh)
    if (!shouldForceRefresh && !meetingUuid) {
      const cached = await getCachedTranscription(supabase, customerIdentifier, salesforceAccountId);
      
      if (cached && cached.isFresh) {
        log('Returning cached transcription (fresh)');
        return sendSuccessResponse({
          transcription: cached.transcription.transcription_text,
          speakers: cached.transcription.speakers,
          meeting: {
            subject: cached.transcription.meeting_subject,
            meeting_date: cached.transcription.meeting_date,
            duration: cached.transcription.meeting_duration,
            url: cached.transcription.meeting_url,
            attendees: cached.transcription.attendees,
          },
          cached: true,
          last_synced_at: cached.transcription.last_synced_at,
        });
      }
    }

    // Get Avoma config
    const avomaConfig = await getAvomaConfig(supabase);
    const avomaClient = new AvomaClient(avomaConfig.api_key, avomaConfig.api_url);

    let transcriptionData;

    if (meetingUuid) {
      transcriptionData = await fetchFromAvoma(avomaClient, meetingUuid);
    } else {
      const searchResult = await searchAvomaMeetings(avomaClient, customerIdentifier, salesforceAccountId);
      
      if (!searchResult.meeting) {
        return sendSuccessResponse({ 
          transcription: '',
          meetingCounts: {
            total: searchResult.totalMeetings || 0,
            ready: searchResult.readyMeetings || 0,
          },
          warning: 'No meetings with ready transcripts found for this customer',
          searchMethod: salesforceAccountId ? 'crm_account_ids' : 'customer_name',
          customerIdentifier: customerIdentifier,
          salesforceAccountId: salesforceAccountId || 'not provided',
        });
      }

      const meetingUuid = searchResult.meeting.uuid || searchResult.meeting.id;
      if (!meetingUuid) {
        return sendErrorResponse(new Error('Meeting found but missing UUID'), 500);
      }

      transcriptionData = await fetchFromAvoma(avomaClient, meetingUuid);
      transcriptionData.meetingCounts = {
        total: searchResult.totalMeetings,
        ready: searchResult.readyMeetings,
      };
    }

    // Cache the transcription
    const cached = await cacheTranscription(
      supabase,
      transcriptionData,
      customerIdentifier,
      salesforceAccountId
    );

    return sendSuccessResponse({
      transcription: transcriptionData.transcription,
      speakers: transcriptionData.speakers,
      meeting: {
        subject: transcriptionData.meeting.subject,
        meeting_date: transcriptionData.meeting.meeting_date,
        duration: transcriptionData.meeting.duration,
        url: transcriptionData.meeting.url,
        attendees: transcriptionData.meeting.attendees,
      },
      meetingCounts: transcriptionData.meetingCounts || null,
      cached: !!cached,
      last_synced_at: cached?.last_synced_at || new Date().toISOString(),
    });

  } catch (error) {
    logError('Error in avoma-transcription function:', error);
    return sendErrorResponse(error, 500);
  }
}

