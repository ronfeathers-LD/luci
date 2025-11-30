/**
 * Account ChatBot Component
 * RAG-based chatbot for account-specific queries
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { LoaderIcon } from '../shared/Icons';
import { deduplicatedFetch, logError } from '../../lib/client-utils';

const AccountChatBot = ({ accountId, userId, accountName, salesforceAccountId, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasEmbeddings, setHasEmbeddings] = useState(null);
  const [generatingEmbeddings, setGeneratingEmbeddings] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if embeddings exist
  useEffect(() => {
    // accountId should be UUID, not Salesforce ID
    if (accountId && userId && isOpen) {
      // Only check if accountId looks like a UUID (has dashes)
      if (accountId.includes('-')) {
        checkEmbeddings();
      }
    }
  }, [accountId, userId, isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkEmbeddings = async () => {
    try {
      // Validate accountId is a UUID (not Salesforce ID)
      if (!accountId || !accountId.includes('-')) {
        logError('Invalid accountId format - expected UUID:', accountId);
        return;
      }

      const response = await deduplicatedFetch(
        `/api/account-embeddings?accountId=${accountId}&userId=${userId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setHasEmbeddings(data.hasEmbeddings);
      } else {
        const errorData = await response.json().catch(() => ({}));
        logError('Error checking embeddings:', errorData);
      }
    } catch (err) {
      logError('Error checking embeddings:', err);
    }
  };

  const generateEmbeddings = async () => {
    if (!accountId || !userId) return;

    // Validate accountId is a UUID (not Salesforce ID)
    if (!accountId.includes('-')) {
      addMessage('system', 'Error: Invalid account ID format. Please refresh the page.');
      logError('Invalid accountId format - expected UUID:', accountId);
      return;
    }

    setGeneratingEmbeddings(true);
    try {
      if (!salesforceAccountId) {
        throw new Error('Salesforce account ID is required');
      }

      // Fetch all account data
      const [contactsRes, casesRes, transcriptionsRes, sentimentRes] = await Promise.all([
        deduplicatedFetch(`/api/salesforce-contacts?salesforceAccountId=${salesforceAccountId}&accountId=${accountId}`).catch(() => null),
        deduplicatedFetch(`/api/salesforce-cases?salesforceAccountId=${salesforceAccountId}&accountId=${accountId}`).catch(() => null),
        deduplicatedFetch(`/api/avoma-transcription?salesforceAccountId=${salesforceAccountId}&accountId=${accountId}`).catch(() => null),
        deduplicatedFetch(`/api/sentiment-analysis?salesforceAccountId=${salesforceAccountId}&limit=10`).catch(() => null),
      ]);

      const contactsData = contactsRes?.ok ? await contactsRes.json() : {};
      const casesData = casesRes?.ok ? await casesRes.json() : {};
      const transcriptionsData = transcriptionsRes?.ok ? await transcriptionsRes.json() : {};
      const sentimentData = sentimentRes?.ok ? await sentimentRes.json() : {};

      const contacts = contactsData.contacts || [];
      const cases = casesData.cases || [];
      const transcriptions = transcriptionsData.transcriptions || [];
      const sentimentAnalyses = sentimentData.analyses || [];

      // Get account info - fetch from the account data we have
      // We'll use the accountName and other props, but structure it properly
      const account = {
        name: accountName,
        accountTier: null, // These would come from the account object if we had it
        contractValue: null,
        industry: null,
        annualRevenue: null,
        ownerName: null,
      };

      // Generate embeddings
      const response = await deduplicatedFetch('/api/account-embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          userId,
          data: {
            account,
            contacts,
            cases,
            transcriptions,
            sentimentAnalyses,
          },
        }),
      });

      if (response.ok) {
        await checkEmbeddings();
        addMessage('system', 'Embeddings generated successfully! You can now ask questions about this account.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate embeddings');
      }
    } catch (err) {
      logError('Error generating embeddings:', err);
      addMessage('system', `Error: ${err.message || 'Failed to generate embeddings'}`);
    } finally {
      setGeneratingEmbeddings(false);
    }
  };

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Validate accountId is a UUID (not Salesforce ID)
    if (!accountId || !accountId.includes('-')) {
      addMessage('system', 'Error: Invalid account ID. Please refresh the page.');
      logError('Invalid accountId format - expected UUID:', accountId);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setLoading(true);

    try {
      const response = await deduplicatedFetch('/api/account-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          userId,
          query: userMessage,
          messageHistory: messages.filter(m => m.role !== 'system'),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      addMessage('assistant', data.reply);
    } catch (err) {
      logError('Error sending message:', err);
      addMessage('assistant', `Sorry, I encountered an error: ${err.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-lean-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-50 border-2 border-lean-green"
        aria-label="Open chat"
      >
        <img 
          src="/luci.png" 
          alt="LUCI" 
          className="w-12 h-12 rounded-full object-cover"
        />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-lean-white rounded-lg shadow-2xl flex flex-col z-50 border border-lean-gray-light">
      {/* Header */}
      <div className="bg-lean-green text-lean-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/luci.png" 
            alt="LUCI" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">LUCI</h3>
            <p className="text-sm text-lean-white/80">{accountName}</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-lean-white hover:text-lean-white/80 transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {hasEmbeddings === false && (
          <div className="bg-lean-yellow/20 border border-lean-yellow rounded-lg p-4">
            <p className="text-sm text-lean-black mb-3">
              No embeddings found for this account. Generate embeddings to enable the chatbot.
            </p>
            <button
              onClick={generateEmbeddings}
              disabled={generatingEmbeddings}
              className="w-full bg-lean-green text-lean-white px-4 py-2 rounded-lg hover:bg-lean-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingEmbeddings ? (
                <span className="flex items-center justify-center">
                  <LoaderIcon className="w-4 h-4 mr-2" />
                  Generating...
                </span>
              ) : (
                'Generate Embeddings'
              )}
            </button>
          </div>
        )}

        {messages.length === 0 && hasEmbeddings !== false && (
          <div className="text-center text-lean-black-70 py-8">
            <p className="mb-2">Ask me anything about this account!</p>
            <p className="text-sm">I can help you understand contacts, cases, meetings, and sentiment analysis.</p>
          </div>
        )}

        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role !== 'user' && (
              <img 
                src="/luci.png" 
                alt="LUCI" 
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-lean-green text-lean-white'
                  : message.role === 'system'
                  ? 'bg-lean-gray-light text-lean-black'
                  : 'bg-lean-gray-light text-lean-black'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-lean-green flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      // Show fallback initials if image fails
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  className="w-8 h-8 rounded-full bg-lean-green flex items-center justify-center text-lean-white text-xs font-semibold"
                  style={{ display: user?.picture ? 'none' : 'flex' }}
                >
                  {user?.name 
                    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                    : user?.email 
                      ? user.email.substring(0, 2).toUpperCase()
                      : 'U'
                  }
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2 justify-start">
            <img 
              src="/luci.png" 
              alt="LUCI" 
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="bg-lean-gray-light rounded-lg px-4 py-2">
              <LoaderIcon className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-lean-gray-light p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this account..."
            className="flex-1 px-4 py-2 border border-lean-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green"
            disabled={loading || hasEmbeddings === false}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || hasEmbeddings === false}
            className="bg-lean-green text-lean-white px-4 py-2 rounded-lg hover:bg-lean-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountChatBot;

