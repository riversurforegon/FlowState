const C = 'flowstate-v44';
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png']))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil((async()=>{ for(const k of await caches.keys()){ if(k!==C) await caches.delete(k); } await self.clients.claim(); })()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (e.request.mode === 'navigate' || u.pathname.endsWith('/index.html') || u.pathname.endsWith('/') || u.pathname.endsWith('/head.json')) {
    e.respondWith(fetch(e.request).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(e.request, cp)); return res; }).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(e.request, cp)); return res; })));
  }
});
