// All Analyses Page Component - Shows all cached sentiment analyses
const { useState, useEffect, useCallback, useMemo } = React;

const AllAnalysesPage = ({ user, onSignOut }) => {
  const [analyses, setAnalyses] = useState([]);
  const [groupedAnalyses, setGroupedAnalyses] = useState({});
  const [expandedAccounts, setExpandedAccounts] = useState(new Set());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ limit: 50, offset: 0, total: 0 });
  const [filters, setFilters] = useState({ days: 365, accountId: '', cached: '' });

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
        days: filters.days.toString(),
        all: 'true', // Admin view flag
      });
      
      if (filters.accountId) {
        params.append('accountId', filters.accountId);
      }
      
      if (filters.cached === 'true') {
        params.append('cached', 'true');
      }
      
      const response = await (window.deduplicatedFetch || fetch)(`/api/sentiment-history?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analyses');
      }
      
      const data = await response.json();
      const fetchedAnalyses = data.analyses || [];
      setAnalyses(fetchedAnalyses);
      setStats(data.stats || null);
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
      
      // Group analyses by account - optimized single pass
      const grouped = {};
      fetchedAnalyses.forEach(analysis => {
        const accountKey = analysis.account_id || analysis.salesforce_account_id || 'unknown';
        const accountName = analysis.accounts?.name || analysis.customer_identifier || analysis.salesforce_account_id || 'Unknown Account';
        
        if (!grouped[accountKey]) {
          grouped[accountKey] = {
            accountId: accountKey,
            accountName: accountName,
            salesforceId: analysis.salesforce_account_id,
            analyses: []
          };
        }
        grouped[accountKey].analyses.push(analysis);
      });
      
      // Sort analyses within each group by date (newest first) - optimized
      const sortedGrouped = {};
      Object.keys(grouped).forEach(key => {
        sortedGrouped[key] = {
          ...grouped[key],
          analyses: grouped[key].analyses.sort((a, b) => new Date(b.analyzed_at) - new Date(a.analyzed_at))
        };
      });
      
      setGroupedAnalyses(sortedGrouped);
      
      // Auto-expand all accounts by default
      const accountKeys = Object.keys(sortedGrouped);
      setExpandedAccounts(new Set(accountKeys));
    } catch (err) {
      window.logError('Error fetching analyses:', err);
      setError(err.message || 'Failed to load analyses');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, pagination.offset, filters]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const getScoreColor = (score) => {
    if (score <= 4) return 'text-red-600 bg-red-50 border-red-200';
    if (score <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-lean-green bg-lean-green-10 border-lean-green/20';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handlePrevPage = () => {
    if (pagination.offset > 0) {
      setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }));
    }
  };

  const handleNextPage = () => {
    if (pagination.offset + pagination.limit < pagination.total) {
      setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }));
    }
  };

  const toggleAccount = (accountKey) => {
    setExpandedAccounts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountKey)) {
        newSet.delete(accountKey);
      } else {
        newSet.add(accountKey);
      }
      return newSet;
    });
  };

  const toggleAllAccounts = () => {
    const accountKeys = Object.keys(groupedAnalyses);
    if (expandedAccounts.size === accountKeys.length) {
      setExpandedAccounts(new Set());
    } else {
      setExpandedAccounts(new Set(accountKeys));
    }
  };

  return (
    <div className="min-h-screen bg-lean-almost-white flex flex-col">
      {/* Global Header */}
      <window.Header user={user} onSignOut={onSignOut} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="typography-heading text-lean-black mb-2">All Sentiment Analyses</h1>
            <p className="text-sm text-lean-black-70">View all cached sentiment analysis results</p>
          </div>
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-lean-white rounded-lg shadow-md p-4">
                <div className="text-sm text-lean-black-70 mb-1">Total Analyses</div>
                <div className="text-2xl font-bold text-lean-black">{stats.total}</div>
              </div>
              <div className="bg-lean-white rounded-lg shadow-md p-4">
                <div className="text-sm text-lean-black-70 mb-1">Cached</div>
                <div className="text-2xl font-bold text-lean-black">{stats.cached}</div>
              </div>
              <div className="bg-lean-white rounded-lg shadow-md p-4">
                <div className="text-sm text-lean-black-70 mb-1">Unique</div>
                <div className="text-2xl font-bold text-lean-black">{stats.unique}</div>
              </div>
              <div className="bg-lean-white rounded-lg shadow-md p-4">
                <div className="text-sm text-lean-black-70 mb-1">Avg Score</div>
                <div className="text-2xl font-bold text-lean-black">{stats.averageScore.toFixed(1)}</div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-lean-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-lean-black mb-2">Days Back</label>
                <select
                  value={filters.days}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, days: e.target.value }));
                    setPagination(prev => ({ ...prev, offset: 0 }));
                  }}
                  className="w-full px-3 py-2 border border-lean-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                  <option value="730">Last 2 years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-lean-black mb-2">Show Cached Only</label>
                <select
                  value={filters.cached}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, cached: e.target.value }));
                    setPagination(prev => ({ ...prev, offset: 0 }));
                  }}
                  className="w-full px-3 py-2 border border-lean-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green"
                >
                  <option value="">All</option>
                  <option value="true">Cached Only</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={fetchAnalyses}
                  className="mt-6 px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-lean-white rounded-lg shadow-md p-8 text-center">
              <window.LoaderIcon className="w-8 h-8 animate-spin text-lean-green mx-auto mb-4" />
              <p className="text-lean-black-70">Loading analyses...</p>
            </div>
          )}

          {/* Grouped Analyses by Account */}
          {!loading && !error && (
            <>
              {Object.keys(groupedAnalyses).length === 0 ? (
                <div className="bg-lean-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-lean-black-70">No analyses found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Header with expand/collapse all */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-lean-black">
                      {Object.keys(groupedAnalyses).length} Account{Object.keys(groupedAnalyses).length !== 1 ? 's' : ''}
                    </h2>
                    <button
                      onClick={toggleAllAccounts}
                      className="text-sm text-lean-green hover:text-lean-green/80 underline font-medium"
                    >
                      {expandedAccounts.size === Object.keys(groupedAnalyses).length ? 'Collapse All' : 'Expand All'}
                    </button>
                  </div>

                  {/* Account Groups */}
                  {Object.values(groupedAnalyses)
                    .sort((a, b) => a.accountName.localeCompare(b.accountName))
                    .map((accountGroup) => {
                      const isExpanded = expandedAccounts.has(accountGroup.accountId);
                      const avgScore = accountGroup.analyses.reduce((sum, a) => sum + a.score, 0) / accountGroup.analyses.length;
                      
                      return (
                        <div key={accountGroup.accountId} className="bg-lean-white rounded-lg shadow-md overflow-hidden">
                          {/* Account Header */}
                          <button
                            onClick={() => toggleAccount(accountGroup.accountId)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-lean-almost-white transition-colors text-left"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <svg
                                className={`w-5 h-5 text-lean-black-70 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-base font-semibold text-lean-black">{accountGroup.accountName}</h3>
                                  <span className="text-xs text-lean-black-70">
                                    {accountGroup.analyses.length} analysis{accountGroup.analyses.length !== 1 ? 'es' : ''}
                                  </span>
                                </div>
                                {accountGroup.salesforceId && (
                                  <p className="text-xs text-lean-black-70 mt-1">SF: {accountGroup.salesforceId}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="text-xs text-lean-black-70">Avg Score</div>
                                  <span className={`px-2 py-1 rounded text-sm font-semibold ${getScoreColor(Math.round(avgScore))}`}>
                                    {avgScore.toFixed(1)}/10
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>

                          {/* Analyses Table for this Account */}
                          {isExpanded && (
                            <div className="border-t border-lean-black/10">
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-lean-black/10">
                                  <thead className="bg-lean-almost-white">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-lean-black-70 uppercase tracking-wider">Date</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-lean-black-70 uppercase tracking-wider">Score</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-lean-black-70 uppercase tracking-wider">Summary</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-lean-black-70 uppercase tracking-wider">Data Sources</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-lean-black-70 uppercase tracking-wider">Cached</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-lean-white divide-y divide-lean-black/10">
                                    {accountGroup.analyses.map((analysis) => (
                                      <tr key={analysis.id} className="hover:bg-lean-almost-white">
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-lean-black-70">
                                          {formatDate(analysis.analyzed_at)}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                          <span className={`px-2 py-1 rounded text-sm font-semibold ${getScoreColor(analysis.score)}`}>
                                            {analysis.score}/10
                                          </span>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-lean-black-70 line-clamp-2 max-w-md">
                                          {analysis.summary || 'No summary'}
                                        </td>
                                        <td className="px-6 py-3 text-xs text-lean-black-70">
                                          <div className="space-y-1">
                                            {analysis.has_transcription && (
                                              <div>📝 Transcript ({analysis.transcription_length} chars)</div>
                                            )}
                                            {analysis.cases_count > 0 && (
                                              <div>🎫 {analysis.cases_count} cases</div>
                                            )}
                                            {analysis.avoma_calls_ready > 0 && (
                                              <div>📞 {analysis.avoma_calls_ready}/{analysis.avoma_calls_total} calls</div>
                                            )}
                                            {!analysis.has_transcription && analysis.cases_count === 0 && (
                                              <div className="text-gray-400">No data sources</div>
                                            )}
                                          </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm">
                                          {analysis.input_hash ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Yes</span>
                                          ) : (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">No</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Pagination */}
              {pagination.total > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-lean-black-70">
                    Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} analyses
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={pagination.offset === 0}
                      className="px-4 py-2 bg-lean-white border border-lean-black/20 rounded-lg hover:bg-lean-almost-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={pagination.offset + pagination.limit >= pagination.total}
                      className="px-4 py-2 bg-lean-white border border-lean-black/20 rounded-lg hover:bg-lean-almost-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// Export to window
window.AllAnalysesPage = AllAnalysesPage;

