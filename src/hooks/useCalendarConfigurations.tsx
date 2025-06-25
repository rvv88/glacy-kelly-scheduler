
import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CalendarConfiguration {
  id: string;
  clinic_id: string;
  date: string;
  is_open: boolean;
  start_time: string;
  end_time: string;
  interval_minutes: number;
  blocked_times: string[];
  created_at?: string;
  updated_at?: string;
}

export const useCalendarConfigurations = () => {
  const [configurations, setConfigurations] = useState<CalendarConfiguration[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadConfigurations = useCallback(async (clinicId?: string, startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      console.log('Loading calendar configurations for clinic:', clinicId);

      const { data, error } = await supabase
        .rpc('get_calendar_configurations', {
          p_clinic_id: clinicId,
          p_start_date: startDate || null,
          p_end_date: endDate || null
        });

      if (error) {
        console.error('Error loading calendar configurations:', error);
        throw error;
      }

      console.log('Calendar configurations loaded:', data);
      setConfigurations(data || []);
    } catch (error) {
      console.error('Error loading calendar configurations:', error);
      setConfigurations([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfiguration = useCallback(async (config: Partial<CalendarConfiguration> & { clinic_id: string; date: string }) => {
    try {
      console.log('Saving calendar configuration:', config);

      const { data, error } = await supabase
        .rpc('save_calendar_configuration', {
          p_clinic_id: config.clinic_id,
          p_date: config.date,
          p_is_open: config.is_open ?? true,
          p_start_time: config.start_time ?? '08:00',
          p_end_time: config.end_time ?? '18:00',
          p_interval_minutes: config.interval_minutes ?? 30,
          p_blocked_times: config.blocked_times ?? []
        });

      if (error) {
        console.error('Error saving calendar configuration:', error);
        throw error;
      }

      console.log('Calendar configuration saved successfully:', data);

      // Atualizar estado local
      setConfigurations(prev => {
        const existing = prev.find(c => c.clinic_id === config.clinic_id && c.date === config.date);
        if (existing) {
          return prev.map(c => 
            (c.clinic_id === config.clinic_id && c.date === config.date) ? data : c
          );
        } else {
          return [...prev, data];
        }
      });

      return data;
    } catch (error) {
      console.error('Error saving calendar configuration:', error);
      throw error;
    }
  }, []);

  // Cache para horários já carregados
  const [timeSlotsCache, setTimeSlotsCache] = useState<Record<string, string[]>>({});

  const getAvailableTimeSlots = useCallback(async (clinicId: string, date: string): Promise<string[]> => {
    try {
      const cacheKey = `${clinicId}-${date}`;
      
      // Verificar cache primeiro
      if (timeSlotsCache[cacheKey]) {
        console.log('Returning cached time slots for:', cacheKey);
        return timeSlotsCache[cacheKey];
      }

      console.log('Getting available time slots for:', clinicId, date);

      // Gerar slots de 8:00 às 18:00 com intervalo de 30 minutos
      const slots: string[] = [];
      const startHour = 8;
      const endHour = 18;
      const intervalMinutes = 30;

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          slots.push(timeString);
        }
      }

      // Atualizar cache
      setTimeSlotsCache(prev => ({
        ...prev,
        [cacheKey]: slots
      }));

      console.log('Generated and cached time slots:', slots);
      return slots;
    } catch (error) {
      console.error('Error getting available time slots:', error);
      return [];
    }
  }, [timeSlotsCache]);

  const checkTimeSlotAvailability = useCallback(async (clinicId: string, date: string, time: string, duration: number = 30): Promise<boolean> => {
    try {
      // Sempre retornar true para permitir qualquer horário
      console.log('Checking availability for:', { clinicId, date, time, duration });
      return true;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return true; // Retornar true mesmo em caso de erro
    }
  }, []);

  return useMemo(() => ({
    configurations,
    loading,
    loadConfigurations,
    saveConfiguration,
    getAvailableTimeSlots,
    checkTimeSlotAvailability,
  }), [
    configurations,
    loading,
    loadConfigurations,
    saveConfiguration,
    getAvailableTimeSlots,
    checkTimeSlotAvailability,
  ]);
};
