
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useClinics } from '@/hooks/useClinics';
import { useCalendarConfigurations, CalendarConfiguration } from '@/hooks/useCalendarConfigurations';
import ClinicSelectorCard from './ClinicSelectorCard';
import CalendarConfigCard from './CalendarConfigCard';
import DayConfigCard from './DayConfigCard';

const AdminCalendarConfig: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [applyToAll, setApplyToAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { clinics, loading: clinicsLoading } = useClinics();
  const { configurations, loading: configLoading, saveConfiguration, loadConfigurations } = useCalendarConfigurations();
  
  // Configuração padrão para novos dias
  const defaultConfig = {
    is_open: true,
    start_time: '08:00',
    end_time: '18:00',
    interval_minutes: 30,
    blocked_times: [] as string[],
    lunch_break_start: '12:00',
    lunch_break_end: '13:00'
  };

  // Estado local para as configurações sendo editadas
  const [localConfig, setLocalConfig] = useState<CalendarConfiguration | null>(null);

  useEffect(() => {
    console.log('Selected clinic changed:', selectedClinicId);
    if (selectedClinicId) {
      loadConfigurations(selectedClinicId);
    }
  }, [selectedClinicId]);

  useEffect(() => {
    console.log('Date or clinic changed:', selectedDate, selectedClinicId);
    if (selectedDate && selectedClinicId) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const existing = configurations.find(config => 
        config.clinic_id === selectedClinicId && config.date === dateKey
      );
      
      console.log('Found existing config:', existing);
      
      if (existing) {
        setLocalConfig(existing);
      } else {
        const newConfig: CalendarConfiguration = { 
          ...defaultConfig, 
          id: '', 
          clinic_id: selectedClinicId, 
          date: dateKey 
        };
        setLocalConfig(newConfig);
      }
    }
  }, [selectedDate, selectedClinicId, configurations]);

  const handleSaveConfiguration = async () => {
    if (!localConfig || !selectedDate || !selectedClinicId) {
      toast.error('Selecione uma clínica e uma data');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (applyToAll) {
        // Aplicar a todos os dias do mês
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const promises = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const dayKey = format(new Date(year, month, day), 'yyyy-MM-dd');
          const configForDay = { 
            ...localConfig, 
            date: dayKey,
            clinic_id: selectedClinicId
          };
          promises.push(saveConfiguration(configForDay));
        }
        
        await Promise.all(promises);
        toast.success('Configuração aplicada a todo o mês!');
      } else {
        const configToSave = {
          ...localConfig,
          clinic_id: selectedClinicId,
          date: format(selectedDate, 'yyyy-MM-dd')
        };
        await saveConfiguration(configToSave);
        toast.success('Configuração salva com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocalConfig = (updates: Partial<CalendarConfiguration>) => {
    if (localConfig) {
      setLocalConfig({ ...localConfig, ...updates });
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

  const toggleBlockedTime = (time: string) => {
    if (!localConfig) return;
    
    const blockedTimes = localConfig.blocked_times.includes(time)
      ? localConfig.blocked_times.filter(t => t !== time)
      : [...localConfig.blocked_times, time];
    
    updateLocalConfig({ blocked_times: blockedTimes });
  };

  if (clinicsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!localConfig && selectedClinicId && selectedDate) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const timeSlots = localConfig ? generateTimeSlots(localConfig) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurar Agenda</h2>
          <p className="text-muted-foreground">
            Configure os horários disponíveis para agendamento por clínica
          </p>
        </div>
        <Button 
          onClick={handleSaveConfiguration}
          disabled={isLoading || !selectedClinicId || !localConfig}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Salvando...' : 'Salvar Configuração'}
        </Button>
      </div>

      {/* Seleção de Clínica */}
      <ClinicSelectorCard
        clinics={clinics}
        selectedClinicId={selectedClinicId}
        onClinicChange={setSelectedClinicId}
      />

      {selectedClinicId && localConfig && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendário */}
          <CalendarConfigCard
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            applyToAll={applyToAll}
            onApplyToAllChange={setApplyToAll}
          />

          {/* Configuração do Dia */}
          <DayConfigCard
            selectedDate={selectedDate}
            config={localConfig}
            onUpdateConfig={updateLocalConfig}
            timeSlots={timeSlots}
            onToggleBlockedTime={toggleBlockedTime}
          />
        </div>
      )}
    </div>
  );
};

export default AdminCalendarConfig;
