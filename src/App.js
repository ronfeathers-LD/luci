// Main App Component with Routing
const { useState, useEffect } = React;

// Analytics helper (structure for future integration)
const analytics = {
  track: (event, data) => {
    if (window.isProduction) {
      // In production, send to analytics service
      // Example: gtag('event', event, data);
      window.log('Analytics:', event, data);
    } else {
      window.log('Analytics (dev):', event, data);
    }
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

  // If not logged in, show login page
  if (!user) {
    return <window.LoginPage onSignIn={handleSignIn} />;
  }

  // Route based on current path
  if (currentPath === '/admin/analyses') {
    return <window.AllAnalysesPage user={user} onSignOut={handleSignOut} />;
  }

  if (currentPath === '/admin') {
    return <window.AdminPage user={user} onSignOut={handleSignOut} />;
  }

  if (currentPath === '/user') {
    return <window.UserPage user={user} onSignOut={handleSignOut} />;
  }

  // Default route - show SentimentAnalyzer
  return <window.SentimentAnalyzer user={user} onSignOut={handleSignOut} />;
};

// Export to window
window.App = App;

