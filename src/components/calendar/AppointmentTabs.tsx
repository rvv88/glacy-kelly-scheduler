
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock } from 'lucide-react';
import AppointmentCard from './AppointmentCard';

interface AppointmentTabsProps {
  pendingAppointments: any[];
  confirmedAppointments: any[];
  cancelledAppointments: any[];
  processingId: string | null;
  onApprove: (appointmentId: string) => void;
  onReject: (appointmentId: string) => void;
}

const AppointmentTabs: React.FC<AppointmentTabsProps> = ({
  pendingAppointments,
  confirmedAppointments,
  cancelledAppointments,
  processingId,
  onApprove,
  onReject
}) => {
  const EmptyState = ({ icon: Icon, message }: { icon: any; message: string }) => (
    <Card>
      <CardContent className="flex items-center justify-center h-32">
        <div className="text-center">
          <Icon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending" className="relative">
          Pendentes
          {pendingAppointments.length > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {pendingAppointments.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4">
        {pendingAppointments.length === 0 ? (
          <EmptyState icon={Clock} message="Nenhuma solicitação pendente" />
        ) : (
          <div className="grid gap-4">
            {pendingAppointments.map(appointment => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                showActions={true}
                processingId={processingId}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="confirmed" className="space-y-4">
        {confirmedAppointments.length === 0 ? (
          <EmptyState icon={Check} message="Nenhum agendamento confirmado" />
        ) : (
          <div className="grid gap-4">
            {confirmedAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="cancelled" className="space-y-4">
        {cancelledAppointments.length === 0 ? (
          <EmptyState icon={X} message="Nenhum agendamento cancelado" />
        ) : (
          <div className="grid gap-4">
            {cancelledAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AppointmentTabs;
