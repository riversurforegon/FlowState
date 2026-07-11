const C = 'flowstate-v11';
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png']))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil((async()=>{ for(const k of await caches.keys()){ if(k!==C) await caches.delete(k); } await self.clients.claim(); })()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin === location.origin) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(e.request, cp)); return res; })));
  } // API calls (USGS, Open-Meteo) always go to the network
});
