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
   * Search for meetings by customer name
   */
  async searchMeetings(customerName, limit = 10) {
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 6 months ago
    
    const params = new URLSearchParams({
      limit: limit.toString(),
      from_date: fromDate,
      to_date: toDate,
    });

    if (customerName) {
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

