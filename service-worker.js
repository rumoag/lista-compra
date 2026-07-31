// Service worker mínimo: solo cachea el shell estático (HTML/CSS/manifest/iconos) para que
// la PWA sea instalable y abra offline. Las peticiones a Supabase (datos en vivo) y a los
// módulos de /src siempre van a red — cachearlas daría datos obsoletos o rompería el CSP.
// Ver aidlc-docs/construction/pwa/.
const CACHE_NAME = 'lista-compra-shell-v4';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/css/tokens.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !SHELL_ASSETS.includes(url.pathname)) return;

  // index.html va network-first: si hay red, siempre trae la versión desplegada
  // más reciente (evita quedarse pegado a un HTML viejo mientras el SW no
  // termine de actualizarse); si no hay red, cae a la copia cacheada.
  if (url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
