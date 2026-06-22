// Service worker: deixa o app abrir offline, mas SEM travar numa versão velha.
// Estratégia: a PÁGINA (HTML) é sempre buscada da rede primeiro (network-first),
// caindo no cache só quando estiver offline. Assim novas versões aparecem na hora.
// Os dados vêm do Supabase (rede) e não são cacheados aqui.
var CACHE = 'financas-v2';
var ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = req.url;
  // Nunca intercepta Supabase nem o CDN — sempre rede.
  if(url.indexOf('supabase') > -1 || url.indexOf('jsdelivr') > -1) return;

  var ehPagina = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') > -1;

  if(ehPagina){
    // network-first: pega a versão mais nova; usa cache só se estiver offline.
    e.respondWith(
      fetch(req).then(function(res){
        var copia = res.clone();
        caches.open(CACHE).then(function(c){ c.put('./index.html', copia); });
        return res;
      }).catch(function(){
        return caches.match(req).then(function(hit){ return hit || caches.match('./index.html'); });
      })
    );
    return;
  }

  // demais arquivos (ícone, manifest): cache-first com atualização em segundo plano.
  e.respondWith(
    caches.match(req).then(function(hit){
      return hit || fetch(req).then(function(res){
        var copia = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copia); });
        return res;
      });
    })
  );
});
