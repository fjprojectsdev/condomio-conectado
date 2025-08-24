importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBPbQuMvRIwk4dDkQmIvYf4IqcTCb61uv0",
  authDomain: "condominio-conectado-94f9f.firebaseapp.com",
  projectId: "condominio-conectado-94f9f",
  storageBucket: "condominio-conectado-94f9f.firebasestorage.app",
  messagingSenderId: "510887003433",
  appId: "1:510887003433:web:fb6184a861455c9d2ca338"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});