
import { format } from 'date-fns';
import { CalendarConfig } from '@/types/calendarConfig';
import { CalendarConfiguration } from '@/hooks/useCalendarConfigurations';

export const useDateSelection = () => {
  const selectDate = (
    date: Date | undefined,
    selectedDate: Date | undefined,
    setSelectedDate: (date: Date | undefined) => void,
    setIsMonthlyConfig: (isMonthly: boolean) => void,
    selectedClinicId: string,
    configurations: CalendarConfiguration[],
    monthlyConfig: CalendarConfig,
    setDailyConfig: (config: CalendarConfig) => void
  ) => {
    console.log('Selecting date:', date);
    
    if (date && selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')) {
      // Clicou no mesmo dia - volta para configuração mensal
      setSelectedDate(undefined);
      setIsMonthlyConfig(true);
      console.log('Switched back to monthly config');
    } else if (date) {
      // Selecionou um dia específico
      setSelectedDate(date);
      setIsMonthlyConfig(false);
      
      // Carregar configuração específica do dia se existir
      const dateKey = format(date, 'yyyy-MM-dd');
      const existingConfig = configurations.find(config => 
        config.clinic_id === selectedClinicId && config.date === dateKey
      );
      
      if (existingConfig) {
        console.log('Found existing config for date:', existingConfig);
        setDailyConfig({
          is_open: existingConfig.is_open,
          start_time: existingConfig.start_time,
          end_time: existingConfig.end_time,
          interval_minutes: existingConfig.interval_minutes,
          blocked_times: existingConfig.blocked_times
        });
      } else {
        console.log('No existing config found, using monthly as base');
        setDailyConfig({ ...monthlyConfig });
      }
    }
  };

  return {
    selectDate
  };
};
