
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CalendarConfiguration } from '@/hooks/useCalendarConfigurations';

interface TimeSlotGridProps {
  timeSlots: string[];
  config: CalendarConfiguration;
  onToggleBlockedTime: (time: string) => void;
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  timeSlots,
  config,
  onToggleBlockedTime,
}) => {
  const isTimeBlocked = (time: string, config: CalendarConfiguration): boolean => {
    // Verificar se está bloqueado manualmente
    if (config.blocked_times.includes(time)) return true;
    
    // Verificar se está no horário de almoço
    if (config.lunch_break_start && config.lunch_break_end) {
      return time >= config.lunch_break_start && time < config.lunch_break_end;
    }
    
    return false;
  };

  return (
    <div>
      <Label>Horários Disponíveis</Label>
      <p className="text-sm text-muted-foreground mb-2">
        Clique nos horários para bloquear/desbloquear (vermelho = bloqueado)
      </p>
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {timeSlots.map((time) => {
          const isBlocked = isTimeBlocked(time, config);
          const isManuallyBlocked = config.blocked_times.includes(time);
          
          return (
            <Button
              key={time}
              variant={isManuallyBlocked ? "destructive" : "outline"}
              size="sm"
              onClick={() => onToggleBlockedTime(time)}
              className={`text-xs ${
                isBlocked && !isManuallyBlocked 
                  ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                  : ''
              }`}
              disabled={isBlocked && !isManuallyBlocked}
            >
              {time}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotGrid;
