self.addEventListener('install', function(event) {
  self.skipWaiting(); // Activate new service worker immediately
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName); // Clear all caches
        })
      );
    }).then(function() {
      return self.registration.unregister(); // Unregister this service worker
    }).then(function() {
      console.log('Service Worker unregistered and caches cleared.');
    })
  );
});