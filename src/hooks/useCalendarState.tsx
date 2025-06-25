
import { useState } from 'react';
import { CalendarConfig, CalendarConfigState } from '@/types/calendarConfig';

const defaultConfig: CalendarConfig = {
  is_open: true,
  start_time: '08:00',
  end_time: '18:00',
  interval_minutes: 30,
  blocked_times: []
};

export const useCalendarState = () => {
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isMonthlyConfig, setIsMonthlyConfig] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [monthlyConfig, setMonthlyConfig] = useState<CalendarConfig>(defaultConfig);
  const [dailyConfig, setDailyConfig] = useState<CalendarConfig>(defaultConfig);

  return {
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
  };
};
