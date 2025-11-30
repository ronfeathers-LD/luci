// System Settings Page Component for Admin
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../shared/Header';
import { LoaderIcon } from '../shared/Icons';
import { logError } from '../../lib/client-utils';

const SystemSettingsPage = ({ user, onSignOut }) => {
  const router = useRouter();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [integrationStatuses, setIntegrationStatuses] = useState({});
  const [activeTab, setActiveTab] = useState('cache');

  // Fetch all system settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/system-settings');
      if (!response.ok) {
        throw new Error('Failed to fetch system settings');
      }

      const data = await response.json();
      setSettings(data.settings || {});
    } catch (err) {
      logError('Error fetching system settings:', err);
      setError(err.message || 'Failed to load system settings. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch integration statuses
  const fetchIntegrationStatuses = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.append('integrationStatus', 'true');
      if (user?.id) {
        params.append('userId', user.id);
      }

      const response = await fetch(`/api/system-settings?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch integration statuses');
      }

      const data = await response.json();
      const statuses = data.statuses || {};

      // Transform the statuses to match our UI format
      const transformedStatuses = {};
      
      if (statuses.salesforce) {
        transformedStatuses.salesforce = {
          connected: statuses.salesforce.configured && statuses.salesforce.active && !statuses.salesforce.lastError,
          configured: statuses.salesforce.configured,
          active: statuses.salesforce.active,
          lastChecked: statuses.salesforce.lastTested || new Date().toISOString(),
          lastError: statuses.salesforce.lastError || null,
          error: statuses.salesforce.error || null,
        };
      }


      if (statuses.avoma) {
        transformedStatuses.avoma = {
          connected: statuses.avoma.configured && statuses.avoma.active && !statuses.avoma.lastError,
          configured: statuses.avoma.configured,
          active: statuses.avoma.active,
          lastChecked: statuses.avoma.lastTested || new Date().toISOString(),
          lastError: statuses.avoma.lastError || null,
          error: statuses.avoma.error || null,
        };
      }

      if (statuses.googleCalendar) {
        transformedStatuses.googleCalendar = {
          connected: statuses.googleCalendar.connected === true,
          configured: statuses.googleCalendar.configured,
          lastChecked: statuses.googleCalendar.lastChecked || new Date().toISOString(),
          error: statuses.googleCalendar.error,
        };
      }

      setIntegrationStatuses(transformedStatuses);
    } catch (err) {
      logError('Error fetching integration statuses:', err);
      // Set all to disconnected on error
      setIntegrationStatuses({
        salesforce: { connected: false, error: 'Failed to check status' },
        avoma: { connected: false, error: 'Failed to check status' },
        googleCalendar: { connected: false, error: 'Failed to check status' },
      });
    }
  }, [user]);

  // Load data on mount
  useEffect(() => {
    fetchSettings();
    fetchIntegrationStatuses();
  }, [fetchSettings, fetchIntegrationStatuses]);

  // Update a setting
  const updateSetting = useCallback(async (category, settingKey, value) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/system-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          settingKey,
          value,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to update setting');
      }

      // Update local state
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [settingKey]: {
            ...prev[category]?.[settingKey],
            value: value,
            updated_at: new Date().toISOString(),
          }
        }
      }));

      // Show success message briefly
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMsg.textContent = 'Setting updated successfully!';
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 2000);
    } catch (err) {
      logError('Error updating setting:', err);
      setError(err.message || 'Failed to update setting. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Get setting value helper
  const getSettingValue = (category, key, defaultValue) => {
    return settings[category]?.[key]?.value ?? defaultValue;
  };

  // Format value for display
  const formatValue = (value) => {
    if (typeof value === 'boolean') return value.toString();
    return value;
  };

  // Tabs configuration
  const tabs = [
    { id: 'cache', label: 'Performance & Caching', icon: '⚡' },
    { id: 'api_limits', label: 'API Limits', icon: '📊' },
    { id: 'rate_limiting', label: 'Rate Limiting', icon: '🚦' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'integration_configs', label: 'Integration Configs', icon: '🔑' },
    { id: 'ai', label: 'AI Settings', icon: '🤖' },
    { id: 'chatbot', label: 'Chatbot Prompts', icon: '💬' },
    { id: 'features', label: 'Feature Flags', icon: '🎛️' },
    { id: 'system', label: 'System Info', icon: 'ℹ️' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-lean-almost-white flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon className="w-8 h-8 animate-spin text-lean-green mx-auto mb-4" />
          <p className="text-lean-black-70">Loading system settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lean-almost-white flex flex-col">
      {/* Global Header */}
      <Header user={user} onSignOut={onSignOut} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="typography-heading text-lean-black">System Settings</h1>
              <button
                onClick={() => {
                  router.push('/admin');
                }}
                className="px-4 py-2 text-lean-black-70 hover:text-lean-black transition-colors"
              >
                ← Back to Admin
              </button>
            </div>
            <p className="text-sm text-lean-black-70">Configure system-wide settings and preferences</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-lean-white rounded-lg shadow-lg mb-6 overflow-hidden">
            <div className="border-b border-lean-black/10">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-lean-green border-b-2 border-lean-green bg-lean-green/5'
                        : 'text-lean-black-70 hover:text-lean-black hover:bg-lean-almost-white'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-lean-white rounded-lg shadow-lg p-6">
            {activeTab === 'cache' && (
              <CacheSettingsSection
                settings={settings.cache || {}}
                onUpdate={updateSetting}
                saving={saving}
              />
            )}

            {activeTab === 'api_limits' && (
              <ApiLimitsSection
                settings={settings.api_limits || {}}
                onUpdate={updateSetting}
                saving={saving}
              />
            )}

            {activeTab === 'rate_limiting' && (
              <RateLimitingSection
                settings={settings.rate_limiting || {}}
                onUpdate={updateSetting}
                saving={saving}
              />
            )}

            {activeTab === 'integrations' && (
              <IntegrationsSection
                statuses={integrationStatuses}
                onRefresh={fetchIntegrationStatuses}
              />
            )}

            {activeTab === 'integration_configs' && (
              <IntegrationConfigsSection
                user={user}
                onRefresh={fetchIntegrationStatuses}
              />
            )}

            {activeTab === 'ai' && (
              <AISettingsSection
                settings={settings.ai || {}}
                onUpdate={updateSetting}
                saving={saving}
              />
            )}

            {activeTab === 'features' && (
              <FeatureFlagsSection
                settings={settings.features || {}}
                onUpdate={updateSetting}
                saving={saving}
              />
            )}

            {activeTab === 'system' && (
              <SystemInfoSection />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Cache Settings Section Component
const CacheSettingsSection = ({ settings, onUpdate, saving }) => {
  const [localValues, setLocalValues] = useState({});
  
  const cacheSettings = [
    { key: 'ACCOUNTS', label: 'Accounts Cache', unit: 'hours', defaultValue: 1, description: 'How long to cache account data' },
    { key: 'CASES', label: 'Cases Cache', unit: 'hours', defaultValue: 1, description: 'How long to cache case data' },
    { key: 'CONTACTS', label: 'Contacts Cache', unit: 'hours', defaultValue: 24, description: 'How long to cache contact data' },
    { key: 'TRANSCRIPTIONS', label: 'Transcriptions Cache', unit: 'hours', defaultValue: 24, description: 'How long to cache transcription data' },
    { key: 'CALENDAR_EVENTS', label: 'Calendar Events Cache', unit: 'minutes', defaultValue: 15, description: 'How long to cache calendar event data' },
  ];

  const getValue = (key, defaultValue) => {
    if (localValues[key] !== undefined) {
      return localValues[key];
    }
    return settings[key]?.value ?? defaultValue;
  };

  const handleChange = (key, value) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleBlur = (category, key, value, defaultValue) => {
    const numValue = parseFloat(value) || defaultValue;
    setLocalValues(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    onUpdate(category, key, numValue);
  };

  const handleKeyDown = (e, category, key, value, defaultValue) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-lean-black mb-6">Performance & Caching Settings</h2>
      <p className="text-lean-black-70 mb-6">
        Configure cache time-to-live (TTL) values to balance performance and data freshness.
      </p>

      <div className="space-y-6">
        {cacheSettings.map((setting) => {
          const currentValue = getValue(setting.key, setting.defaultValue);
          return (
            <div key={setting.key} className="border border-lean-black/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-lean-black mb-1">
                    {setting.label}
                  </label>
                  <p className="text-xs text-lean-black-60 mb-3">{setting.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={currentValue}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  onBlur={(e) => handleBlur('cache', setting.key, e.target.value, setting.defaultValue)}
                  onKeyDown={(e) => handleKeyDown(e, 'cache', setting.key, currentValue, setting.defaultValue)}
                  disabled={saving}
                  className="w-32 px-3 py-2 border border-lean-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green focus:border-transparent disabled:opacity-50"
                />
                <span className="text-sm text-lean-black-70">{setting.unit}</span>
                {settings[setting.key]?.updated_at && (
                  <span className="text-xs text-lean-black-60 ml-auto">
                    Last updated: {new Date(settings[setting.key].updated_at).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// API Limits Section Component
const ApiLimitsSection = ({ settings, onUpdate, saving }) => {
  const [localValues, setLocalValues] = useState({});
  
  const apiLimitSettings = [
    { key: 'CASES_PER_ACCOUNT', label: 'Cases Per Account', defaultValue: 25, description: 'Maximum number of cases to fetch per account' },
    { key: 'CONTACTS_PER_ACCOUNT', label: 'Contacts Per Account', defaultValue: 100, description: 'Maximum number of contacts to fetch per account' },
    { key: 'ACCOUNTS_PER_USER', label: 'Accounts Per User', defaultValue: 1000, description: 'Maximum number of accounts per user' },
  ];

  const getValue = (key, defaultValue) => {
    if (localValues[key] !== undefined) {
      return localValues[key];
    }
    return settings[key]?.value ?? defaultValue;
  };

  const handleChange = (key, value) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleBlur = (category, key, value, defaultValue) => {
    const numValue = parseInt(value) || defaultValue;
    setLocalValues(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    onUpdate(category, key, numValue);
  };

  const handleKeyDown = (e, category, key, value, defaultValue) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-lean-black mb-6">API Limits</h2>
      <p className="text-lean-black-70 mb-6">
        Configure maximum limits for API requests to control resource usage.
      </p>

      <div className="space-y-6">
        {apiLimitSettings.map((setting) => {
          const currentValue = getValue(setting.key, setting.defaultValue);
          return (
            <div key={setting.key} className="border border-lean-black/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-lean-black mb-1">
                    {setting.label}
                  </label>
                  <p className="text-xs text-lean-black-60 mb-3">{setting.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  value={currentValue}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  onBlur={(e) => handleBlur('api_limits', setting.key, e.target.value, setting.defaultValue)}
                  onKeyDown={(e) => handleKeyDown(e, 'api_limits', setting.key, currentValue, setting.defaultValue)}
                  disabled={saving}
                  className="w-32 px-3 py-2 border border-lean-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green focus:border-transparent disabled:opacity-50"
                />
                {settings[setting.key]?.updated_at && (
                  <span className="text-xs text-lean-black-60 ml-auto">
                    Last updated: {new Date(settings[setting.key].updated_at).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Rate Limiting Section Component
const RateLimitingSection = ({ settings, onUpdate, saving }) => {
  const [localValues, setLocalValues] = useState({});
  
  const rateLimitSettings = [
    { key: 'WINDOW_MS', label: 'Rate Limit Window', unit: 'milliseconds', defaultValue: 60000, description: 'Time window for rate limiting (60000 = 1 minute)' },
    { key: 'MAX_REQUESTS', label: 'Max Requests Per Window', defaultValue: 10, description: 'Maximum requests allowed per window per IP address' },
  ];

  const getValue = (key, defaultValue) => {
    if (localValues[key] !== undefined) {
      return localValues[key];
    }
    return settings[key]?.value ?? defaultValue;
  };

  const handleChange = (key, value) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleBlur = (category, key, value, defaultValue) => {
    const numValue = parseInt(value) || defaultValue;
    setLocalValues(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    onUpdate(category, key, numValue);
  };

  const handleKeyDown = (e, category, key, value, defaultValue) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-lean-black mb-6">Rate Limiting</h2>
      <p className="text-lean-black-70 mb-6">
        Configure rate limiting to prevent API abuse and ensure fair resource usage.
      </p>

      <div className="space-y-6">
        {rateLimitSettings.map((setting) => {
          const currentValue = getValue(setting.key, setting.defaultValue);
          return (
            <div key={setting.key} className="border border-lean-black/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-lean-black mb-1">
                    {setting.label}
                  </label>
                  <p className="text-xs text-lean-black-60 mb-3">{setting.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  value={currentValue}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  onBlur={(e) => handleBlur('rate_limiting', setting.key, e.target.value, setting.defaultValue)}
                  onKeyDown={(e) => handleKeyDown(e, 'rate_limiting', setting.key, currentValue, setting.defaultValue)}
                  disabled={saving}
                  className="w-32 px-3 py-2 border border-lean-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green focus:border-transparent disabled:opacity-50"
                />
                {setting.unit && <span className="text-sm text-lean-black-70">{setting.unit}</span>}
                {settings[setting.key]?.updated_at && (
                  <span className="text-xs text-lean-black-60 ml-auto">
                    Last updated: {new Date(settings[setting.key].updated_at).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Integrations Section Component
const IntegrationsSection = ({ statuses, onRefresh }) => {
  const integrations = [
    { 
      id: 'salesforce', 
      name: 'Salesforce', 
      description: 'Customer relationship management and account data',
      icon: '📊'
    },
    { 
      id: 'avoma', 
      name: 'Avoma', 
      description: 'Meeting transcriptions and recordings',
      icon: '🎤'
    },
    { 
      id: 'googleCalendar', 
      name: 'Google Calendar', 
      description: 'Calendar events and meeting scheduling',
      icon: '📅'
    },
  ];

  const getStatusBadge = (status) => {
    if (!status) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">Unknown</span>;
    }
    
    // Check if there's an authentication error
    const hasAuthError = status.error && (
      status.error.includes('401') || 
      status.error.includes('Unauthorized') ||
      status.error.includes('Unauthenticated') ||
      status.lastError?.includes('401') ||
      status.lastError?.includes('Unauthorized')
    );
    
    if (hasAuthError) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">Auth Error</span>;
    }
    
    if (status.connected && status.configured) {
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Connected</span>;
    }
    
    if (status.configured && !status.connected) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Configured</span>;
    }
    
    return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Not Configured</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-lean-black">Integration Status</h2>
          <p className="text-lean-black-70 mt-1">
            Monitor integration health and connection status
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-lean-green text-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
        >
          Refresh Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const status = statuses[integration.id];
          return (
            <div key={integration.id} className="border border-lean-black/10 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lean-black">{integration.name}</h3>
                    <p className="text-sm text-lean-black-60">{integration.description}</p>
                  </div>
                </div>
                {getStatusBadge(status)}
              </div>
              {status?.lastChecked && (
                <p className="text-xs text-lean-black-60">
                  Last checked: {new Date(status.lastChecked).toLocaleString()}
                </p>
              )}
              {status?.lastError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                  <p className="text-red-700 font-semibold mb-1">Last Error:</p>
                  <p className="text-red-600">{status.lastError}</p>
                </div>
              )}
              {status?.error && !status.lastError && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <p className="text-yellow-700 font-semibold mb-1">Error:</p>
                  <p className="text-yellow-600">{status.error}</p>
                </div>
              )}
              {status?.configured && !status?.active && (
                <p className="text-xs text-yellow-600 mt-2">Configuration exists but is not active</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// AI Settings Section Component
const AISettingsSection = ({ settings, onUpdate, saving }) => {
  const [localValues, setLocalValues] = useState({});
  
  const aiSettings = [
    { 
      key: 'GEMINI_MODEL', 
      label: 'Gemini Model', 
      type: 'text',
      defaultValue: 'auto', 
      description: 'Model to use (auto = auto-discover best available model)',
      options: ['auto', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro']
    },
    { 
      key: 'GEMINI_API_TIMEOUT_MS', 
      label: 'API Timeout', 
      type: 'number',
      unit: 'milliseconds',
      defaultValue: 45000, 
      description: 'Timeout for Gemini API requests (45000 = 45 seconds)' 
    },
    { 
      key: 'SKIP_MODEL_DISCOVERY', 
      label: 'Skip Model Discovery', 
      type: 'boolean',
      defaultValue: false, 
      description: 'Skip auto-discovery and use specified model directly' 
    },
  ];

  const getValue = (key, defaultValue) => {
    if (localValues[key] !== undefined) {
      return localValues[key];
    }
    return settings[key]?.value ?? defaultValue;
  };

  const handleChange = (key, value) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleBlur = (category, key, value, defaultValue) => {
    if (typeof defaultValue === 'number') {
      const numValue = parseInt(value) || defaultValue;
      setLocalValues(prev => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
      onUpdate(category, key, numValue);
    }
  };

  const handleKeyDown = (e, category, key, value, defaultValue) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-lean-black mb-6">AI/Gemini Settings</h2>
      <p className="text-lean-black-70 mb-6">
        Configure AI model selection and API settings for sentiment analysis.
      </p>

      <div className="space-y-6">
        {aiSettings.map((setting) => {
          const currentValue = getValue(setting.key, setting.defaultValue);
          
          if (setting.type === 'boolean') {
            return (
              <div key={setting.key} className="border border-lean-black/10 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-lean-black mb-1">
                      {setting.label}
                    </label>
                    <p className="text-xs text-lean-black-60">{setting.description}</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentValue === true || currentValue === 'true'}
                      onChange={(e) => {
                        onUpdate('ai', setting.key, e.target.checked);
                      }}
                      disabled={saving}
                      className="w-4 h-4 text-lean-green rounded border-lean-black/20 focus:ring-lean-green disabled:opacity-50"
                    />
                  </label>
                </div>
              </div>
            );
          }

          if (setting.options) {
            return (
              <div key={setting.key} className="border border-lean-black/10 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-lean-black mb-1">
                      {setting.label}
                    </label>
                    <p className="text-xs text-lean-black-60 mb-3">{setting.description}</p>
                  </div>
                </div>
                <select
                  value={currentValue}
                  onChange={(e) => {
                    onUpdate('ai', setting.key, e.target.value);
                  }}
                  disabled={saving}
                  className="w-full max-w-md px-3 py-2 border border-lean-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green focus:border-transparent disabled:opacity-50"
                >
                  {setting.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={setting.key} className="border border-lean-black/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-lean-black mb-1">
                    {setting.label}
                  </label>
                  <p className="text-xs text-lean-black-60 mb-3">{setting.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  value={currentValue}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  onBlur={(e) => handleBlur('ai', setting.key, e.target.value, setting.defaultValue)}
                  onKeyDown={(e) => handleKeyDown(e, 'ai', setting.key, currentValue, setting.defaultValue)}
                  disabled={saving}
                  className="w-32 px-3 py-2 border border-lean-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green focus:border-transparent disabled:opacity-50"
                />
                {setting.unit && <span className="text-sm text-lean-black-70">{setting.unit}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Feature Flags Section Component
const FeatureFlagsSection = ({ settings, onUpdate, saving }) => {
  const featureFlags = [
    { 
      key: 'ENABLE_AVOMA_TRANSCRIPTIONS', 
      label: 'Avoma Transcriptions', 
      defaultValue: true, 
      description: 'Enable Avoma transcription integration' 
    },
    { 
      key: 'ENABLE_GOOGLE_CALENDAR', 
      label: 'Google Calendar', 
      defaultValue: true, 
      description: 'Enable Google Calendar integration' 
    },
    { 
      key: 'ENABLE_SENTIMENT_ANALYSIS', 
      label: 'Sentiment Analysis', 
      defaultValue: true, 
      description: 'Enable sentiment analysis feature' 
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-lean-black mb-6">Feature Flags</h2>
      <p className="text-lean-black-70 mb-6">
        Enable or disable specific features system-wide.
      </p>

      <div className="space-y-4">
        {featureFlags.map((flag) => {
          const currentValue = settings[flag.key]?.value ?? flag.defaultValue;
          const isEnabled = currentValue === true || currentValue === 'true';
          
          return (
            <div key={flag.key} className="border border-lean-black/10 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-lean-black mb-1">
                    {flag.label}
                  </label>
                  <p className="text-xs text-lean-black-60">{flag.description}</p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => {
                      onUpdate('features', flag.key, e.target.checked);
                    }}
                    disabled={saving}
                    className="w-4 h-4 text-lean-green rounded border-lean-black/20 focus:ring-lean-green disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-lean-black-70">
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// System Info Section Component
const SystemInfoSection = () => {
  const [systemInfo, setSystemInfo] = useState({
    environment: 'production',
    nodeVersion: '',
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    // Set environment based on window location
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const env = hostname.includes('localhost') 
      ? 'development' 
      : hostname.includes('vercel.app') 
        ? 'staging' 
        : 'production';
    
    setSystemInfo(prev => ({
      ...prev,
      environment: env,
      timestamp: new Date().toISOString(),
    }));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-lean-black mb-6">System Information</h2>
      <p className="text-lean-black-70 mb-6">
        View system environment and deployment information.
      </p>

      <div className="space-y-4">
        <div className="border border-lean-black/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-lean-black">Environment</span>
            <span className="text-sm text-lean-black-70 capitalize">{systemInfo.environment}</span>
          </div>
        </div>
        
        <div className="border border-lean-black/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-lean-black">Hostname</span>
            <span className="text-sm text-lean-black-70">{typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</span>
          </div>
        </div>

        <div className="border border-lean-black/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-lean-black">Current Time</span>
            <span className="text-sm text-lean-black-70">{new Date().toLocaleString()}</span>
          </div>
        </div>

        <div className="border border-lean-black/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-lean-black">User Agent</span>
            <span className="text-sm text-lean-black-70 truncate max-w-md" title={navigator.userAgent}>
              {navigator.userAgent.substring(0, 50)}...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Integration Configs Section Component
const IntegrationConfigsSection = ({ user, onRefresh }) => {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [testing, setTesting] = useState({});
  const [errors, setErrors] = useState({});
  const [localValues, setLocalValues] = useState({});

  const integrations = [
    {
      id: 'avoma',
      name: 'Avoma',
      description: 'Meeting transcriptions and recordings',
      icon: '🎤',
      fields: [
        { key: 'api_key', label: 'API Key', type: 'password', required: true },
        { key: 'api_url', label: 'API URL', type: 'text', required: false, defaultValue: 'https://api.avoma.com/v1' },
      ],
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Customer relationship management and account data',
      icon: '📊',
      fields: [
        { key: 'username', label: 'Username', type: 'text', required: true },
        { key: 'password', label: 'Password', type: 'password', required: true },
        { key: 'security_token', label: 'Security Token', type: 'password', required: false },
        { key: 'login_url', label: 'Login URL', type: 'text', required: false, defaultValue: 'https://login.salesforce.com' },
      ],
    },
  ];

  // Fetch all integration configs
  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      setErrors({});
      
      const response = await fetch('/api/system-settings?integrationConfigs=true');
      if (!response.ok) {
        throw new Error('Failed to fetch integration configs');
      }

      const data = await response.json();
      setConfigs(data.configs || {});
    } catch (err) {
      logError('Error fetching integration configs:', err);
      setErrors({ general: err.message || 'Failed to load integration configs' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  // Get current value for a field (from config or local state)
  const getFieldValue = (integrationId, fieldKey, defaultValue = '') => {
    const localKey = `${integrationId}_${fieldKey}`;
    if (localValues[localKey] !== undefined) {
      return localValues[localKey];
    }
    
    const config = configs[integrationId];
    if (config) {
      // Check for masked values first
      const maskedKey = `${fieldKey}_masked`;
      if (config[maskedKey]) {
        return ''; // Return empty to show placeholder for masked values
      }
      return config[fieldKey] || defaultValue;
    }
    
    return defaultValue;
  };

  // Handle field change
  const handleFieldChange = (integrationId, fieldKey, value) => {
    const localKey = `${integrationId}_${fieldKey}`;
    setLocalValues(prev => ({ ...prev, [localKey]: value }));
    // Clear error for this field
    const errorKey = `${integrationId}_${fieldKey}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Save integration config
  const saveConfig = async (integrationId) => {
    try {
      setSaving(prev => ({ ...prev, [integrationId]: true }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[integrationId];
        return newErrors;
      });

      const integration = integrations.find(i => i.id === integrationId);
      const config = { id: configs[integrationId]?.id };
      let hasChanges = false;

      // Build config object from form values
      integration.fields.forEach(field => {
        const localKey = `${integrationId}_${field.key}`;
        const value = localValues[localKey];
        
        if (value !== undefined && value !== '') {
          config[field.key] = value;
          hasChanges = true;
        } else if (!configs[integrationId]) {
          // For new configs, use default values
          if (field.defaultValue !== undefined) {
            config[field.key] = field.defaultValue;
            hasChanges = true;
          }
        }
      });

      if (!hasChanges && configs[integrationId]) {
        setSaving(prev => ({ ...prev, [integrationId]: false }));
        return; // No changes to save
      }

      const response = await fetch('/api/system-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateIntegrationConfig',
          type: integrationId,
          config,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to save configuration');
      }

      // Clear local values and refresh configs
      const newLocalValues = { ...localValues };
      integration.fields.forEach(field => {
        delete newLocalValues[`${integrationId}_${field.key}`];
      });
      setLocalValues(newLocalValues);

      await fetchConfigs();
      if (onRefresh) {
        onRefresh();
      }

      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMsg.textContent = `${integration.name} configuration saved successfully!`;
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
    } catch (err) {
      logError(`Error saving ${integrationId} config:`, err);
      setErrors(prev => ({
        ...prev,
        [integrationId]: err.message || 'Failed to save configuration',
      }));
    } finally {
      setSaving(prev => ({ ...prev, [integrationId]: false }));
    }
  };

  // Test integration connection
  const testConnection = async (integrationId) => {
    try {
      setTesting(prev => ({ ...prev, [integrationId]: true }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${integrationId}_test`];
        return newErrors;
      });

      const response = await fetch('/api/system-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'testIntegration',
          type: integrationId,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Connection test failed');
      }

      const data = await response.json();
      await fetchConfigs();
      if (onRefresh) {
        onRefresh();
      }

      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMsg.textContent = data.message || 'Connection test successful!';
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
    } catch (err) {
      logError(`Error testing ${integrationId} connection:`, err);
      setErrors(prev => ({
        ...prev,
        [`${integrationId}_test`]: err.message || 'Connection test failed',
      }));
    } finally {
      setTesting(prev => ({ ...prev, [integrationId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderIcon className="w-8 h-8 animate-spin text-lean-green mx-auto mb-4" />
        <p className="text-lean-black-70">Loading integration configurations...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-lean-black">Integration Configuration</h2>
        <p className="text-lean-black-70 mt-1">
          Manage API keys and configuration settings for each integration
        </p>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <div className="space-y-6">
        {integrations.map((integration) => {
          const config = configs[integration.id];
          const isConfigured = !!config;
          const isSaving = saving[integration.id];
          const isTesting = testing[integration.id];
          const integrationError = errors[integration.id];
          const testError = errors[`${integration.id}_test`];
          const isDisabled = integration.disabled === true;

          return (
            <div key={integration.id} className={`border border-lean-black/10 rounded-lg p-6 ${isDisabled ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lean-black">{integration.name}</h3>
                    <p className="text-sm text-lean-black-60">{integration.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {isDisabled && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      Disabled
                    </span>
                  )}
                  {!isDisabled && isConfigured && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      Configured
                    </span>
                  )}
                </div>
              </div>

              {isDisabled && integration.disabledReason && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <p className="text-yellow-800 font-semibold mb-1">⚠️ Limited Functionality</p>
                  <p className="text-yellow-700">{integration.disabledReason}</p>
                </div>
              )}

              {integrationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {integrationError}
                </div>
              )}

              {testError && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                  <strong>Test Error:</strong> {testError}
                </div>
              )}

              <div className={`space-y-4 ${isDisabled ? 'pointer-events-none' : ''}`}>
                {integration.fields.map((field) => {
                  const fieldValue = getFieldValue(integration.id, field.key, field.defaultValue || '');
                  const fieldError = errors[`${integration.id}_${field.key}`];
                  const isMasked = config && config[`${field.key}_masked`] && !localValues[`${integration.id}_${field.key}`];

                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-semibold text-lean-black mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <input
                        type={field.type === 'password' ? 'password' : 'text'}
                        value={fieldValue}
                        onChange={(e) => handleFieldChange(integration.id, field.key, e.target.value)}
                        placeholder={isMasked ? '•••••••• (configured)' : field.defaultValue || `Enter ${field.label.toLowerCase()}`}
                        disabled={isSaving}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green focus:border-transparent disabled:opacity-50 ${
                          fieldError ? 'border-red-300' : 'border-lean-black/20'
                        }`}
                      />
                      {fieldError && (
                        <p className="mt-1 text-xs text-red-600">{fieldError}</p>
                      )}
                      {field.defaultValue && !isConfigured && (
                        <p className="mt-1 text-xs text-lean-black-60">Default: {field.defaultValue}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-lean-black/10">
                <button
                  onClick={() => saveConfig(integration.id)}
                  disabled={isSaving || isTesting || isDisabled}
                  className="px-4 py-2 bg-lean-green text-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
                {isConfigured && !isDisabled && (
                  <button
                    onClick={() => testConnection(integration.id)}
                    disabled={isSaving || isTesting}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </button>
                )}
                {config?.last_tested && (
                  <span className="text-xs text-lean-black-60 ml-auto">
                    Last tested: {new Date(config.last_tested).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Chatbot Prompts Section Component
const ChatbotPromptsSection = ({ settings, onUpdate, saving }) => {
  const [localValues, setLocalValues] = useState({});
  const [expandedSection, setExpandedSection] = useState(null);

  const getValue = (key, defaultValue = '') => {
    if (localValues[`PROMPT_BASE_${key}`] !== undefined) {
      return localValues[`PROMPT_BASE_${key}`];
    }
    if (localValues[`PROMPT_TEMPLATE_${key}`] !== undefined) {
      return localValues[`PROMPT_TEMPLATE_${key}`];
    }
    // Handle nested JSONB structure
    if (settings.PROMPT_BASE?.value && typeof settings.PROMPT_BASE.value === 'object') {
      return settings.PROMPT_BASE.value[key] || defaultValue;
    }
    if (settings.PROMPT_TEMPLATE?.value && typeof settings.PROMPT_TEMPLATE.value === 'object') {
      return settings.PROMPT_TEMPLATE.value[key] || defaultValue;
    }
    return defaultValue;
  };

  const handleChange = (key, value, parentKey = 'PROMPT_BASE') => {
    setLocalValues(prev => ({
      ...prev,
      [`${parentKey}_${key}`]: value,
    }));
  };

  const handleSave = async (parentKey, key, value) => {
    // Get current value from settings
    const currentSetting = settings[parentKey];
    if (!currentSetting) return;

    // Update the nested JSONB value
    const currentValue = currentSetting.value || {};
    const updatedValue = {
      ...currentValue,
      [key]: value,
    };

    await onUpdate('chatbot', parentKey, updatedValue);
    
    // Clear local value after save
    setLocalValues(prev => {
      const newState = { ...prev };
      delete newState[`${parentKey}_${key}`];
      return newState;
    });
  };

  const promptSections = [
    {
      id: 'base',
      title: 'Base Prompt Components',
      description: 'Core prompt elements that are combined to create the full prompt',
      fields: [
        { key: 'intro', label: 'Introduction', type: 'textarea', parentKey: 'PROMPT_BASE', 
          defaultValue: 'You are LUCI, an AI assistant helping {role_type} work with the {account_name} account.',
          description: 'Opening line of the prompt. Use {role_type} and {account_name} as variables.' },
        { key: 'role_guidance_csm', label: 'CSM Role Guidance', type: 'textarea', parentKey: 'PROMPT_BASE',
          defaultValue: '**Your Role: Customer Success Manager (CSM)**\nYour primary focus is ensuring customer satisfaction, retention, and growth.',
          description: 'Guidance text shown to Customer Success Managers' },
        { key: 'role_guidance_am', label: 'Account Manager Role Guidance', type: 'textarea', parentKey: 'PROMPT_BASE',
          defaultValue: '**Your Role: Account Manager (Sales)**\nYour primary focus is building relationships, driving revenue, and managing the sales cycle.',
          description: 'Guidance text shown to Account Managers' },
        { key: 'response_style', label: 'Response Style Guidelines', type: 'textarea', parentKey: 'PROMPT_BASE',
          defaultValue: '1. **Be Proactive & Actionable**: Don\'t just report data - provide specific next steps\n2. **Daily Activities**: When asked about daily activities, provide a prioritized list...',
          description: 'Instructions on how LUCI should respond. Use {role_specific_guidance} as a variable.' },
        { key: 'role_specific_csm', label: 'CSM-Specific Guidance', type: 'textarea', parentKey: 'PROMPT_BASE',
          defaultValue: '- Focus on customer health, satisfaction, and retention\n- Identify at-risk accounts...',
          description: 'Specific guidance for CSM role' },
        { key: 'role_specific_am', label: 'Account Manager-Specific Guidance', type: 'textarea', parentKey: 'PROMPT_BASE',
          defaultValue: '- Focus on relationship building and revenue opportunities\n- Identify decision-makers...',
          description: 'Specific guidance for Account Manager role' },
      ],
    },
    {
      id: 'template',
      title: 'Prompt Template',
      description: 'Template that combines base components with dynamic data. Available variables: {intro}, {role_guidance}, {context}, {data_type_totals}, {data_type_counts}, {health_indicators}, {response_style}, {role_type}, {account_name}',
      fields: [
        { key: 'intro', label: 'Full Prompt Template', type: 'textarea', parentKey: 'PROMPT_TEMPLATE',
          defaultValue: '{intro}\n\n{role_guidance}\n\n**Account Context:**\n{context}\n\n...',
          description: 'Complete prompt template with variable placeholders' },
      ],
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-lean-black mb-6">Chatbot Prompts</h2>
      <p className="text-lean-black-70 mb-6">
        Manage LUCI's system prompts. Changes take effect immediately for new chat sessions.
      </p>

      {promptSections.map((section) => (
        <div key={section.id} className="mb-8 border border-lean-gray-light rounded-lg p-6">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
          >
            <div>
              <h3 className="text-xl font-semibold text-lean-black mb-2">{section.title}</h3>
              <p className="text-sm text-lean-black-70">{section.description}</p>
            </div>
            <svg 
              className={`w-5 h-5 text-lean-black-70 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {expandedSection === section.id && (
            <div className="mt-6 space-y-6">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-lean-black mb-2">
                    {field.label}
                  </label>
                  {field.description && (
                    <p className="text-xs text-lean-black-60 mb-2">{field.description}</p>
                  )}
                  {field.type === 'textarea' ? (
                    <textarea
                      value={getValue(field.key, field.defaultValue)}
                      onChange={(e) => handleChange(field.key, e.target.value, field.parentKey)}
                      onBlur={() => {
                        const value = getValue(field.key, field.defaultValue);
                        handleSave(field.parentKey, field.key, value);
                      }}
                      className="w-full h-48 px-3 py-2 border border-lean-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green text-sm font-mono"
                      disabled={saving}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={getValue(field.key, field.defaultValue)}
                      onChange={(e) => handleChange(field.key, e.target.value, field.parentKey)}
                      onBlur={() => {
                        const value = getValue(field.key, field.defaultValue);
                        handleSave(field.parentKey, field.key, value);
                      }}
                      className="w-full px-3 py-2 border border-lean-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green"
                      disabled={saving}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="mt-6 p-4 bg-lean-yellow/20 border border-lean-yellow rounded-lg">
        <p className="text-sm text-lean-black">
          <strong>Note:</strong> Changes to prompts take effect immediately for new chat sessions. 
          Existing chat sessions will continue using the prompt that was active when they started.
        </p>
      </div>
    </div>
  );
};

export default SystemSettingsPage;

