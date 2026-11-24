const C="polaris-pro-v2";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>{})))});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)));await self.clients.claim();})())});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const isNav = e.request.mode==="navigate" || e.request.destination==="document";
  if(isNav){
    e.respondWith(fetch(e.request).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put("./index.html",cp));return resp;}).catch(()=>caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put(e.request,cp));return resp;}).catch(()=>r)));
});
