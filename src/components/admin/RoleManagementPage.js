// Role Management Page Component for Admin
const { useState, useEffect, useCallback } = React;

const RoleManagementPage = ({ user, onSignOut }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all users with roles
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user-roles');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      window.logError('Error fetching users:', err);
      setError(err.message || 'Failed to load users. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all available roles
  const fetchRoles = useCallback(async () => {
    try {
      const response = await fetch('/api/roles');
      
      if (!response.ok) {
        // If roles endpoint doesn't exist, we'll create default roles list
        setRoles([
          { id: 'admin', name: 'admin', description: 'Administrator with full system access' },
          { id: 'Account Manager', name: 'Account Manager', description: 'Standard account manager role' },
          { id: 'Viewer', name: 'Viewer', description: 'Read-only access to accounts' },
        ]);
        return;
      }

      const data = await response.json();
      setRoles(data.roles || []);
    } catch (err) {
      window.logError('Error fetching roles:', err);
      // Use default roles if API fails
      setRoles([
        { id: 'admin', name: 'admin', description: 'Administrator with full system access' },
        { id: 'Account Manager', name: 'Account Manager', description: 'Standard account manager role' },
        { id: 'Viewer', name: 'Viewer', description: 'Read-only access to accounts' },
      ]);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  // Update user roles
  const handleUpdateRoles = useCallback(async (userId, selectedRoleNames) => {
    try {
      setUpdatingUserId(userId);
      setError(null);

      const response = await fetch('/api/user-roles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          roleNames: selectedRoleNames,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to update roles');
      }

      // Refresh users list
      await fetchUsers();
    } catch (err) {
      window.logError('Error updating roles:', err);
      setError(err.message || 'Failed to update roles. Please try again.');
    } finally {
      setUpdatingUserId(null);
    }
  }, [fetchUsers]);

  // Handle role checkbox toggle
  const handleRoleToggle = useCallback((userId, roleName, isChecked) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const currentRoleNames = user.roles.map(r => r.name);
    let newRoleNames;

    if (isChecked) {
      // Add role
      newRoleNames = [...currentRoleNames, roleName];
    } else {
      // Remove role
      newRoleNames = currentRoleNames.filter(name => name !== roleName);
    }

    handleUpdateRoles(userId, newRoleNames);
  }, [users, handleUpdateRoles]);

  // Filter users by search term
  const filteredUsers = users.filter(u => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (u.email && u.email.toLowerCase().includes(search)) ||
      (u.name && u.name.toLowerCase().includes(search))
    );
  });

  return (
    <div className="min-h-screen bg-lean-almost-white">
      {/* Header */}
      <header className="bg-lean-white border-b border-lean-black/20 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="typography-heading text-lean-black">Role Management</h1>
            <p className="text-sm text-lean-black-70 mt-1">Manage user roles and permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.navigate) {
                  window.navigate('/admin');
                } else {
                  window.location.href = '/admin';
                }
              }}
              className="px-4 py-2 text-lean-black-70 hover:text-lean-black transition-colors"
            >
              Back to Admin
            </button>
            {user?.picture && (
              <img
                src={user.picture}
                alt={user.name || 'User'}
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={onSignOut}
              className="px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Search */}
        <div className="bg-lean-white rounded-lg shadow-lg p-6 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full px-4 py-2 border border-lean-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-lean-green focus:border-transparent"
          />
        </div>

        {/* Users List */}
        <div className="bg-lean-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="typography-heading text-lean-black">
              Users ({filteredUsers.length})
            </h2>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="px-4 py-2 text-lean-black-70 hover:text-lean-black transition-colors disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <window.LoaderIcon className="w-8 h-8 animate-spin text-lean-green" />
              <span className="ml-3 text-lean-black-70">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lean-black-70">
                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((u) => {
                const userRoleNames = new Set(u.roles.map(r => r.name));
                const isUpdating = updatingUserId === u.id;

                return (
                  <div
                    key={u.id}
                    className="border border-lean-black/20 rounded-lg p-6 hover:bg-lean-almost-white transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {u.picture && (
                          <img
                            src={u.picture}
                            alt={u.name || u.email}
                            className="w-12 h-12 rounded-full"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-lean-black">
                            {u.name || 'No name'}
                          </h3>
                          <p className="text-sm text-lean-black-70">{u.email}</p>
                        </div>
                      </div>
                      {isUpdating && (
                        <window.LoaderIcon className="w-5 h-5 animate-spin text-lean-green" />
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-lean-black mb-3">Roles:</h4>
                      <div className="flex flex-wrap gap-4">
                        {roles.map((role) => {
                          const isChecked = userRoleNames.has(role.name);
                          return (
                            <label
                              key={role.id || role.name}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleRoleToggle(u.id, role.name, e.target.checked)}
                                disabled={isUpdating}
                                className="w-4 h-4 text-lean-green rounded border-lean-black/20 focus:ring-lean-green disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <span className="text-sm text-lean-black-70">
                                {role.name}
                                {role.description && (
                                  <span className="text-xs text-lean-black-60 ml-1">
                                    ({role.description})
                                  </span>
                                )}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {u.roles.length === 0 && (
                        <p className="text-sm text-lean-black-60 italic mt-2">No roles assigned</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Export to window
window.RoleManagementPage = RoleManagementPage;

