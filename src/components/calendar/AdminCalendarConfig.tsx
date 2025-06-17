
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Save, Trash2, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface DayConfig {
  date: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
  interval: number; // em minutos
  blockedTimes: string[];
  lunchBreak?: {
    start: string;
    end: string;
  };
}

const AdminCalendarConfig: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dayConfigs, setDayConfigs] = useState<Record<string, DayConfig>>({});
  const [applyToAll, setApplyToAll] = useState(false);
  
  // Configuração padrão para novos dias
  const defaultConfig: Omit<DayConfig, 'date'> = {
    isOpen: true,
    startTime: '08:00',
    endTime: '18:00',
    interval: 30,
    blockedTimes: [],
    lunchBreak: {
      start: '12:00',
      end: '13:00'
    }
  };

  const getCurrentDayConfig = (): DayConfig => {
    const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    return dayConfigs[dateKey] || { ...defaultConfig, date: dateKey };
  };

  const updateDayConfig = (updates: Partial<DayConfig>) => {
    if (!selectedDate) return;
    
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const currentConfig = getCurrentDayConfig();
    const newConfig = { ...currentConfig, ...updates, date: dateKey };
    
    if (applyToAll) {
      // Aplicar a todos os dias do mês
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const newConfigs = { ...dayConfigs };
      for (let day = 1; day <= daysInMonth; day++) {
        const dayKey = format(new Date(year, month, day), 'yyyy-MM-dd');
        newConfigs[dayKey] = { ...newConfig, date: dayKey };
      }
      setDayConfigs(newConfigs);
    } else {
      setDayConfigs(prev => ({
        ...prev,
        [dateKey]: newConfig
      }));
    }
  };

  const generateTimeSlots = (config: DayConfig): string[] => {
    if (!config.isOpen) return [];
    
    const slots: string[] = [];
    const start = new Date(`2000-01-01T${config.startTime}:00`);
    const end = new Date(`2000-01-01T${config.endTime}:00`);
    
    let current = new Date(start);
    while (current < end) {
      const timeString = format(current, 'HH:mm');
      
      // Verificar se não está no horário de almoço
      const isLunchTime = config.lunchBreak && 
        timeString >= config.lunchBreak.start && 
        timeString < config.lunchBreak.end;
      
      // Verificar se não está bloqueado
      const isBlocked = config.blockedTimes.includes(timeString);
      
      if (!isLunchTime && !isBlocked) {
        slots.push(timeString);
      }
      
      current.setMinutes(current.getMinutes() + config.interval);
    }
    
    return slots;
  };

  const toggleBlockedTime = (time: string) => {
    const currentConfig = getCurrentDayConfig();
    const blockedTimes = currentConfig.blockedTimes.includes(time)
      ? currentConfig.blockedTimes.filter(t => t !== time)
      : [...currentConfig.blockedTimes, time];
    
    updateDayConfig({ blockedTimes });
  };

  const saveConfiguration = () => {
    // Aqui você implementaria a lógica para salvar no banco de dados
    console.log('Salvando configuração:', dayConfigs);
    toast.success('Configuração da agenda salva com sucesso!');
  };

  const currentConfig = getCurrentDayConfig();
  const timeSlots = generateTimeSlots(currentConfig);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurar Agenda</h2>
          <p className="text-muted-foreground">
            Configure os horários disponíveis para agendamento
          </p>
        </div>
        <Button onClick={saveConfiguration} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Configuração
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendário */}
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
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="apply-to-all"
                  checked={applyToAll}
                  onCheckedChange={setApplyToAll}
                />
                <Label htmlFor="apply-to-all">
                  Aplicar configuração a todo o mês
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuração do Dia */}
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
                checked={currentConfig.isOpen}
                onCheckedChange={(isOpen) => updateDayConfig({ isOpen })}
              />
              <Label htmlFor="day-open">
                Agenda aberta neste dia
              </Label>
            </div>

            {currentConfig.isOpen && (
              <>
                {/* Horários de funcionamento */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-time">Horário de Abertura</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={currentConfig.startTime}
                      onChange={(e) => updateDayConfig({ startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">Horário de Fechamento</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={currentConfig.endTime}
                      onChange={(e) => updateDayConfig({ endTime: e.target.value })}
                    />
                  </div>
                </div>

                {/* Intervalo entre consultas */}
                <div>
                  <Label htmlFor="interval">Intervalo entre consultas</Label>
                  <Select
                    value={currentConfig.interval.toString()}
                    onValueChange={(value) => updateDayConfig({ interval: parseInt(value) })}
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
                      value={currentConfig.lunchBreak?.start || ''}
                      onChange={(e) => updateDayConfig({
                        lunchBreak: {
                          ...currentConfig.lunchBreak,
                          start: e.target.value,
                          end: currentConfig.lunchBreak?.end || '13:00'
                        }
                      })}
                    />
                    <Input
                      type="time"
                      placeholder="Fim"
                      value={currentConfig.lunchBreak?.end || ''}
                      onChange={(e) => updateDayConfig({
                        lunchBreak: {
                          start: currentConfig.lunchBreak?.start || '12:00',
                          end: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>

                {/* Horários disponíveis */}
                <div>
                  <Label>Horários Disponíveis</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Clique nos horários para bloquear/desbloquear
                  </p>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={currentConfig.blockedTimes.includes(time) ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleBlockedTime(time)}
                        className="text-xs"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCalendarConfig;
