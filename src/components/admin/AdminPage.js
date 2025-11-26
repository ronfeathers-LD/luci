// Admin Page Component
const { useState, useEffect } = React;

const AdminPage = ({ user, onSignOut }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load admin data or perform admin-specific initialization
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-lean-almost-white flex items-center justify-center">
        <div className="text-center">
          <window.LoaderIcon className="w-8 h-8 animate-spin text-lean-green mx-auto mb-4" />
          <p className="text-lean-black-70">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lean-almost-white flex flex-col">
      {/* Global Header */}
      <window.Header user={user} onSignOut={onSignOut || (() => {})} />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="typography-heading text-lean-black mb-2">Admin Panel</h1>
            <p className="text-sm text-lean-black-70">Manage system settings and configurations</p>
          </div>
          
          <div className="bg-lean-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-lean-black mb-6">Admin Dashboard</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Section 1 */}
            <div className="bg-lean-almost-white rounded-lg p-6 border border-lean-black/20">
              <h3 className="text-lg font-semibold text-lean-black mb-4">System Settings</h3>
              <p className="text-sm text-lean-black-70">
                Configure system-wide settings and preferences.
              </p>
              <button 
                onClick={() => {
                  alert('System Settings management coming soon!');
                }}
                className="mt-4 px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
              >
                Manage Settings
              </button>
            </div>

            {/* Admin Section 2 */}
            <div className="bg-lean-almost-white rounded-lg p-6 border border-lean-black/20">
              <h3 className="text-lg font-semibold text-lean-black mb-4">Role Management</h3>
              <p className="text-sm text-lean-black-70">
                View and manage user roles and permissions.
              </p>
              <button 
                onClick={() => {
                  if (window.navigate) {
                    window.navigate('/admin/roles');
                  } else {
                    window.location.href = '/admin/roles';
                  }
                }}
                className="mt-4 px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
              >
                Manage Roles
              </button>
            </div>

            {/* Admin Section 3 */}
            <div className="bg-lean-almost-white rounded-lg p-6 border border-lean-black/20">
              <h3 className="text-lg font-semibold text-lean-black mb-4">Integration Status</h3>
              <p className="text-sm text-lean-black-70">
                Monitor integration health and status.
              </p>
              <button 
                onClick={() => {
                  alert('Integration Status coming soon!');
                }}
                className="mt-4 px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
              >
                View Status
              </button>
            </div>

            {/* Admin Section 4 */}
            <div className="bg-lean-almost-white rounded-lg p-6 border border-lean-black/20">
              <h3 className="text-lg font-semibold text-lean-black mb-4">All Analyses</h3>
              <p className="text-sm text-lean-black-70">
                View all cached sentiment analysis results across all accounts.
              </p>
              <button 
                onClick={() => {
                  if (window.navigate) {
                    window.navigate('/admin/analyses');
                  } else {
                    window.location.href = '/admin/analyses';
                  }
                }}
                className="mt-4 px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
              >
                View All Analyses
              </button>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Export to window
window.AdminPage = AdminPage;

