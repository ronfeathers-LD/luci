/**
 * Service Worker Registration
 * Only registers in production and if service workers are supported
 */
'use client';

export function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  
  // Only register in production
  if (process.env.NODE_ENV !== 'production') {
    // Unregister any existing service workers in development
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then(() => {
            console.log('[SW] Unregistered service worker:', registration.scope);
          });
        });
      });
    }
    return;
  }

  // Production: register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  console.log('[SW] New service worker available');
                  // Optionally notify user or auto-reload
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn('[SW] Service Worker registration failed:', error);
        });
    });
  }
}

