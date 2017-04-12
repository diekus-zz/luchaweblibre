// Perform install steps
var CACHE_NAME = 'lucha-web-libre-v1';
var urlsToCache = [
    'js/luchaweblibre.js',
    'js/phaser.min.js',
    'img/icon192.png',
    'img/icon512.png',
    'img/bgxp.jpg',
    'img/cloud_1.png',
    'img/cloud_2.png',
    'img/ff.png',
    'img/sp.png',
    'img/ground_green.png',
    'css/style.css',
    'data/level00.json',
    'data/level01.json',
    'index.html'
];

self.addEventListener('install', function(event) {
// Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
        return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['lucha-web-libre-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});