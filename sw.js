var C = 'darajati-v1';
var CORE = ['./', 'index.html', 'admin.html', 'icon.png', 'manifest.webmanifest', 'manifest-admin.webmanifest'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(CORE); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function (r) {
    return r || fetch(e.request).then(function (res) {
      if (res.ok && e.request.url.indexOf(self.location.origin) === 0) {
        var cp = res.clone(); caches.open(C).then(function (c) { c.put(e.request, cp); });
      }
      return res;
    }).catch(function () { return caches.match('index.html'); });
  }));
});