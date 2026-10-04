importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js","js/firebase-config.js");
firebase.initializeApp(firebaseConfig);const msg=firebase.messaging();
msg.onBackgroundMessage(p=>{const d=p.data||{};return self.registration.showNotification(d.title||"💊 Medicine time",{body:d.body,tag:"med-"+(d.med||""),renotify:true,requireInteraction:true,vibrate:[500,200,500,200,500,200,500,200,500],data:{med:d.med}})});
const C="ss-v3";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET"||!e.request.url.startsWith(self.location.origin))return;
 e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.openWindow("./?alarm="+encodeURIComponent((e.notification.data&&e.notification.data.med)||"")))});
