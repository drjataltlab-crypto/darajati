var C = 'darajati-v2';
var CORE = ['./', 'index.html', 'admin.html', 'icon.png', 'manifest.webmanifest', 'manifest-admin.webmanifest'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(CORE); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var isPage = e.request.mode === 'navigate' || /\.html$/.test(new URL(e.request.url).pathname);
  if (isPage) {
    // الصفحات: يجلب أحدث نسخة من الإنترنت، وعند انقطاعه يفتح النسخة المحفوظة
    e.respondWith(fetch(e.request).then(function (res) {
      var cp = res.clone();
      caches.open(C).then(function (c) { c.put(e.request, cp); });
      return res;
    }).catch(function () { return caches.match(e.request); }));
  } else {
    // الصور والملفات الأخرى: من الذاكرة للأسرع
    e.respondWith(caches.match(e.request).then(function (r) {
      return r || fetch(e.request).then(function (res) {
        if (res.ok && e.request.url.indexOf(self.location.origin) === 0) {
          var cp = res.clone();
          caches.open(C).then(function (c) { c.put(e.request, cp); });
        }
        return res;
      });
    }));
  }
});
