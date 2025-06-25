
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CalendarConfig } from '@/types/calendarConfig';
import { useCalendarConfigurations } from '@/hooks/useCalendarConfigurations';

export const useConfigurationSaver = () => {
  const { saveConfiguration, loadConfigurations } = useCalendarConfigurations();

  const saveConfig = async (
    selectedClinicId: string,
    isMonthlyConfig: boolean,
    selectedDate: Date | undefined,
    monthlyConfig: CalendarConfig,
    dailyConfig: CalendarConfig,
    setIsLoading: (loading: boolean) => void
  ) => {
    if (!selectedClinicId) {
      toast.error('Selecione uma clínica');
      return;
    }

    console.log('Starting save process...');
    setIsLoading(true);
    
    try {
      if (isMonthlyConfig) {
        console.log('Saving monthly configuration:', monthlyConfig);
        const today = new Date();
        const monthKey = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd');
        
        const configToSave = {
          clinic_id: selectedClinicId,
          date: monthKey,
          is_open: monthlyConfig.is_open,
          start_time: monthlyConfig.start_time,
          end_time: monthlyConfig.end_time,
          interval_minutes: monthlyConfig.interval_minutes,
          blocked_times: monthlyConfig.blocked_times
        };
        
        console.log('Saving config:', configToSave);
        await saveConfiguration(configToSave);
        toast.success('Configuração mensal salva com sucesso!');
        
      } else if (selectedDate) {
        console.log('Saving daily configuration:', dailyConfig);
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        const configToSave = {
          clinic_id: selectedClinicId,
          date: dateKey,
          is_open: dailyConfig.is_open,
          start_time: dailyConfig.start_time,
          end_time: dailyConfig.end_time,
          interval_minutes: dailyConfig.interval_minutes,
          blocked_times: dailyConfig.blocked_times
        };
        
        console.log('Saving daily config:', configToSave);
        await saveConfiguration(configToSave);
        toast.success(`Configuração salva para ${format(selectedDate, 'dd/MM/yyyy')}!`);
      }
      
      // Recarregar configurações após salvar
      if (selectedClinicId) {
        const today = new Date();
        const startOfMonth = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd');
        const endOfMonth = format(new Date(today.getFullYear(), today.getMonth() + 1, 0), 'yyyy-MM-dd');
        
        console.log('Reloading configurations...');
        await loadConfigurations(selectedClinicId, startOfMonth, endOfMonth);
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveConfig
  };
};
