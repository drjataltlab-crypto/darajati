var CACHE_NAME = 'darajati-teacher-v1';
var urlsToCache = [
  './',
  './index.html',
  './config.js',
  './icon.png',
  './manifest.webmanifest'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('✅ فتح كاش المعلمين');
        // تخزين كل ملف على حدة لتجنب فشل الكل عند فشل واحد
        return Promise.all(
          urlsToCache.map(function(url) {
            return cache.add(url).catch(function(err) {
              console.log('️ فشل تخزين:', url, err);
            });
          })
        );
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  // تجاهل طلبات POST (مثل إرسال الدرجات)
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) return response;
        return fetch(event.request).then(function(networkResponse) {
          // تخزين الاستجابة الجديدة
          if (networkResponse && networkResponse.status === 200) {
            var responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ حذف كاش قديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
