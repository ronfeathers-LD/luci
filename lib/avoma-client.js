/**
 * Avoma API Client
 * 
 * Handles communication with Avoma API for fetching transcriptions
 * Based on SOW-Generator implementation
 */

class AvomaClient {
  constructor(apiKey, baseUrl = 'https://api.avoma.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Make authenticated request to Avoma API
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Avoma API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Search for meetings by customer name or Salesforce Account ID
   * Uses crm_account_ids when available (more reliable than customer_name)
   */
  async searchMeetings(customerName, limit = 10, salesforceAccountId = null) {
    // Use 12 months date range (matching SOW-Generator)
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 12);
    
    const params = new URLSearchParams({
      page_size: limit.toString(), // Use page_size instead of limit (matching SOW-Generator)
      from_date: fromDate.toISOString(),
      to_date: toDate.toISOString(),
    });

    // Priority 1: Use Salesforce Account ID if available (most reliable)
    if (salesforceAccountId) {
      params.append('crm_account_ids', salesforceAccountId);
    }
    
    // Priority 2: Fall back to customer_name if no Salesforce Account ID
    if (!salesforceAccountId && customerName) {
      params.append('customer_name', customerName);
    }

    return this.makeRequest(`/meetings?${params.toString()}`);
  }

  /**
   * Get meeting details by UUID
   */
  async getMeeting(meetingUuid) {
    return this.makeRequest(`/meetings/${meetingUuid}`);
  }

  /**
   * Get transcript for a meeting
   */
  async getMeetingTranscript(meetingUuid) {
    return this.makeRequest(`/transcriptions/${meetingUuid}/`);
  }

  /**
   * Get full transcript text with speaker information
   */
  async getMeetingTranscriptText(meetingUuid) {
    const transcriptData = await this.getMeetingTranscript(meetingUuid);
    
    const speakers = transcriptData.speakers || [];
    let transcriptText = '';
    
    if (transcriptData.transcript && Array.isArray(transcriptData.transcript)) {
      const speakerMap = new Map(speakers.map(s => [s.id, s.name || `Speaker ${s.id}`]));
      
      transcriptText = transcriptData.transcript
        .map(segment => {
          const speakerName = speakerMap.get(segment.speaker_id) || `Speaker ${segment.speaker_id}`;
          return `${speakerName}: ${segment.transcript}`;
        })
        .join('\n\n');
    } else if (transcriptData.content) {
      transcriptText = transcriptData.content;
    }

    return {
      text: transcriptText,
      speakers: speakers,
    };
  }
}

module.exports = { AvomaClient };

