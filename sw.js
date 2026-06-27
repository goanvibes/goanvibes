const CACHE = 'colourxd-overgrowth-v1';
const FILES = ['index.html','styles.css','script.js','jungle-hero.webp','overgrowth-top-left.png','overgrowth-bottom-right.png','ai-unlocked-cover.svg','controversial-characters-cover.svg','leaf-field.svg','favicon.svg'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => { if (e.request.method !== 'GET') return; e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
