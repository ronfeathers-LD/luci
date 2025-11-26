// Global Header Component
// Used across all pages for consistent navigation

const Header = ({ user, onSignOut, showHelp, setShowHelp }) => {
  const { useState, useEffect } = React;
  
  // Track current path for active tab highlighting
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for popstate events (back/forward buttons and programmatic navigation)
    window.addEventListener('popstate', handleLocationChange);
    
    // Also listen for custom navigation events
    window.addEventListener('locationchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('locationchange', handleLocationChange);
    };
  }, []);

  // Helper function to check if user has admin role (case-insensitive)
  const hasAdminRole = (user) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.name && role.name.toLowerCase() === 'admin');
  };

  // Check if a tab is active
  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/' || currentPath === '';
    }
    return currentPath.startsWith(path);
  };

  return (
    <header className="bg-lean-black px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0">
      <div className="max-w-6xl mx-auto">
        {/* Top row: Logo and User Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* LD Logo */}
            <img 
              src={`/ld-logo-abbr-green.png?v=${window.getBuildVersion()}`}
              alt="LeanData Logo" 
              className="h-12 w-auto flex-shrink-0"
              key={`logo-${window.getBuildVersion()}`}
            />
            <div className="text-left">
              <h1 className="typography-heading text-[#f7f7f7] mb-1">
                L.U.C.I.
              </h1>
              <p className="text-sm text-[#f7f7f7]">
                LeanData Unified Customer Intelligence
              </p>
            </div>
          </div>
          
          {/* User Info and Actions */}
          <div className="flex items-center gap-3">
            {setShowHelp && (
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="px-3 py-2 text-sm font-medium text-[#f7f7f7] hover:text-lean-green transition-colors flex items-center gap-2"
                aria-label="Show help and information"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showHelp ? 'Hide' : 'Help'}
              </button>
            )}
            <div className="flex items-center gap-3 bg-lean-black/50 px-4 py-2 rounded-lg">
              <div className="text-right">
                <button
                  onClick={() => {
                    if (window.navigate) {
                      window.navigate('/user');
                    } else {
                      window.location.href = '/user';
                    }
                  }}
                  className="text-sm font-medium text-[#f7f7f7] hover:text-lean-green transition-colors cursor-pointer text-right"
                  aria-label="Go to account settings"
                >
                  {user?.name || 'User'}
                </button>
                <p className="text-xs text-[#f7f7f7]">
                  {user?.email}
                </p>
                {user?.role && (
                  <p className="text-xs text-lean-green font-medium">
                    {user.role}
                  </p>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-lean-green flex items-center justify-center flex-shrink-0">
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
                  className="w-8 h-8 rounded-full bg-lean-green flex items-center justify-center text-white text-xs font-semibold"
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
            </div>
            <button
              onClick={() => {
                if (onSignOut) {
                  onSignOut();
                } else {
                  window.google?.accounts?.id.disableAutoSelect();
                  localStorage.removeItem('userInfo');
                  window.location.reload();
                }
              }}
              className="px-4 py-2 text-sm font-medium text-[#f7f7f7] hover:text-lean-green transition-colors whitespace-nowrap"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Bottom row: Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#f7f7f7]/20">
          <button
            onClick={() => {
              if (window.navigate) {
                window.navigate('/');
              } else {
                window.location.href = '/';
              }
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              isActive('/') && currentPath !== '/user' && currentPath !== '/calendar' && !currentPath.startsWith('/admin')
                ? 'text-lean-green border-lean-green'
                : 'text-[#f7f7f7]/70 border-transparent hover:text-[#f7f7f7] hover:border-[#f7f7f7]/30'
            }`}
            aria-label="Go to dashboard"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              if (window.navigate) {
                window.navigate('/user');
              } else {
                window.location.href = '/user';
              }
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              isActive('/user')
                ? 'text-lean-green border-lean-green'
                : 'text-[#f7f7f7]/70 border-transparent hover:text-[#f7f7f7] hover:border-[#f7f7f7]/30'
            }`}
            aria-label="Manage my accounts"
          >
            My Accounts
          </button>
          <button
            onClick={() => {
              if (window.navigate) {
                window.navigate('/calendar');
              } else {
                window.location.href = '/calendar';
              }
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              isActive('/calendar')
                ? 'text-lean-green border-lean-green'
                : 'text-[#f7f7f7]/70 border-transparent hover:text-[#f7f7f7] hover:border-[#f7f7f7]/30'
            }`}
            aria-label="View calendar"
          >
            Calendar
          </button>
          {hasAdminRole(user) && (
            <button
              onClick={() => {
                if (window.navigate) {
                  window.navigate('/admin');
                } else {
                  window.location.href = '/admin';
                }
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                isActive('/admin')
                  ? 'text-blue-400 border-blue-400'
                  : 'text-[#f7f7f7]/70 border-transparent hover:text-[#f7f7f7] hover:border-[#f7f7f7]/30'
              }`}
              aria-label="Go to admin panel"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// Export to window
window.Header = Header;

