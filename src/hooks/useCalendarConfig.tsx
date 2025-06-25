
import { useEffect } from 'react';
import { format } from 'date-fns';
import { useClinics } from '@/hooks/useClinics';
import { useCalendarConfigurations } from '@/hooks/useCalendarConfigurations';
import { useCalendarState } from '@/hooks/useCalendarState';
import { useTimeSlotGeneration } from '@/hooks/useTimeSlotGeneration';
import { useDateSelection } from '@/hooks/useDateSelection';
import { useConfigurationSaver } from '@/hooks/useConfigurationSaver';

export const useCalendarConfig = () => {
  const {
    selectedClinicId,
    setSelectedClinicId,
    selectedDate,
    setSelectedDate,
    isMonthlyConfig,
    setIsMonthlyConfig,
    isLoading,
    setIsLoading,
    monthlyConfig,
    setMonthlyConfig,
    dailyConfig,
    setDailyConfig
  } = useCalendarState();

  const { clinics, loading: clinicsLoading } = useClinics();
  const { configurations, loading: configLoading, loadConfigurations } = useCalendarConfigurations();
  const { generateTimeSlots, toggleTimeSlot } = useTimeSlotGeneration();
  const { selectDate } = useDateSelection();
  const { saveConfig } = useConfigurationSaver();

  // Carregar configurações quando selecionar clínica
  useEffect(() => {
    if (selectedClinicId) {
      console.log('Loading configurations for clinic:', selectedClinicId);
      const today = new Date();
      const startOfMonth = format(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd');
      const endOfMonth = format(new Date(today.getFullYear(), today.getMonth() + 1, 0), 'yyyy-MM-dd');
      
      loadConfigurations(selectedClinicId, startOfMonth, endOfMonth);
    }
  }, [selectedClinicId, loadConfigurations]);

  const currentConfig = isMonthlyConfig ? monthlyConfig : dailyConfig;
  const setCurrentConfig = isMonthlyConfig ? setMonthlyConfig : setDailyConfig;
  const timeSlots = generateTimeSlots(currentConfig);

  const handleToggleTimeSlot = (time: string) => {
    toggleTimeSlot(time, currentConfig, setCurrentConfig);
  };

  const handleSelectDate = (date: Date | undefined) => {
    selectDate(
      date,
      selectedDate,
      setSelectedDate,
      setIsMonthlyConfig,
      selectedClinicId,
      configurations,
      monthlyConfig,
      setDailyConfig
    );
  };

  const handleSaveConfig = async () => {
    await saveConfig(
      selectedClinicId,
      isMonthlyConfig,
      selectedDate,
      monthlyConfig,
      dailyConfig,
      setIsLoading
    );
  };

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
    selectDate: handleSelectDate,
    toggleTimeSlot: handleToggleTimeSlot,
    saveConfig: handleSaveConfig,
    setCurrentConfig
  };
};
