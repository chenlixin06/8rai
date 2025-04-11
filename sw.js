const CACHE_NAME = '8rai-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/about.css',
  '/css/learning_resources.css',
  '/css/model_evaluation.css',
  '/js/script.js',
  '/img/android-chrome-192x192.png',
  '/img/android-chrome-512x512.png',
  '/img/apple-touch-icon.png',
  '/img/favicon-16x16.png',
  '/img/favicon-32x32.png',
  '/img/favicon.ico',
  '/img/site.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 