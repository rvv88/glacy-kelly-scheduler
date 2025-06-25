
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarConfiguration } from '@/hooks/useCalendarConfigurations';
import TimeSlotGrid from './TimeSlotGrid';

interface DayConfigCardProps {
  selectedDate: Date | undefined;
  config: CalendarConfiguration;
  onUpdateConfig: (updates: Partial<CalendarConfiguration>) => void;
  timeSlots: string[];
  onToggleBlockedTime: (time: string) => void;
}

const DayConfigCard: React.FC<DayConfigCardProps> = ({
  selectedDate,
  config,
  onUpdateConfig,
  timeSlots,
  onToggleBlockedTime,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
        </CardTitle>
        <CardDescription>
          Configure os horários para este dia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status do dia */}
        <div className="flex items-center space-x-2">
          <Switch
            id="day-open"
            checked={config.is_open}
            onCheckedChange={(is_open) => onUpdateConfig({ is_open })}
          />
          <Label htmlFor="day-open">
            Agenda aberta neste dia
          </Label>
        </div>

        {config.is_open && (
          <>
            {/* Horários de funcionamento */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Horário de Abertura</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={config.start_time}
                  onChange={(e) => onUpdateConfig({ start_time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-time">Horário de Fechamento</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={config.end_time}
                  onChange={(e) => onUpdateConfig({ end_time: e.target.value })}
                />
              </div>
            </div>

            {/* Intervalo entre consultas */}
            <div>
              <Label htmlFor="interval">Intervalo entre consultas</Label>
              <Select
                value={config.interval_minutes.toString()}
                onValueChange={(value) => onUpdateConfig({ interval_minutes: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Horário de almoço */}
            <div className="space-y-2">
              <Label>Horário de Almoço (opcional)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  placeholder="Início"
                  value={config.lunch_break_start || ''}
                  onChange={(e) => onUpdateConfig({
                    lunch_break_start: e.target.value || undefined
                  })}
                />
                <Input
                  type="time"
                  placeholder="Fim"
                  value={config.lunch_break_end || ''}
                  onChange={(e) => onUpdateConfig({
                    lunch_break_end: e.target.value || undefined
                  })}
                />
              </div>
            </div>

            {/* Horários disponíveis */}
            <TimeSlotGrid
              timeSlots={timeSlots}
              config={config}
              onToggleBlockedTime={onToggleBlockedTime}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DayConfigCard;
