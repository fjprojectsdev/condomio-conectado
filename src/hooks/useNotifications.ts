import { useState, useEffect } from 'react';
import { messaging } from '../lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';

export const useNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (!messaging) return;

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        setPermission(permission);

        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: 'YOUR_VAPID_KEY' // Configure no Firebase Console
          });
          setToken(token);
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error);
      }
    };

    requestPermission();

    // Escutar mensagens em primeiro plano
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Mensagem recebida:', payload);
      
      if (payload.notification) {
        new Notification(payload.notification.title || 'Nova mensagem', {
          body: payload.notification.body,
          icon: '/pwa-192x192.png'
        });
      }
    });

    return unsubscribe;
  }, []);

  return { token, permission };
};