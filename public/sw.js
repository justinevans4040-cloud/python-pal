// ── Python Pal Service Worker ─────────────────────────────────────────────────
// Bump CACHE_VERSION any time you want all existing users to get a hard refresh.
// Current: v5 — new icon, Forgefront branding, desktop layout, bug fixes
const CACHE_VERSION = 'v5';
const CACHE = `python-pal-${CACHE_VERSION}`;

// Core shell — always available offline
const CORE = [
  '/',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/python-worker.js',
  '/python-engine-worker.mjs',
];

// ── Install: pre-cache core shell ─────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())  // activate immediately, don't wait for old SW to die
  );
});

// ── Activate: delete ALL old caches, then take control of every open tab ──────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE)          // remove every version that isn't current
          .map(key => {
            console.log(`[SW] Deleting stale cache: ${key}`);
            return caches.delete(key);
          })
      ))
      .then(() => self.clients.claim())          // take over all open tabs immediately
      .then(() => {
        // Tell every open client to reload so they get fresh assets
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION }));
        });
      })
  );
});

// ── Fetch: network-first for navigation, cache-first for assets ───────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigation (HTML pages) — network first so users always get latest shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match('/'))  // offline fallback
    );
    return;
  }

  // Assets (JS, CSS, images, workers) — cache first, update in background
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response.ok && response.type === 'basic') {
          caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      });
      return cached || network;
    })
  );
});
