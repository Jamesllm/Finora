/**
 * Service Worker
 * Maneja el cache y funcionalidad offline
 */

const CACHE_NAME = 'finanzas-offline-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/transactions',
  '/categories',
  '/reports',
  '/settings',
  '/offline',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
  
  // Activar inmediatamente
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Tomar control inmediatamente
  return self.clients.claim();
});

// Intercepción de peticiones (Fetch)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo cachear peticiones HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Estrategia: Network First, fallback a Cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Si la respuesta es válida, clonarla y guardarla en cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, buscar en cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Si no hay en cache y es una navegación, mostrar página offline
          if (request.mode === 'navigate') {
            return caches.match('/offline');
          }
          
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

// Manejo de mensajes desde el cliente
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});

// Sincronización en background (opcional)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

// Función de ejemplo para sincronización
async function syncTransactions() {
  console.log('[SW] Syncing transactions...');
  // Aquí podrías sincronizar datos si tuvieras un backend
  return Promise.resolve();
}