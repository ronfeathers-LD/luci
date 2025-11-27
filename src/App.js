// Main App Component with Routing
const { useState, useEffect } = React;

// Analytics helper (structure for future integration)
const analytics = {
  track: (event, data) => {
    if (window.isProduction) {
      // In production, send to analytics service
      // Example: gtag('event', event, data);
    }
    // Dev logging removed for cleaner console
  },
  pageView: (page) => {
    analytics.track('page_view', { page });
  }
};

// Main App Component with Authentication and Routing
const App = () => {
  const [user, setUser] = useState(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        window.logError('Error parsing saved user info:', error);
        localStorage.removeItem('userInfo');
        return null;
      }
    }
    return null;
  });

  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      analytics.pageView(window.location.pathname);
    };

    // Listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', handleLocationChange);
    
    // Initial page view
    analytics.pageView(window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Refresh user roles if user exists but roles are missing or when user first loads
  useEffect(() => {
    const refreshUserRoles = async () => {
      if (user && user.id) {
        // Always refresh roles to ensure we have the latest data
        try {
          const response = await fetch(`/api/users?id=${user.id}`);
          if (response.ok) {
            const userData = await response.json();
            if (userData.roles) {
              // Update localStorage and state with fresh user data including roles
              const updatedUser = { ...user, roles: userData.roles };
              localStorage.setItem('userInfo', JSON.stringify(updatedUser));
              setUser(updatedUser);
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            window.logError('Failed to fetch user roles:', errorData);
          }
        } catch (error) {
          window.logError('Error refreshing user roles:', error);
        }
      }
    };

    // Refresh roles on mount if user exists
    if (user && user.id) {
      refreshUserRoles();
    }
  }, []); // Only run once on mount

  useEffect(() => {
    analytics.pageView(user ? (currentPath === '/admin' ? 'admin' : 'dashboard') : 'login');
  }, [user, currentPath]);

  const handleSignIn = async (userInfo) => {
    try {
      // Create or get user from backend
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          sub: userInfo.sub,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const userData = await response.json();
      
      // Save user info to localStorage
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      analytics.track('user_signed_in', { email: userData.email, userId: userData.id });
    } catch (error) {
      window.logError('Error creating user:', error);
      // Fallback to saving Google user info if API fails
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setUser(userInfo);
      analytics.track('user_signed_in', { email: userInfo.email });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    if (window.navigate) {
      window.navigate('/');
    } else {
      window.location.href = '/';
    }
    analytics.track('user_signed_out');
  };

  // Helper function to check if user has admin role (case-insensitive)
  const hasAdminRole = (user) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.name && role.name.toLowerCase() === 'admin');
  };

  // If not logged in, show login page
  if (!user) {
    return <window.LoginPage onSignIn={handleSignIn} />;
  }

  // Route based on current path
  // Admin routes require admin role
  if (currentPath.startsWith('/admin')) {
    if (!hasAdminRole(user)) {
      return (
        <div className="min-h-screen bg-lean-almost-white flex items-center justify-center">
          <div className="text-center bg-lean-white rounded-lg shadow-lg p-8 max-w-md">
            <h1 className="typography-heading text-lean-black mb-4">Access Denied</h1>
            <p className="text-lean-black-70 mb-6">
              You need administrator privileges to access this page.
            </p>
            <button
              onClick={() => {
                if (window.navigate) {
                  window.navigate('/');
                } else {
                  window.location.href = '/';
                }
              }}
              className="px-4 py-2 bg-lean-green text-lean-white font-semibold rounded-lg hover:bg-lean-green/90 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    if (currentPath === '/admin/roles') {
      return <window.RoleManagementPage user={user} onSignOut={handleSignOut} />;
    }

    if (currentPath === '/admin/analyses') {
      return <window.AllAnalysesPage user={user} onSignOut={handleSignOut} />;
    }

    if (currentPath === '/admin') {
      return <window.AdminPage user={user} onSignOut={handleSignOut} />;
    }
  }

  if (currentPath === '/user') {
    return <window.UserPage user={user} onSignOut={handleSignOut} />;
  }

  // Account data page - /account/:accountId/data
  if (currentPath.startsWith('/account/') && currentPath.endsWith('/data')) {
    const accountId = currentPath.replace('/account/', '').replace('/data', '');
    return <window.AccountDataPage user={user} onSignOut={handleSignOut} accountId={accountId} />;
  }

  // Sentiment analysis detail page - /sentiment/:id
  if (currentPath.startsWith('/sentiment/')) {
    const analysisId = currentPath.replace('/sentiment/', '');
    return <window.SentimentDetailPage user={user} onSignOut={handleSignOut} analysisId={analysisId} />;
  }

  if (currentPath === '/calendar') {
    return <window.CalendarPage user={user} onSignOut={handleSignOut} />;
  }

  // Default route - show SentimentAnalyzer
  return <window.SentimentAnalyzer user={user} onSignOut={handleSignOut} />;
};

// Export to window
window.App = App;

