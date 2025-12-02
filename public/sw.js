/**
 * Rogue Bolt Service Worker
 * Enables offline play and PWA installation
 */

const CACHE_NAME = 'roguebolt-v1';

// Assets to cache for offline play
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/sprites/player.png',
  '/assets/sprites/enemy.png',
  '/assets/sprites/fireball_small.png',
  '/assets/sprites/fireball_large.png',
  '/assets/sprites/lightning.png',
  '/assets/sprites/platform.png',
  '/assets/sprites/exit.png',
  '/assets/sprites/bg_scene1.png',
  '/assets/sprites/bg_scene2.png',
  '/assets/sprites/title.png',
  '/assets/music/theme.mp3',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version or fetch from network
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses or non-GET requests
        if (!response || response.status !== 200 || event.request.method !== 'GET') {
          return response;
        }

        // Clone the response for caching
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // Cache JS/CSS/image assets
          const url = event.request.url;
          if (url.includes('/assets/') || url.endsWith('.js') || url.endsWith('.css')) {
            cache.put(event.request, responseToCache);
          }
        });

        return response;
      }).catch(() => {
        // Offline fallback - return cached index for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return null;
      });
    })
  );
});
