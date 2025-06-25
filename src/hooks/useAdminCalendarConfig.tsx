
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useClinics } from '@/hooks/useClinics';
import { useCalendarConfigurations, CalendarConfiguration } from '@/hooks/useCalendarConfigurations';

export const useAdminCalendarConfig = () => {
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

  const toggleBlockedTime = (time: string) => {
    if (!localConfig) return;
    
    const blockedTimes = localConfig.blocked_times.includes(time)
      ? localConfig.blocked_times.filter(t => t !== time)
      : [...localConfig.blocked_times, time];
    
    updateLocalConfig({ blocked_times: blockedTimes });
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedClinicId,
    setSelectedClinicId,
    applyToAll,
    setApplyToAll,
    isLoading,
    clinics,
    clinicsLoading,
    localConfig,
    updateLocalConfig,
    toggleBlockedTime,
    handleSaveConfiguration,
  };
};
