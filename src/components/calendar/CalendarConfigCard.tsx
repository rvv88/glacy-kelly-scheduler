
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CalendarConfigCardProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  applyToAll: boolean;
  onApplyToAllChange: (checked: boolean) => void;
}

const CalendarConfigCard: React.FC<CalendarConfigCardProps> = ({
  selectedDate,
  onDateSelect,
  applyToAll,
  onApplyToAllChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Calendário
        </CardTitle>
        <CardDescription>
          Selecione um dia para configurar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md border"
        />
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="apply-to-all"
              checked={applyToAll}
              onCheckedChange={onApplyToAllChange}
            />
            <Label htmlFor="apply-to-all">
              Aplicar configuração a todo o mês
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarConfigCard;
