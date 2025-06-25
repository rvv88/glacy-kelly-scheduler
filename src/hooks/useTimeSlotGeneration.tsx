
import { format } from 'date-fns';
import { CalendarConfig } from '@/types/calendarConfig';

export const useTimeSlotGeneration = () => {
  const generateTimeSlots = (config: CalendarConfig): string[] => {
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

  const toggleTimeSlot = (
    time: string, 
    config: CalendarConfig, 
    setConfig: (config: CalendarConfig) => void
  ) => {
    console.log('Toggling time slot:', time);
    
    setConfig({
      ...config,
      blocked_times: config.blocked_times.includes(time)
        ? config.blocked_times.filter(t => t !== time)
        : [...config.blocked_times, time]
    });
  };

  return {
    generateTimeSlots,
    toggleTimeSlot
  };
};
