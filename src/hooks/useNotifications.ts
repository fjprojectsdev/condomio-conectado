import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: 'encomenda' | 'comunicado' | 'chat' | 'sugestao';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
}

export const useNotifications = () => {
  const { supabase, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carregar notificações existentes
  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        // Carregar notificações do localStorage
        const savedNotifications = localStorage.getItem('notifications');
        let notificationsToLoad: Notification[];
        
        if (savedNotifications) {
          notificationsToLoad = JSON.parse(savedNotifications).map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt)
          }));
        } else {
          // Notificações padrão se não houver salvas
          notificationsToLoad = [
            {
              id: '1',
              type: 'encomenda',
              title: 'Nova encomenda',
              message: 'Você tem uma encomenda na portaria',
              read: false,
              createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
              link: '/encomendas'
            },
            {
              id: '2',
              type: 'comunicado',
              title: 'Comunicado importante',
              message: 'Manutenção programada para amanhã',
              read: false,
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
              link: '/comunicados'
            }
          ];
        }

        setNotifications(notificationsToLoad);
        setUnreadCount(notificationsToLoad.filter(n => !n.read).length);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  // Marcar notificação como lida
  const markAsRead = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      );
      
      setNotifications(updatedNotifications);
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Salvar no localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
      
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      
      // Salvar no localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  // Adicionar nova notificação
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      read: false
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);
    
    // Salvar no localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Remover notificação
  const removeNotification = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      
      // Salvar no localStorage
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  };
};