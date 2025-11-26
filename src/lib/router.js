// Simple client-side router using History API
// Navigation function - components can use window.navigate(path) to change routes
if (!window.navigate) {
  window.navigate = (path) => {
    window.history.pushState({}, '', path);
    // Dispatch a custom event to trigger re-render
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
}

