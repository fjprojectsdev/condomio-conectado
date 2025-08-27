import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister().then(function(success) {
        if (success) {
          console.log('Service Worker unregistered:', registration.scope);
        } else {
          console.error('Failed to unregister Service Worker:', registration.scope);
        }
      }).catch(function(error) {
        console.error('Error unregistering Service Worker:', error);
      });
    }
  }).catch(function(error) {
    console.error('Error getting Service Worker registrations:', error);
  });

  caches.keys().then(function(cacheNames) {
    for (let cacheName of cacheNames) {
      caches.delete(cacheName).then(function() {
        console.log('Cache deleted:', cacheName);
      }).catch(function(error) {
        console.error('Error deleting cache:', cacheName, error);
      });
    }
  }).catch(function(error) {
    console.error('Error getting cache keys:', error);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
