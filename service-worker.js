const CACHE_NAME = 'sistema-votacion-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/registro.html',
    '/encuesta.html',
    '/admin.html',
    '/dashboard.html',
    '/css/styles.css',
    '/css/responsive.css',
    '/js/app.js',
    '/js/database.js',
    '/js/seguridad.js',
    '/manifest.json',
    '/assets/favicon.ico'
];

// Instalación
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activación
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch
self.addEventListener('fetch', (event) => {
    // Solo cachear GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en cache, devolverlo
                if (response) {
                    return response;
                }

                // Si no está en cache, fetch y cachear
                return fetch(event.request)
                    .then((response) => {
                        // Verificar que sea una respuesta válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clonar la respuesta
                        const responseToCache = response.clone();

                        // Guardar en cache
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Si falla el fetch, devolver página offline
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Mensajes del cliente
self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});