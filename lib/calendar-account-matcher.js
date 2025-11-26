/**
 * Calendar Event to Account Matcher
 * 
 * Matches Google Calendar events to Salesforce accounts based on:
 * - Account names in event title/summary
 * - Attendee email addresses matching contact emails
 * - Account names in event description
 */

const { log, logError } = require('./api-helpers');

/**
 * Match calendar events to Salesforce accounts
 * 
 * @param {Object} supabase - Supabase client
 * @param {string} userId - User ID
 * @param {Array} events - Array of Google Calendar events
 * @returns {Promise<Array>} Array of events with matched accounts
 */
async function matchEventsToAccounts(supabase, userId, events) {
  // Get user's accounts
  const { data: userAccounts, error: accountsError } = await supabase
    .from('user_accounts')
    .select(`
      account_id,
      accounts:account_id (
        id,
        salesforce_id,
        name
      )
    `)
    .eq('user_id', userId);

  if (accountsError) {
    logError('Error fetching user accounts:', accountsError);
    return events.map(event => ({ event, matchedAccounts: [] }));
  }

  if (!userAccounts || userAccounts.length === 0) {
    return events.map(event => ({ event, matchedAccounts: [] }));
  }

  // Get account names for matching
  const accountMap = new Map();
  userAccounts.forEach(ua => {
    if (ua.accounts) {
      accountMap.set(ua.accounts.name.toLowerCase(), {
        id: ua.accounts.id,
        salesforce_id: ua.accounts.salesforce_id,
        name: ua.accounts.name,
      });
    }
  });

  // Get contacts for email matching
  const accountIds = userAccounts.map(ua => ua.account_id).filter(Boolean);
  let contacts = [];
  if (accountIds.length > 0) {
    const { data: contactsData, error: contactsError } = await supabase
      .from('contacts')
      .select('id, email, first_name, last_name, account_id, account_name')
      .in('account_id', accountIds)
      .not('email', 'is', null);

    if (!contactsError && contactsData) {
      // Map contacts to include account info from userAccounts
      contacts = contactsData.map(contact => {
        const userAccount = userAccounts.find(ua => ua.account_id === contact.account_id);
        return {
          ...contact,
          accounts: userAccount?.accounts || null,
        };
      });
    }
  }

  // Create email to account map
  const emailToAccountMap = new Map();
  contacts.forEach(contact => {
    if (contact.email && contact.accounts) {
      const email = contact.email.toLowerCase();
      if (!emailToAccountMap.has(email)) {
        emailToAccountMap.set(email, []);
      }
      emailToAccountMap.get(email).push({
        id: contact.accounts.id,
        salesforce_id: contact.accounts.salesforce_id,
        name: contact.accounts.name,
      });
    }
  });

  // Match events to accounts
  const eventsWithAccounts = events.map(event => {
    const matchedAccounts = new Set();
    const matchReasons = [];

    const eventText = [
      event.summary || '',
      event.description || '',
      event.location || '',
    ].join(' ').toLowerCase();

    // Match by account name in event text
    accountMap.forEach((account, accountNameLower) => {
      // Check if account name appears in event text
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${accountNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(eventText)) {
        matchedAccounts.add(account.id);
        matchReasons.push({
          accountId: account.id,
          accountName: account.name,
          reason: `Account name "${account.name}" found in event`,
          confidence: 'high',
        });
      }
    });

    // Match by attendee email addresses
    if (event.attendees && Array.isArray(event.attendees)) {
      event.attendees.forEach(attendee => {
        if (attendee.email) {
          const email = attendee.email.toLowerCase();
          const matchedAccountsForEmail = emailToAccountMap.get(email);
          if (matchedAccountsForEmail) {
            matchedAccountsForEmail.forEach(account => {
              if (!matchedAccounts.has(account.id)) {
                matchedAccounts.add(account.id);
                matchReasons.push({
                  accountId: account.id,
                  accountName: account.name,
                  reason: `Attendee email ${attendee.email} matches contact`,
                  confidence: 'high',
                });
              }
            });
          }
        }
      });
    }

    // Convert Set to Array and get full account details
    const matchedAccountIds = Array.from(matchedAccounts);
    const matchedAccountsFull = matchedAccountIds.map(accountId => {
      const userAccount = userAccounts.find(ua => ua.account_id === accountId);
      if (userAccount && userAccount.accounts) {
        const matchReason = matchReasons.find(mr => mr.accountId === accountId);
        return {
          id: userAccount.accounts.id,
          salesforce_id: userAccount.accounts.salesforce_id,
          name: userAccount.accounts.name,
          matchReason: matchReason?.reason || 'Matched',
          confidence: matchReason?.confidence || 'medium',
        };
      }
      return null;
    }).filter(Boolean);

    return {
      event,
      matchedAccounts: matchedAccountsFull,
    };
  });

  // Store matches in database
  try {
    await storeEventAccountMatches(supabase, eventsWithAccounts);
  } catch (error) {
    logError('Error storing event-account matches:', error);
    // Continue even if storage fails
  }

  return eventsWithAccounts;
}

/**
 * Store event-account matches in database
 */
async function storeEventAccountMatches(supabase, eventsWithAccounts) {
  const matchesToStore = [];

  for (const { event, matchedAccounts } of eventsWithAccounts) {
    if (matchedAccounts.length === 0) continue;

    // Get the stored event ID from database
    const { data: storedEvent, error: eventError } = await supabase
      .from('google_calendar_events')
      .select('id')
      .eq('event_id', event.id)
      .single();

    if (eventError || !storedEvent) {
      continue; // Skip if event not found in database
    }

    // Create matches for each account
    matchedAccounts.forEach(account => {
      matchesToStore.push({
        event_id: storedEvent.id,
        account_id: account.id,
        salesforce_account_id: account.salesforce_id,
        match_confidence: account.confidence,
        match_reason: account.matchReason,
      });
    });
  }

  if (matchesToStore.length > 0) {
    // Upsert matches (update if exists, insert if not)
    const { error: upsertError } = await supabase
      .from('calendar_event_account_matches')
      .upsert(matchesToStore, {
        onConflict: 'event_id,account_id',
        ignoreDuplicates: false,
      });

    if (upsertError) {
      logError('Error storing event-account matches:', upsertError);
      throw upsertError;
    }
  }
}

module.exports = {
  matchEventsToAccounts,
  storeEventAccountMatches,
};

