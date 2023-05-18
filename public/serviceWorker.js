const CACHE_NAME = 'packinn-cache-v1';
const urlsToCache = ['/', '/index.html', '/.js$/', '/.jsx$/', '/.css$/', '/.png$/', '/.jpg$/', '/.svg$/', '/.woff$/', '/.woff2$/', '/.ttf$/', '/.otf$/', '/.eot$/', '/.ico$/', '/.json$/'];
/* eslint-disable no-undef */
globalThis.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});
globalThis.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});
globalThis.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
  globalThis.skipWaiting();
});
