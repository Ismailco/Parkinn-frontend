const CACHE_NAME = 'packinn-cache-v1';
const CACHE = 'pwabuilder-offline-page';

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const offlineFallbackPage = ['../dist/index.html', '../dist/logo.svg', '../dist/assets/apple-icon-180-e27d7f0f.png', '../dist/assets/index-2443fa3f.css', '../dist/assets/index-79c974eb.js', '../dist/icons/apple-icon-180.png', '../dist/icons/manifest-icon-192.maskable.png', '../dist/icons/manifest-icon-512.maskable.png', '../dist/img/gps.png', '../dist/img/home.png', '../dist/img/location.png', '../dist/img/NavLogo.svg', '../dist/img/parkingIcon.png'];

// PWABuilder service worker code to support offline functionality
globalThis.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    globalThis.skipWaiting();
  }
});

globalThis.addEventListener('install', async (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage)));
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE,
  })
);

globalThis.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })()
    );
  }
});
