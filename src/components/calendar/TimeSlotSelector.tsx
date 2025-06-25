
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeSlotSelectorProps {
  timeSlots: string[];
  blockedTimes: string[];
  onToggleTimeSlot: (time: string) => void;
  isOpen: boolean;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  timeSlots,
  blockedTimes,
  onToggleTimeSlot,
  isOpen
}) => {
  if (!isOpen) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horários Disponíveis
          </CardTitle>
          <CardDescription>
            A agenda está fechada
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Horários Disponíveis
        </CardTitle>
        <CardDescription>
          Clique nos horários para ativar/desativar (vermelho = desativado)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
          {timeSlots.map((time) => {
            const isBlocked = blockedTimes.includes(time);
            
            return (
              <Button
                key={time}
                variant={isBlocked ? "destructive" : "outline"}
                size="sm"
                onClick={() => onToggleTimeSlot(time)}
                className="text-xs"
              >
                {time}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelector;
