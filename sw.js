var C='darajati-v8';
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.map(function(k){return caches.delete(k);}));
  }).then(function(){return clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(function(res){
    if(res&&res.ok){var cp=res.clone();caches.open(C).then(function(c){c.put(e.request,cp);});}
    return res;
  }).catch(function(){return caches.match(e.request);}));
});