
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CalendarConfiguration } from '@/hooks/useCalendarConfigurations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
  if (!selectedDate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Dia</CardTitle>
          <CardDescription>
            Selecione uma data no calendário para configurar
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Configuração - {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
        </CardTitle>
        <CardDescription>
          Configure os horários de funcionamento para este dia
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status de funcionamento */}
        <div className="flex items-center space-x-2">
          <Switch
            id="is-open"
            checked={config.is_open}
            onCheckedChange={(checked) => onUpdateConfig({ is_open: checked })}
          />
          <Label htmlFor="is-open">
            {config.is_open ? 'Funcionando' : 'Fechado'}
          </Label>
        </div>

        {config.is_open && (
          <>
            {/* Horários de funcionamento */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Horário de Início</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={config.start_time}
                  onChange={(e) => onUpdateConfig({ start_time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-time">Horário de Fim</Label>
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
              <Label htmlFor="interval">Intervalo entre consultas (minutos)</Label>
              <Input
                id="interval"
                type="number"
                min="15"
                max="120"
                step="15"
                value={config.interval_minutes}
                onChange={(e) => onUpdateConfig({ interval_minutes: parseInt(e.target.value) })}
              />
            </div>

            {/* Horário de almoço */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lunch-start">Início do Almoço</Label>
                <Input
                  id="lunch-start"
                  type="time"
                  value={config.lunch_break_start || ''}
                  onChange={(e) => onUpdateConfig({ lunch_break_start: e.target.value || undefined })}
                />
              </div>
              <div>
                <Label htmlFor="lunch-end">Fim do Almoço</Label>
                <Input
                  id="lunch-end"
                  type="time"
                  value={config.lunch_break_end || ''}
                  onChange={(e) => onUpdateConfig({ lunch_break_end: e.target.value || undefined })}
                />
              </div>
            </div>

            {/* Grid de horários disponíveis */}
            {timeSlots.length > 0 && (
              <TimeSlotGrid
                timeSlots={timeSlots}
                config={config}
                onToggleBlockedTime={onToggleBlockedTime}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DayConfigCard;
