/**
 * Vercel Serverless Function for Avoma Transcription
 * 
 * Fetches transcriptions from Avoma API with intelligent caching
 * Only calls Avoma API when cache is stale or missing
 */

const { getSupabaseClient } = require('../lib/supabase-client');
const { AvomaClient } = require('../lib/avoma-client');
const { handlePreflight, validateRequestSize, sendErrorResponse, sendSuccessResponse, validateSupabase, log, logError, logWarn, isProduction } = require('../lib/api-helpers');
const { MAX_REQUEST_SIZE, CACHE_TTL } = require('../lib/constants');
const { isCacheFresh } = require('../lib/cache-helpers');

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

  // Try to find by customer identifier or Salesforce account ID
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
 * Uses Salesforce Account ID if available (more reliable than customer name)
 * Returns meeting and count of all meetings found
 */
async function searchAvomaMeetings(avomaClient, customerIdentifier, salesforceAccountId = null) {
  // Search with Salesforce Account ID if available, otherwise use customer name
  const searchResult = await avomaClient.searchMeetings(customerIdentifier, 20, salesforceAccountId);
  
  // Get all meetings and meetings with ready transcripts
  const allMeetings = searchResult.results || searchResult.calls || [];
  const readyMeetings = allMeetings.filter(m => m.transcript_ready && m.transcription_uuid);
  
  if (readyMeetings.length === 0) {
    return {
      meeting: null,
      totalMeetings: allMeetings.length,
      readyMeetings: 0,
    };
  }

  // Get the most recent meeting with ready transcript
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
  // Get meeting details first
  const meeting = await avomaClient.getMeeting(meetingUuid);
  
  if (!meeting.transcript_ready) {
    throw new Error('Transcript is not ready for this meeting');
  }

  // Use transcription_uuid if available, otherwise use meeting UUID
  // (transcription UUID can be different from meeting UUID)
  const transcriptUuid = meeting.transcription_uuid || meetingUuid;
  
  // Get transcript text
  let transcriptResult;
  try {
    transcriptResult = await avomaClient.getMeetingTranscriptText(transcriptUuid);
  } catch (transcriptError) {
    // If transcription_uuid fails, try with meeting UUID as fallback
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

  // Convert duration to integer (round if decimal) since database expects INTEGER
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
    meeting_duration: duration, // Converted to integer
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

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (handlePreflight(req, res)) {
    return;
  }

  // Only allow POST and GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return sendErrorResponse(res, new Error('Method not allowed'), 405);
  }

  // Validate request size
  const sizeValidation = validateRequestSize(req, MAX_REQUEST_SIZE.LARGE);
  if (!sizeValidation.valid) {
    return sendErrorResponse(res, new Error(sizeValidation.error.message), sizeValidation.error.status);
  }

  try {
    const supabase = getSupabaseClient();
    
    if (!validateSupabase(supabase, res)) {
      return; // Response already sent
    }

    // Get parameters
    const { customerIdentifier, salesforceAccountId, meetingUuid, forceRefresh, accountId, source } = req.method === 'POST' 
      ? req.body 
      : req.query;

    // Handle account transcriptions list (cache-only, returns all transcriptions for account)
    // This is the merged functionality from account-transcriptions.js
    // If source=cache OR (accountId/salesforceAccountId provided without customerIdentifier/meetingUuid)
    const isAccountTranscriptionsRequest = source === 'cache' || 
      ((accountId || salesforceAccountId) && !customerIdentifier && !meetingUuid);
    
    if (isAccountTranscriptionsRequest) {
      const lookupAccountId = accountId || salesforceAccountId;
      
      if (!lookupAccountId) {
        return sendErrorResponse(res, new Error('Missing required parameter: accountId or salesforceAccountId'), 400);
      }

      // Build query
      let query = supabase
        .from('transcriptions')
        .select('*')
        .order('meeting_date', { ascending: false });

      // Filter by salesforce_account_id or account_id
      if (salesforceAccountId || (accountId && (!accountId.includes('-') || accountId.length !== 36))) {
        // Assume it's a Salesforce ID
        query = query.eq('salesforce_account_id', lookupAccountId);
      } else if (accountId && accountId.includes('-') && accountId.length === 36) {
        // It's a UUID
        query = query.eq('account_id', accountId);
      }

      const { data: transcriptions, error } = await query;

      if (error) {
        logError('Error fetching transcriptions:', error);
        return sendErrorResponse(res, new Error('Failed to fetch transcriptions'), 500);
      }

      // Map transcriptions to response format
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

      return sendSuccessResponse(res, {
        transcriptions: mappedTranscriptions,
        total: mappedTranscriptions.length,
      });
    }

    // Original functionality: fetch single transcription (from API or cache)
    if (!customerIdentifier && !salesforceAccountId && !meetingUuid) {
      return sendErrorResponse(res, new Error('Missing required parameter: customerIdentifier, salesforceAccountId, or meetingUuid'), 400);
    }

    const shouldForceRefresh = forceRefresh === 'true' || forceRefresh === '1';

    // Handle bulk re-sync: when forceRefresh is true and we have salesforceAccountId, fetch ALL meetings
    if (shouldForceRefresh && salesforceAccountId && !meetingUuid) {
      // Get Avoma config
      const avomaConfig = await getAvomaConfig(supabase);
      const avomaClient = new AvomaClient(avomaConfig.api_key, avomaConfig.api_url);

      // Search for all meetings
      const searchResult = await avomaClient.searchMeetings(customerIdentifier || '', 50, salesforceAccountId);
      const allMeetings = searchResult.results || searchResult.calls || [];
      const readyMeetings = allMeetings.filter(m => m.transcript_ready && (m.transcription_uuid || m.uuid || m.id));

      if (readyMeetings.length === 0) {
        return sendSuccessResponse(res, {
          transcription: '',
          meetingCounts: {
            total: allMeetings.length,
            ready: 0,
          },
          warning: 'No meetings with ready transcripts found for this account',
          synced: 0,
        });
      }

      // Fetch and cache all ready meetings
      let syncedCount = 0;
      let errors = [];

      for (const meeting of readyMeetings) {
        try {
          const meetingUuid = meeting.uuid || meeting.id || meeting.transcription_uuid;
          if (!meetingUuid) continue;

          const transcriptionData = await fetchFromAvoma(avomaClient, meetingUuid);
          
          // Cache the transcription
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

      return sendSuccessResponse(res, {
        transcription: '', // Not returning single transcription for bulk sync
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
        return sendSuccessResponse(res, {
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
      // Direct meeting UUID provided
      transcriptionData = await fetchFromAvoma(avomaClient, meetingUuid);
    } else {
      // Search for meetings by customer identifier
      // Use Salesforce Account ID if available (more reliable than customer name)
      const searchResult = await searchAvomaMeetings(avomaClient, customerIdentifier, salesforceAccountId);
      
      if (!searchResult.meeting) {
        // Return success with empty transcription instead of error
        // This allows sentiment analysis to proceed with Salesforce data only
        return sendSuccessResponse(res, { 
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

      // Use meeting UUID (could be uuid or id field)
      const meetingUuid = searchResult.meeting.uuid || searchResult.meeting.id;
      if (!meetingUuid) {
        return sendErrorResponse(res, new Error('Meeting found but missing UUID'), 500, isProduction());
      }

      transcriptionData = await fetchFromAvoma(avomaClient, meetingUuid);
      // Add meeting counts to transcription data
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

        return sendSuccessResponse(res, {
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
    return sendErrorResponse(res, error, 500, isProduction());
  }
}

