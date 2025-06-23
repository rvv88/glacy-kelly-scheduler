
import React, { useState, useEffect } from 'react';
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
import { useClinics } from '@/hooks/useClinics';
import { useCalendarConfigurations, CalendarConfiguration } from '@/hooks/useCalendarConfigurations';

const AdminCalendarConfig: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [applyToAll, setApplyToAll] = useState(false);
  const { clinics, loading: clinicsLoading } = useClinics();
  const { configurations, loading: configLoading, saveConfiguration, loadConfigurations } = useCalendarConfigurations();
  
  // Configuração padrão para novos dias
  const defaultConfig: Omit<CalendarConfiguration, 'id' | 'clinic_id' | 'date' | 'created_at' | 'updated_at'> = {
    is_open: true,
    start_time: '08:00',
    end_time: '18:00',
    interval_minutes: 30,
    blocked_times: [],
    lunch_break_start: '12:00',
    lunch_break_end: '13:00'
  };

  useEffect(() => {
    if (selectedClinicId) {
      loadConfigurations(selectedClinicId);
    }
  }, [selectedClinicId]);

  const getCurrentDayConfig = (): CalendarConfiguration => {
    const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    const existing = configurations.find(config => 
      config.clinic_id === selectedClinicId && config.date === dateKey
    );
    
    return existing || { 
      ...defaultConfig, 
      id: '', 
      clinic_id: selectedClinicId, 
      date: dateKey 
    };
  };

  const updateDayConfig = async (updates: Partial<CalendarConfiguration>) => {
    if (!selectedDate || !selectedClinicId) return;
    
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const currentConfig = getCurrentDayConfig();
    const newConfig = { 
      ...currentConfig, 
      ...updates, 
      clinic_id: selectedClinicId,
      date: dateKey 
    };
    
    try {
      if (applyToAll) {
        // Aplicar a todos os dias do mês
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const promises = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const dayKey = format(new Date(year, month, day), 'yyyy-MM-dd');
          const configForDay = { ...newConfig, date: dayKey };
          promises.push(saveConfiguration(configForDay));
        }
        
        await Promise.all(promises);
        toast.success('Configuração aplicada a todo o mês!');
      } else {
        await saveConfiguration(newConfig);
        toast.success('Configuração salva com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao salvar configuração');
    }
  };

  const generateTimeSlots = (config: CalendarConfiguration): string[] => {
    if (!config.is_open) return [];
    
    const slots: string[] = [];
    const start = new Date(`2000-01-01T${config.start_time}:00`);
    const end = new Date(`2000-01-01T${config.end_time}:00`);
    
    let current = new Date(start);
    while (current < end) {
      const timeString = format(current, 'HH:mm');
      slots.push(timeString);
      current.setMinutes(current.getMinutes() + config.interval_minutes);
    }
    
    return slots;
  };

  const toggleBlockedTime = async (time: string) => {
    const currentConfig = getCurrentDayConfig();
    const blockedTimes = currentConfig.blocked_times.includes(time)
      ? currentConfig.blocked_times.filter(t => t !== time)
      : [...currentConfig.blocked_times, time];
    
    await updateDayConfig({ blocked_times: blockedTimes });
  };

  const isTimeBlocked = (time: string, config: CalendarConfiguration): boolean => {
    // Verificar se está bloqueado manualmente
    if (config.blocked_times.includes(time)) return true;
    
    // Verificar se está no horário de almoço
    if (config.lunch_break_start && config.lunch_break_end) {
      return time >= config.lunch_break_start && time < config.lunch_break_end;
    }
    
    return false;
  };

  const currentConfig = getCurrentDayConfig();
  const timeSlots = generateTimeSlots(currentConfig);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurar Agenda</h2>
          <p className="text-muted-foreground">
            Configure os horários disponíveis para agendamento por clínica
          </p>
        </div>
      </div>

      {/* Seleção de Clínica */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Clínica</CardTitle>
          <CardDescription>
            Escolha a clínica para configurar a agenda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedClinicId} onValueChange={setSelectedClinicId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma clínica" />
            </SelectTrigger>
            <SelectContent>
              {clinics.map((clinic) => (
                <SelectItem key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedClinicId && (
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
                  checked={currentConfig.is_open}
                  onCheckedChange={(is_open) => updateDayConfig({ is_open })}
                />
                <Label htmlFor="day-open">
                  Agenda aberta neste dia
                </Label>
              </div>

              {currentConfig.is_open && (
                <>
                  {/* Horários de funcionamento */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-time">Horário de Abertura</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={currentConfig.start_time}
                        onChange={(e) => updateDayConfig({ start_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time">Horário de Fechamento</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={currentConfig.end_time}
                        onChange={(e) => updateDayConfig({ end_time: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Intervalo entre consultas */}
                  <div>
                    <Label htmlFor="interval">Intervalo entre consultas</Label>
                    <Select
                      value={currentConfig.interval_minutes.toString()}
                      onValueChange={(value) => updateDayConfig({ interval_minutes: parseInt(value) })}
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
                        value={currentConfig.lunch_break_start || ''}
                        onChange={(e) => updateDayConfig({
                          lunch_break_start: e.target.value || undefined
                        })}
                      />
                      <Input
                        type="time"
                        placeholder="Fim"
                        value={currentConfig.lunch_break_end || ''}
                        onChange={(e) => updateDayConfig({
                          lunch_break_end: e.target.value || undefined
                        })}
                      />
                    </div>
                  </div>

                  {/* Horários disponíveis */}
                  <div>
                    <Label>Horários Disponíveis</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Clique nos horários para bloquear/desbloquear (vermelho = bloqueado)
                    </p>
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                      {timeSlots.map((time) => {
                        const isBlocked = isTimeBlocked(time, currentConfig);
                        const isManuallyBlocked = currentConfig.blocked_times.includes(time);
                        
                        return (
                          <Button
                            key={time}
                            variant={isManuallyBlocked ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => toggleBlockedTime(time)}
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
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminCalendarConfig;
