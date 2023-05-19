// const CACHE_NAME = 'packinn-cache-v1';
// const urlsToCache = ['/', '/index.html', '/.js$/', '/.jsx$/', '/.css$/', '/.png$/', '/.jpg$/', '/.svg$/', '/.woff$/', '/.woff2$/', '/.ttf$/', '/.otf$/', '/.eot$/', '/.ico$/', '/.json$/'];
// /* eslint-disable no-undef */
// globalThis.addEventListener('install', (event) => {
//   event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
// });
// globalThis.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       if (response) {
//         return response;
//       }
//       return fetch(event.request);
//     })
//   );
// });
// globalThis.addEventListener('install', (event) => {
//   event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
//   globalThis.skipWaiting();
// });

const CACHE = 'pwabuilder-offline-page';

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = 'ToDo-replace-this-name.html';

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

// const CACHE = 'pwabuilder-offline';

// importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// globalThis.addEventListener('message', (event) => {
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     globalThis.skipWaiting();
//   }
// });

// workbox.routing.registerRoute(
//   new RegExp('/*'),
//   new workbox.strategies.StaleWhileRevalidate({
//     cacheName: CACHE,
//   })
// );
