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
        // Simular notificações para demonstração
        // Em produção, isso viria do banco de dados
        const mockNotifications: Notification[] = [
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

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
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
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      
      // Atualizar contador de não lidas
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Em produção, salvar no banco de dados
      // await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
      
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
      
      // Em produção, salvar no banco de dados
      // await supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
      
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

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Remover notificação
  const removeNotification = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Em produção, remover do banco de dados
      // await supabase.from('notifications').delete().eq('id', notificationId);
      
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