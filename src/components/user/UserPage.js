// User Account Management Page Component
const { useState, useEffect, useCallback } = React;

const UserPage = ({ user, onSignOut }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [removingAccountId, setRemovingAccountId] = useState(null);
  const [addingAccountId, setAddingAccountId] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState(new Set());
  const [bulkRemoving, setBulkRemoving] = useState(false);
  const [refreshingFromSalesforce, setRefreshingFromSalesforce] = useState(false);

  // Fetch user's cached accounts
  const fetchUserAccounts = useCallback(async () => {
    if (!user?.id && !user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        userId: user.id || '',
        email: user.email || '',
        role: user.role || '',
      });

      const response = await (window.deduplicatedFetch || fetch)(`/api/salesforce-accounts?${params}`);
      const responseClone = response.clone();
      
      if (!response.ok) {
        const errorData = await responseClone.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to fetch accounts');
      }

      const data = await responseClone.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      window.logError('Error fetching user accounts:', err);
      setError(err.message || 'Failed to load accounts. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [user]);


  // Load accounts on mount
  useEffect(() => {
    fetchUserAccounts();
  }, [fetchUserAccounts]);

  // Search for accounts
  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      
      const params = new URLSearchParams({
        search: searchQuery.trim(),
        userId: user?.id || '',
      });

      const response = await (window.deduplicatedFetch || fetch)(`/api/salesforce-accounts?${params}`);
      const responseClone = response.clone();
      
      if (!response.ok) {
        const errorData = await responseClone.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to search accounts');
      }

      const data = await responseClone.json();
      
      // Filter out accounts already in user's list
      const existingAccountIds = new Set(accounts.map(acc => acc.salesforceId || acc.id));
      const filteredResults = (data.accounts || []).filter(
        acc => !existingAccountIds.has(acc.salesforceId || acc.id)
      );
      
      setSearchResults(filteredResults);
    } catch (err) {
      window.logError('Error searching accounts:', err);
      setError(err.message || 'Failed to search accounts. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [user, accounts]);

  // Handle search input change with debounce
  useEffect(() => {
    if (!showAddAccount) {
      setSearchTerm('');
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        handleSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, showAddAccount, handleSearch]);

  // Add account to user's list
  const handleAddAccount = useCallback(async (account) => {
    if (!user?.id) {
      setError('User ID is required to add accounts');
      return;
    }

    try {
      setAddingAccountId(account.salesforceId || account.id);
      setError(null);

      const response = await fetch('/api/users?action=accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          accountId: account.salesforceId || account.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to add account');
      }

      // Refresh accounts list
      await fetchUserAccounts();
      
      // Remove from search results
      setSearchResults(prev => prev.filter(
        acc => (acc.salesforceId || acc.id) !== (account.salesforceId || account.id)
      ));
      
      // Clear search if no more results
      if (searchResults.length <= 1) {
        setSearchTerm('');
        setShowAddAccount(false);
      }
    } catch (err) {
      window.logError('Error adding account:', err);
      setError(err.message || 'Failed to add account. Please try again.');
    } finally {
      setAddingAccountId(null);
    }
  }, [user, fetchUserAccounts, searchResults.length]);

  // Remove account from user's list
  const handleRemoveAccount = useCallback(async (account) => {
    if (!user?.id) {
      setError('User ID is required to remove accounts');
      return;
    }

    if (!confirm(`Are you sure you want to remove "${account.name}" from your account list?`)) {
      return;
    }

    try {
      setRemovingAccountId(account.salesforceId || account.id);
      setError(null);

      const response = await fetch('/api/users?action=accounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          accountId: account.salesforceId || account.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to remove account');
      }

      // Refresh accounts list
      await fetchUserAccounts();
      // Clear selection if this account was selected
      setSelectedAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(account.salesforceId || account.id);
        return newSet;
      });
    } catch (err) {
      window.logError('Error removing account:', err);
      setError(err.message || 'Failed to remove account. Please try again.');
    } finally {
      setRemovingAccountId(null);
    }
  }, [user, fetchUserAccounts]);

  // Handle checkbox toggle
  const handleToggleAccount = useCallback((accountId) => {
    setSelectedAccounts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  }, []);

  // Handle select all/none
  const handleSelectAll = useCallback(() => {
    if (selectedAccounts.size === accounts.length) {
      // Deselect all
      setSelectedAccounts(new Set());
    } else {
      // Select all
      setSelectedAccounts(new Set(accounts.map(acc => acc.salesforceId || acc.id)));
    }
  }, [accounts, selectedAccounts.size]);

  // Bulk remove selected accounts
  const handleBulkRemove = useCallback(async () => {
    if (selectedAccounts.size === 0) {
      setError('Please select at least one account to remove');
      return;
    }

    const selectedCount = selectedAccounts.size;
    if (!confirm(`Are you sure you want to remove ${selectedCount} account${selectedCount > 1 ? 's' : ''} from your account list?`)) {
      return;
    }

    if (!user?.id) {
      setError('User ID is required to remove accounts');
      return;
    }

    try {
      setBulkRemoving(true);
      setError(null);

      const accountIds = Array.from(selectedAccounts);
      const response = await fetch('/api/users?action=accounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          accountIds: accountIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to remove accounts');
      }

      // Refresh accounts list
      await fetchUserAccounts();
      // Clear selection
      setSelectedAccounts(new Set());
    } catch (err) {
      window.logError('Error bulk removing accounts:', err);
      setError(err.message || 'Failed to remove accounts. Please try again.');
    } finally {
      setBulkRemoving(false);
    }
  }, [user, selectedAccounts, fetchUserAccounts]);

  // Refresh from Salesforce - removes all accounts and re-syncs
  const handleRefreshFromSalesforce = useCallback(async () => {
    if (!user?.id && !user?.email) {
      setError('User information is required to refresh accounts');
      return;
    }

    if (!confirm('This will remove all your cached accounts and refresh them from Salesforce. Continue?')) {
      return;
    }

    try {
      setRefreshingFromSalesforce(true);
      setError(null);

      // First, clear all user-account relationships
      const clearResponse = await fetch('/api/users?action=accounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          clearAll: true,
        }),
      });

      if (!clearResponse.ok) {
        const errorData = await clearResponse.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to clear accounts');
      }

      // Then, refresh from Salesforce with force refresh and ownerOnly=true
      // This ensures we only get accounts the user owns, not all accounts
      const params = new URLSearchParams({
        userId: user.id || '',
        email: user.email || '',
        role: user.role || '',
        forceRefresh: 'true',
        ownerOnly: 'true', // Only get accounts owned by the user
      });

      const refreshResponse = await fetch(`/api/salesforce-accounts?${params}`);
      
      if (!refreshResponse.ok) {
        const errorData = await refreshResponse.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to refresh accounts from Salesforce');
      }

      // Refresh accounts list
      await fetchUserAccounts();
      // Clear selection
      setSelectedAccounts(new Set());
    } catch (err) {
      window.logError('Error refreshing from Salesforce:', err);
      setError(err.message || 'Failed to refresh accounts from Salesforce. Please try again.');
    } finally {
      setRefreshingFromSalesforce(false);
    }
  }, [user, fetchUserAccounts]);

  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    if (typeof value === 'string' && value.includes('$')) return value;
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
    }
    return value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-lean-almost-white flex flex-col">
      {/* Global Header */}
      <window.Header user={user} onSignOut={onSignOut} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="typography-heading text-lean-black mb-2">My Accounts</h1>
            <p className="text-sm text-lean-black-70">Manage your cached Salesforce accounts</p>
          </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}


        {/* Add Account Section */}
        <div className="bg-lean-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="typography-heading text-lean-black">Add Account</h2>
            <button
              onClick={() => {
                setShowAddAccount(!showAddAccount);
                if (!showAddAccount) {
                  setSearchTerm('');
                  setSearchResults([]);
                }
              }}
              className="px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
            >
              {showAddAccount ? 'Cancel' : 'Add Account'}
            </button>
          </div>

          {showAddAccount && (
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for accounts by name (minimum 2 characters)..."
                  className="w-full px-4 py-2 border border-lean-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green focus:border-transparent"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <window.LoaderIcon className="w-5 h-5 animate-spin text-lean-green" />
                  </div>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="mt-4 border border-lean-black/20 rounded-lg max-h-96 overflow-y-auto">
                  {searchResults.map((account) => (
                    <div
                      key={account.salesforceId || account.id}
                      className="p-4 border-b border-lean-black/10 last:border-b-0 hover:bg-lean-almost-white transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lean-black">{account.name}</h3>
                          <div className="text-sm text-lean-black-70 mt-1 space-y-1">
                            {account.accountTier && (
                              <div>Tier: {account.accountTier}</div>
                            )}
                            {account.contractValue && (
                              <div>Contract Value: {formatCurrency(account.contractValue)}</div>
                            )}
                            {account.industry && (
                              <div>Industry: {account.industry}</div>
                            )}
                            {account.ownerName && (
                              <div>Owner: {account.ownerName}</div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddAccount(account)}
                          disabled={addingAccountId === (account.salesforceId || account.id)}
                          className="ml-4 px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingAccountId === (account.salesforceId || account.id) ? (
                            <window.LoaderIcon className="w-5 h-5 animate-spin" />
                          ) : (
                            'Add'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchTerm.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
                <div className="mt-4 text-center text-lean-black-70 py-4">
                  No accounts found matching "{searchTerm}"
                </div>
              )}

              {searchTerm.trim().length > 0 && searchTerm.trim().length < 2 && (
                <div className="mt-4 text-center text-lean-black-70 py-4">
                  Please enter at least 2 characters to search
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accounts List */}
        <div className="bg-lean-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="typography-heading text-lean-black">
              My Accounts ({accounts.length})
            </h2>
            <div className="flex items-center gap-3">
              {selectedAccounts.size > 0 && (
                <button
                  onClick={handleBulkRemove}
                  disabled={bulkRemoving}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkRemoving ? (
                    <>
                      <window.LoaderIcon className="w-4 h-4 animate-spin inline mr-2" />
                      Removing...
                    </>
                  ) : (
                    `Remove Selected (${selectedAccounts.size})`
                  )}
                </button>
              )}
              <button
                onClick={handleRefreshFromSalesforce}
                disabled={refreshingFromSalesforce || loading}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove all accounts and refresh from Salesforce"
              >
                {refreshingFromSalesforce ? (
                  <>
                    <window.LoaderIcon className="w-4 h-4 animate-spin inline mr-2" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh from Salesforce'
                )}
              </button>
              <button
                onClick={fetchUserAccounts}
                disabled={loading || refreshingFromSalesforce}
                className="px-4 py-2 text-lean-black-70 hover:text-lean-black transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <window.LoaderIcon className="w-8 h-8 animate-spin text-lean-green" />
              <span className="ml-3 text-lean-black-70">Loading accounts...</span>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lean-black-70 mb-4">You don't have any accounts cached yet.</p>
              <p className="text-sm text-lean-black-60">Use the "Add Account" section above to search for and add accounts.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-lean-black/20">
                    <th className="text-left py-3 px-4 font-semibold text-lean-black w-12">
                      <input
                        type="checkbox"
                        checked={accounts.length > 0 && selectedAccounts.size === accounts.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-lean-green rounded border-lean-black/20 focus:ring-lean-green"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-lean-black">Account Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-lean-black">Tier</th>
                    <th className="text-left py-3 px-4 font-semibold text-lean-black">Contract Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-lean-black">Industry</th>
                    <th className="text-left py-3 px-4 font-semibold text-lean-black">Owner</th>
                    <th className="text-left py-3 px-4 font-semibold text-lean-black">Last Synced</th>
                    <th className="text-right py-3 px-4 font-semibold text-lean-black">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lean-black/10">
                  {accounts.map((account) => {
                    const accountId = account.salesforceId || account.id;
                    const isSelected = selectedAccounts.has(accountId);
                    return (
                    <tr key={accountId} className={`hover:bg-lean-almost-white transition-colors ${isSelected ? 'bg-lean-green-10' : ''}`}>
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleAccount(accountId)}
                          className="w-4 h-4 text-lean-green rounded border-lean-black/20 focus:ring-lean-green"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            const accountId = account.salesforceId || account.id;
                            if (window.navigate) {
                              window.navigate(`/account/${accountId}/data`);
                            } else {
                              window.location.href = `/account/${accountId}/data`;
                            }
                          }}
                          className="font-medium text-lean-black text-left hover:text-lean-green hover:underline"
                        >
                          {account.name}
                        </button>
                        {account.salesforceId && (
                          <div className="text-xs text-lean-black-60 mt-1">ID: {account.salesforceId}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-lean-black-70">
                        {account.accountTier || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-lean-black-70">
                        {formatCurrency(account.contractValue)}
                      </td>
                      <td className="py-3 px-4 text-lean-black-70">
                        {account.industry || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-lean-black-70">
                        {account.ownerName || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-lean-black-70 text-sm">
                        {formatDate(account.lastSyncedAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRemoveAccount(account)}
                          disabled={removingAccountId === (account.salesforceId || account.id)}
                          className="px-3 py-1 text-red-600 hover:text-red-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {removingAccountId === (account.salesforceId || account.id) ? (
                            <window.LoaderIcon className="w-4 h-4 animate-spin inline" />
                          ) : (
                            'Remove'
                          )}
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
};

// Export to window
window.UserPage = UserPage;

