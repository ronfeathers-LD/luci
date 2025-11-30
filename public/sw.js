// Service Worker for offline support (Next.js compatible)
// Version is updated on each build to force cache refresh
const CACHE_VERSION = 'v4-nextjs';
const CACHE_NAME = `luci-${CACHE_VERSION}`;
// Don't cache routes during install - Next.js handles page caching
const urlsToCache = [
  // Only static assets like images, fonts, etc.
  // Pages are handled by Next.js itself
];

// Force update check on service worker activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all old caches that don't match current version
          if (cacheName !== CACHE_NAME && cacheName.startsWith('luci-')) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Force all clients to reload
      return self.clients.claim().then(() => {
        // Notify all clients to check for updates
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
          });
        });
      });
    })
  );
});

// Install event - cache static resources only
self.addEventListener('install', (event) => {
  // Skip installation if no URLs to cache, or cache only static assets
  if (urlsToCache.length === 0) {
    // If no URLs to cache, just skip waiting and activate
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Only cache static assets (images, fonts, etc.)
        // Filter out any dynamic routes
        const staticAssets = urlsToCache.filter(url => {
          return !url.includes('/_next') && 
                 !url.includes('/api') && 
                 !url.startsWith('/') || url.match(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
        });
        
        // Only try to cache if we have assets
        if (staticAssets.length === 0) {
          return Promise.resolve();
        }
        
        return cache.addAll(staticAssets).catch((error) => {
          // Silently fail for individual asset caching errors
          console.warn('[SW] Some assets failed to cache:', error);
        });
      })
      .catch((error) => {
        // Don't fail installation if caching fails
        console.warn('[SW] Service Worker install warning:', error);
      })
  );
  self.skipWaiting();
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache API requests, Next.js routes, or Next.js assets
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image')
  ) {
    return; // Let Next.js handle these
  }

  // For Next.js pages, always fetch from network (Next.js handles caching)
  if (request.destination === 'document') {
    // Network-first strategy for pages
    event.respondWith(
      fetch(request).catch(() => {
        // If offline, try cache as fallback
        return caches.match(request);
      })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // If both cache and network fail, return cached version if available
        return caches.match(request);
      })
  );
});

