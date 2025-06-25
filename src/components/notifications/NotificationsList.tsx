
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, Calendar, Clock, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationsList: React.FC = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground mt-2">Carregando notificações...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center">
        <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold text-sm">Notificações</h3>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Marcar todas como lidas
          </Button>
        )}
      </div>
      
      <ScrollArea className="max-h-96">
        <div className="p-2 space-y-1">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-background'
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex items-start gap-2">
                <div className={`p-1 rounded-full ${
                  notification.type === 'confirmed' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {notification.type === 'confirmed' ? (
                    <Calendar className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(notification.created_at), "dd 'de' MMMM 'às' HH:mm", { 
                      locale: ptBR 
                    })}
                  </p>
                </div>
                
                {!notification.read && (
                  <Badge variant="secondary" className="h-2 w-2 rounded-full p-0 bg-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationsList;
