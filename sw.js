// Service worker simples: deixa o app abrir offline (cache da casca).
// Os dados vêm do Supabase (rede) e não são cacheados aqui.
var CACHE = 'financas-v1';
var ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var url = e.request.url;
  // Não intercepta chamadas ao Supabase nem ao CDN — sempre rede.
  if(url.indexOf('supabase') > -1 || url.indexOf('jsdelivr') > -1) return;
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      return hit || fetch(e.request).then(function(res){
        return res;
      }).catch(function(){ return caches.match('./index.html'); });
    })
  );
});
