// Login Page Component
const { useState, useCallback, useEffect, useRef } = React;

// Constants
const MAX_RETRIES = 50;
const MAX_INIT_ATTEMPTS = 100;
const RETRY_DELAY = 100;
const INIT_DELAY = 100;

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = window.GOOGLE_CLIENT_ID || '160384595408-625gmnr4j40cgjp44qkfljoeo6i0n7j9.apps.googleusercontent.com';

const LoginPage = ({ onSignIn }) => {
  const buttonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryCountRef = useRef(0);
  const [buttonReady, setButtonReady] = useState(false);

  const handleCredentialResponse = useCallback((response) => {
    // Decode the JWT token to get user info
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const userInfo = JSON.parse(jsonPayload);
      onSignIn(userInfo);
    } catch (error) {
      window.logError('Error decoding credential:', error);
      setError('Error signing in. Please try again.');
    }
  }, [onSignIn]);

  // Wait for Google Identity Services to load and initialize
  useEffect(() => {
    let isMounted = true;
    let initAttempts = 0;

    const waitForGoogleAndInit = () => {
      initAttempts++;
      
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          // Initialize Google Sign-In
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });
          window.log('Google Sign-In initialized successfully');
          
          // Now try to render the button
          if (isMounted) {
            renderButton();
          }
        } catch (err) {
          window.logError('Error initializing Google Sign-In:', err);
          if (isMounted) {
            setError(`Failed to initialize: ${err.message}`);
            setIsLoading(false);
          }
        }
      } else if (initAttempts < MAX_INIT_ATTEMPTS) {
        // Keep waiting for Google Identity Services to load
        setTimeout(waitForGoogleAndInit, INIT_DELAY);
      } else {
        window.logError('Google Identity Services failed to load after', MAX_INIT_ATTEMPTS, 'attempts');
        if (isMounted) {
          setError('Google Sign-In script failed to load. Please check your internet connection and refresh the page.');
          setIsLoading(false);
        }
      }
    };

    const renderButton = () => {
      if (!isMounted || !buttonReady) {
        // Wait for button to be ready
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          setTimeout(renderButton, RETRY_DELAY);
        }
        return;
      }
      
      if (buttonRef.current && window.google && window.google.accounts && window.google.accounts.id) {
        try {
          // Clear any existing content
          buttonRef.current.innerHTML = '';
          
          window.google.accounts.id.renderButton(
            buttonRef.current,
            {
              theme: 'outline',
              size: 'large',
              width: buttonRef.current.offsetWidth || 320,
              text: 'signin_with',
            }
          );
          window.log('Google Sign-In button rendered successfully');
          setIsLoading(false);
        } catch (err) {
          window.logError('Error rendering button:', err);
          if (isMounted) {
            setError(`Failed to render button: ${err.message}. Please check that your domain is authorized in Google OAuth settings.`);
            setIsLoading(false);
          }
        }
      } else if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        setTimeout(renderButton, RETRY_DELAY);
      } else {
        if (!buttonRef.current) {
          window.logError('Button ref is null');
          if (isMounted) {
            setError('Button element not found. Please refresh the page.');
            setIsLoading(false);
          }
        } else if (!window.google || !window.google.accounts) {
          window.logError('Google Identity Services not loaded');
          if (isMounted) {
            setError('Google Sign-In script not loaded. Please check your connection.');
            setIsLoading(false);
          }
        } else {
          window.logError('Unknown error rendering button');
          if (isMounted) {
            setError('Failed to load sign-in button. Please refresh the page.');
            setIsLoading(false);
          }
        }
      }
    };

    // Start waiting for Google Identity Services
    waitForGoogleAndInit();

    return () => {
      isMounted = false;
    };
  }, [handleCredentialResponse, buttonReady]);

  // Set button ready when ref is attached
  useEffect(() => {
    if (buttonRef.current) {
      setButtonReady(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-lean-almost-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-lean-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="typography-primary-title text-lean-black mb-2">
            L.U.C.I.
          </h1>
          <p className="typography-body text-lean-black-70">
            Please sign in to continue
          </p>
        </div>
        <div className="space-y-4">
          {/* Always render the button container so ref is available */}
          <div ref={buttonRef} className="w-full" style={{ minHeight: '40px' }}></div>
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-2">
              <window.LoaderIcon className="w-5 h-5 animate-spin text-lean-green mb-1" />
              <p className="text-xs text-lean-black-60">Loading sign-in...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Refresh page
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-lean-black-60 text-center mt-6">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
};

// Export to window
window.LoginPage = LoginPage;


