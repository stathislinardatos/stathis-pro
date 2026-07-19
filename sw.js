const CACHE='stathis-pro-v2';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.origin!==location.origin || e.request.method!=='GET') return;   // firebase/gstatic/fonts -> network
  // network-first so new versions show up; fall back to cache when offline
  e.respondWith(
    fetch(e.request).then(res=>{ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return res; })
      .catch(()=> caches.match(e.request).then(hit=> hit || caches.match('./index.html')))
  );
});
