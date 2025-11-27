// Sentiment Analysis Detail Page Component
// Displays a single sentiment analysis by ID
const { useState, useEffect } = React;

const SentimentDetailPage = ({ user, onSignOut, analysisId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisId) {
        setError('Analysis ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await (window.deduplicatedFetch || fetch)(`/api/sentiment-analysis?id=${analysisId}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || errorData.error || 'Failed to fetch analysis');
        }

        const data = await response.json();
        setAnalysis(data.analysis);
      } catch (err) {
        window.logError('Error fetching sentiment analysis:', err);
        setError(err.message || 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lean-almost-white flex items-center justify-center">
        <div className="text-center">
          <window.LoaderIcon className="w-8 h-8 animate-spin text-lean-green mx-auto mb-4" />
          <p className="text-lean-black-70">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-lean-almost-white flex flex-col">
        <window.Header user={user} onSignOut={onSignOut} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                {error || 'Analysis not found'}
              </p>
            </div>
            <button
              onClick={() => {
                if (window.navigate) {
                  window.navigate('/');
                } else {
                  window.location.href = '/';
                }
              }}
              className="mt-4 px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const accountName = analysis.accounts?.name || analysis.customer_identifier || 'Unknown Account';
  const accountId = analysis.accounts?.salesforce_id || analysis.salesforce_account_id;

  return (
    <div className="min-h-screen bg-lean-almost-white flex flex-col">
      {/* Global Header */}
      <window.Header user={user} onSignOut={onSignOut} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                // Try to go back to account data page if we have account info
                if (accountId) {
                  if (window.navigate) {
                    window.navigate(`/account/${accountId}/data`);
                  } else {
                    window.location.href = `/account/${accountId}/data`;
                  }
                } else {
                  // Fallback to dashboard
                  if (window.navigate) {
                    window.navigate('/');
                  } else {
                    window.location.href = '/';
                  }
                }
              }}
              className="text-lean-green hover:text-lean-green/80 mb-4 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {accountId ? 'Back to Account Data' : 'Back to Dashboard'}
            </button>
            <h1 className="typography-heading text-lean-black mb-2">Sentiment Analysis</h1>
            <p className="text-sm text-lean-black-70">{accountName}</p>
            <p className="text-xs text-lean-black-60 mt-1">Analyzed: {formatDate(analysis.analyzed_at)}</p>
          </div>

          {/* Score Card */}
          <div className="bg-lean-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-lean-black mb-2">Sentiment Score</h2>
                <p className="text-sm text-lean-black-70">
                  {analysis.score >= 8 ? 'Positive' : analysis.score >= 5 ? 'Neutral' : 'Negative'}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-6xl font-bold ${
                  analysis.score >= 8 ? 'text-green-600' :
                  analysis.score >= 5 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {analysis.score}
                </div>
                <div className="text-sm text-lean-black-60">out of 10</div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-lean-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-lean-black mb-4">Executive Summary</h2>
            <div className="prose max-w-none">
              <p className="text-lean-black-70 whitespace-pre-wrap leading-relaxed">
                {analysis.summary || 'No summary available'}
              </p>
            </div>
          </div>

          {/* Comprehensive Analysis */}
          {analysis.comprehensive_analysis && (
            <div className="bg-lean-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-lean-black mb-4">Comprehensive Analysis</h2>
              <div className="prose max-w-none">
                <p className="text-lean-black-70 whitespace-pre-wrap leading-relaxed">
                  {analysis.comprehensive_analysis}
                </p>
              </div>
            </div>
          )}

          {/* Data Sources */}
          <div className="bg-lean-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-lean-black mb-4">Data Sources</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-lean-almost-white rounded-lg">
                <div className="text-2xl font-bold text-lean-green mb-1">
                  {analysis.has_transcription ? '✓' : '✗'}
                </div>
                <div className="text-sm text-lean-black-70">Transcription</div>
                {analysis.transcription_length > 0 && (
                  <div className="text-xs text-lean-black-60 mt-1">
                    {analysis.transcription_length} chars
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-lean-almost-white rounded-lg">
                <div className="text-2xl font-bold text-lean-green mb-1">
                  {analysis.cases_count || 0}
                </div>
                <div className="text-sm text-lean-black-70">Cases</div>
              </div>
              <div className="text-center p-4 bg-lean-almost-white rounded-lg">
                <div className="text-2xl font-bold text-lean-green mb-1">
                  {analysis.avoma_calls_ready || 0}
                </div>
                <div className="text-sm text-lean-black-70">Avoma Calls</div>
              </div>
              <div className="text-center p-4 bg-lean-almost-white rounded-lg">
                <div className="text-2xl font-bold text-lean-green mb-1">
                  {formatDate(analysis.analyzed_at).split(',')[0]}
                </div>
                <div className="text-sm text-lean-black-70">Date</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Export to window
window.SentimentDetailPage = SentimentDetailPage;


