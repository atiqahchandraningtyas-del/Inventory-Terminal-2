/**
 * PT PELINDO PETIKEMAS - WORKSHOP T2
 * Service Worker (sw.js)
 * Memungkinkan fungsi offline dan instalasi PWA
 */

const CACHE_NAME = 'pld-inventory-v2';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo pelindo.jpg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Tahap Install: Menyimpan aset ke dalam cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Menyimpan aset ke cache...');
      return cache.addAll(assetsToCache);
    })
  );
});

// Tahap Activate: Membersihkan cache lama jika ada pembaruan versi
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Tahap Fetch: Mengambil data dari cache jika sedang offline
self.addEventListener('fetch', event => {
  // Hanya menangani permintaan GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Jika ada di cache, gunakan cache. Jika tidak, ambil dari jaringan.
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback jika jaringan gagal dan tidak ada di cache
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
