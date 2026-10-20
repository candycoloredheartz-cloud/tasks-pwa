const CACHE='tasks-pwa-calendar-v7';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method==='GET'&&url.origin===self.location.origin&&!url.pathname.includes('/api/'))e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
self.addEventListener('push',e=>{let data={};try{data=e.data?.json()||{}}catch{};e.waitUntil(self.registration.showNotification('Tasks｜期限のお知らせ',{body:String(data.title||'タスクの期限です'),icon:'./icon.png',badge:'./icon.png',tag:'task-'+String(data.id||''),data:{url:'./index.html?task='+encodeURIComponent(data.id||'')}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=new URL(e.notification.data?.url||'./index.html',self.registration.scope).href;e.waitUntil((async()=>{const windows=await clients.matchAll({type:'window',includeUncontrolled:true});for(const w of windows){if(w.url.startsWith(self.registration.scope)){await w.navigate(url);return w.focus()}}return clients.openWindow(url)})())});
