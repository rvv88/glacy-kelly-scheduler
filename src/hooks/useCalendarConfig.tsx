
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useClinics } from '@/hooks/useClinics';
import { useCalendarConfigurations, CalendarConfiguration } from '@/hooks/useCalendarConfigurations';

export const useCalendarConfig = () => {
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isMonthlyConfig, setIsMonthlyConfig] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const { clinics, loading: clinicsLoading } = useClinics();
  const { configurations, loading: configLoading, saveConfiguration, loadConfigurations } = useCalendarConfigurations();
  
  // Configuração padrão mensal
  const [monthlyConfig, setMonthlyConfig] = useState({
    is_open: true,
    start_time: '08:00',
    end_time: '18:00',
    interval_minutes: 30,
    blocked_times: [] as string[]
  });

  // Configuração específica do dia
  const [dailyConfig, setDailyConfig] = useState({
    is_open: true,
    start_time: '08:00',
    end_time: '18:00',
    interval_minutes: 30,
    blocked_times: [] as string[]
  });

  useEffect(() => {
    if (selectedClinicId) {
      loadConfigurations(selectedClinicId);
    }
  }, [selectedClinicId]);

  // Gerar horários disponíveis com base na configuração
  const generateTimeSlots = (config: typeof monthlyConfig): string[] => {
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

  // Alternar seleção de horário (bloquear/desbloquear)
  const toggleTimeSlot = (time: string) => {
    if (isMonthlyConfig) {
      setMonthlyConfig(prev => ({
        ...prev,
        blocked_times: prev.blocked_times.includes(time)
          ? prev.blocked_times.filter(t => t !== time)
          : [...prev.blocked_times, time]
      }));
    } else {
      setDailyConfig(prev => ({
        ...prev,
        blocked_times: prev.blocked_times.includes(time)
          ? prev.blocked_times.filter(t => t !== time)
          : [...prev.blocked_times, time]
      }));
    }
  };

  // Selecionar data específica
  const selectDate = (date: Date | undefined) => {
    if (date && selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')) {
      // Clicou no mesmo dia - volta para configuração mensal
      setSelectedDate(undefined);
      setIsMonthlyConfig(true);
    } else if (date) {
      // Selecionou um dia específico
      setSelectedDate(date);
      setIsMonthlyConfig(false);
      
      // Carrega configuração específica do dia se existir
      const dateKey = format(date, 'yyyy-MM-dd');
      const existingConfig = configurations.find(config => 
        config.clinic_id === selectedClinicId && config.date === dateKey
      );
      
      if (existingConfig) {
        setDailyConfig({
          is_open: existingConfig.is_open,
          start_time: existingConfig.start_time,
          end_time: existingConfig.end_time,
          interval_minutes: existingConfig.interval_minutes,
          blocked_times: existingConfig.blocked_times
        });
      } else {
        // Usa configuração mensal como base
        setDailyConfig({ ...monthlyConfig });
      }
    }
  };

  // Salvar configuração
  const saveConfig = async () => {
    if (!selectedClinicId) {
      toast.error('Selecione uma clínica');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isMonthlyConfig) {
        // Salvar para todo o mês
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const promises = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const dayKey = format(new Date(year, month, day), 'yyyy-MM-dd');
          const configToSave: CalendarConfiguration = {
            id: '',
            clinic_id: selectedClinicId,
            date: dayKey,
            is_open: monthlyConfig.is_open,
            start_time: monthlyConfig.start_time,
            end_time: monthlyConfig.end_time,
            interval_minutes: monthlyConfig.interval_minutes,
            blocked_times: monthlyConfig.blocked_times,
            lunch_break_start: undefined,
            lunch_break_end: undefined
          };
          promises.push(saveConfiguration(configToSave));
        }
        
        await Promise.all(promises);
        toast.success('Configuração mensal salva com sucesso!');
      } else if (selectedDate) {
        // Salvar apenas para o dia específico
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        const configToSave: CalendarConfiguration = {
          id: '',
          clinic_id: selectedClinicId,
          date: dateKey,
          is_open: dailyConfig.is_open,
          start_time: dailyConfig.start_time,
          end_time: dailyConfig.end_time,
          interval_minutes: dailyConfig.interval_minutes,
          blocked_times: dailyConfig.blocked_times,
          lunch_break_start: undefined,
          lunch_break_end: undefined
        };
        
        await saveConfiguration(configToSave);
        toast.success(`Configuração salva para ${format(selectedDate, 'dd/MM/yyyy')}!`);
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração');
    } finally {
      setIsLoading(false);
    }
  };

  const currentConfig = isMonthlyConfig ? monthlyConfig : dailyConfig;
  const setCurrentConfig = isMonthlyConfig ? setMonthlyConfig : setDailyConfig;
  const timeSlots = generateTimeSlots(currentConfig);

  return {
    // Estados
    selectedClinicId,
    setSelectedClinicId,
    selectedDate,
    isMonthlyConfig,
    isLoading,
    clinics,
    clinicsLoading,
    currentConfig,
    timeSlots,
    
    // Ações
    selectDate,
    toggleTimeSlot,
    saveConfig,
    setCurrentConfig
  };
};
