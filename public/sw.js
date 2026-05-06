const CACHE_NAME = 'moneyiq-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/data/bank-rates.json',
  '/data/cbk-rates.json',
  '/data/mortgage-rates.json',
  '/data/articles.json',
  '/data/bank-charges.json',
  '/data/exchange-rates.json',
  '/data/sacco-rates.json',
  '/data/cbk-history.json',
  '/data/metadata.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
