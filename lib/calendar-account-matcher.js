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
  // Try both account_id (UUID) and salesforce_account_id (Salesforce ID) matching
  const accountIds = userAccounts.map(ua => ua.account_id).filter(Boolean);
  const salesforceAccountIds = userAccounts.map(ua => ua.accounts?.salesforce_id).filter(Boolean);
  
  log(`User has ${userAccounts.length} accounts for calendar matching`);
  const hasManaManage = userAccounts.some(ua => ua.accounts?.name?.toLowerCase().includes('manamanage'));
  if (hasManaManage) {
    log(`ManaManage account found in user accounts`);
  }
  
  let contacts = [];
  if (accountIds.length > 0 || salesforceAccountIds.length > 0) {
    // Build query to match by either account_id (UUID) or salesforce_account_id
    let contactsQuery = supabase
      .from('contacts')
      .select('id, email, first_name, last_name, account_id, salesforce_account_id, account_name')
      .not('email', 'is', null);
    
    // Match by account_id (UUID) if available
    if (accountIds.length > 0) {
      contactsQuery = contactsQuery.in('account_id', accountIds);
    }
    
    // Also match by salesforce_account_id if we have those
    // Note: Supabase doesn't support OR in a single query easily, so we'll do two queries and merge
    const contactsPromises = [];
    
    if (accountIds.length > 0) {
      contactsPromises.push(
        supabase
          .from('contacts')
          .select('id, email, first_name, last_name, account_id, salesforce_account_id, account_name')
          .in('account_id', accountIds)
          .not('email', 'is', null)
      );
    }
    
    if (salesforceAccountIds.length > 0) {
      contactsPromises.push(
        supabase
          .from('contacts')
          .select('id, email, first_name, last_name, account_id, salesforce_account_id, account_name')
          .in('salesforce_account_id', salesforceAccountIds)
          .not('email', 'is', null)
      );
    }
    
    const contactsResults = await Promise.all(contactsPromises);
    
    // Merge results and deduplicate by contact id
    const contactsMap = new Map();
    contactsResults.forEach(({ data: contactsData, error: contactsError }) => {
      if (contactsError) {
        logError('Error fetching contacts for calendar matching:', contactsError);
      } else if (contactsData) {
        contactsData.forEach(contact => {
          if (!contactsMap.has(contact.id)) {
            contactsMap.set(contact.id, contact);
          }
        });
      }
    });
    
    const allContacts = Array.from(contactsMap.values());
    
    if (allContacts.length > 0) {
      // Map contacts to include account info from userAccounts
      // Try matching by account_id first, then by salesforce_account_id (case-insensitive)
      contacts = allContacts.map(contact => {
        let userAccount = null;
        
        // First try UUID match
        if (contact.account_id) {
          userAccount = userAccounts.find(ua => ua.account_id === contact.account_id);
        }
        
        // If no UUID match, try Salesforce ID match (case-insensitive)
        if (!userAccount && contact.salesforce_account_id) {
          const contactSalesforceId = contact.salesforce_account_id.toLowerCase().trim();
          userAccount = userAccounts.find(ua => {
            const accountSalesforceId = ua.accounts?.salesforce_id?.toLowerCase().trim();
            return accountSalesforceId === contactSalesforceId;
          });
        }
        
        return {
          ...contact,
          accounts: userAccount?.accounts || null,
        };
      });
      
      // Log contacts that didn't match for debugging
      const unmatchedContacts = contacts.filter(contact => contact.accounts === null);
      if (unmatchedContacts.length > 0) {
        log(`Warning: ${unmatchedContacts.length} contacts found but not matched to user accounts:`);
        unmatchedContacts.slice(0, 5).forEach(contact => {
          log(`  - ${contact.email} (account_id: ${contact.account_id || 'null'}, salesforce_account_id: ${contact.salesforce_account_id})`);
        });
      }
      
      // Only include contacts that matched to an account
      contacts = contacts.filter(contact => contact.accounts !== null);
      
      log(`Found ${contacts.length} contacts for calendar matching (from ${allContacts.length} total contacts across ${accountIds.length} UUID accounts and ${salesforceAccountIds.length} Salesforce accounts)`);
      
      // Log sample of contact emails for debugging
      if (contacts.length > 0 && contacts.length <= 20) {
        const sampleEmails = contacts.map(c => c.email).filter(Boolean).slice(0, 10);
        log(`  Sample contact emails: ${sampleEmails.join(', ')}`);
      }
    } else {
      log(`No contacts found for calendar matching (accountIds: ${accountIds.length}, salesforceAccountIds: ${salesforceAccountIds.length})`);
      
      // If no contacts found by account, try to find contacts by email for debugging
      // This is a fallback to help identify if contacts exist but aren't linked properly
      if (salesforceAccountIds.length > 0) {
        log(`  Attempting fallback: checking for contacts with salesforce_account_id in [${salesforceAccountIds.slice(0, 3).join(', ')}...]`);
      }
    }
  } else {
    log('No account IDs found for calendar matching');
  }

  // Create email to account map (exact matches)
  const emailToAccountMap = new Map();
  // Create domain to account map (domain-based matches)
  const domainToAccountMap = new Map();
  
      log(`Building email maps from ${contacts.length} contacts`);
  contacts.forEach(contact => {
    if (contact.email && contact.accounts) {
      const email = contact.email.toLowerCase().trim();
      
      // Exact email matching
      if (!emailToAccountMap.has(email)) {
        emailToAccountMap.set(email, []);
      }
      emailToAccountMap.get(email).push({
        id: contact.accounts.id,
        salesforce_id: contact.accounts.salesforce_id,
        name: contact.accounts.name,
      });
      
      // Domain-based matching - extract domain from email
      try {
        const domain = email.split('@')[1];
        if (domain) {
          if (!domainToAccountMap.has(domain)) {
            domainToAccountMap.set(domain, []);
          }
          // Only add if not already in the array for this domain
          const existingAccounts = domainToAccountMap.get(domain);
          const alreadyExists = existingAccounts.some(acc => acc.id === contact.accounts.id);
          if (!alreadyExists) {
            domainToAccountMap.get(domain).push({
              id: contact.accounts.id,
              salesforce_id: contact.accounts.salesforce_id,
              name: contact.accounts.name,
            });
          }
        }
      } catch (e) {
        // Skip if email format is invalid
        logError('Invalid email format for domain extraction:', contact.email);
      }
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
      event.attendees.forEach((attendee) => {
        if (attendee.email) {
          const email = attendee.email.toLowerCase().trim();
          
          // First try exact email match (higher confidence)
          const matchedAccountsForEmail = emailToAccountMap.get(email);
          if (matchedAccountsForEmail && matchedAccountsForEmail.length > 0) {
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
          } else {
            // If no exact match, try domain-based matching (lower confidence)
            try {
              const attendeeDomain = email.split('@')[1];
              if (attendeeDomain) {
                const matchedAccountsForDomain = domainToAccountMap.get(attendeeDomain);
                if (matchedAccountsForDomain && matchedAccountsForDomain.length > 0) {
                  matchedAccountsForDomain.forEach(account => {
                    if (!matchedAccounts.has(account.id)) {
                      matchedAccounts.add(account.id);
                      matchReasons.push({
                        accountId: account.id,
                        accountName: account.name,
                        reason: `Attendee email domain ${attendeeDomain} matches contacts from ${account.name}`,
                        confidence: 'medium',
                      });
                    }
                  });
                }
              }
            } catch (e) {
              // Skip if email format is invalid
              logError('Invalid attendee email format for domain extraction:', attendee.email);
            }
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

