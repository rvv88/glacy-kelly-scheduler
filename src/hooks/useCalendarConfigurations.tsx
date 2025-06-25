
import { useState, useEffect } from 'react';
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
  lunch_break_start?: string;
  lunch_break_end?: string;
  blocked_times: string[];
  created_at?: string;
  updated_at?: string;
}

export const useCalendarConfigurations = () => {
  const [configurations, setConfigurations] = useState<CalendarConfiguration[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadConfigurations = async (clinicId?: string) => {
    try {
      setLoading(true);
      console.log('Loading calendar configurations for clinic:', clinicId);

      let query = supabase
        .from('calendar_configurations')
        .select('*')
        .order('date', { ascending: true });

      if (clinicId) {
        query = query.eq('clinic_id', clinicId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading calendar configurations:', error);
        throw error;
      }

      console.log('Calendar configurations loaded:', data);
      setConfigurations(data || []);
    } catch (error) {
      console.error('Error loading calendar configurations:', error);
      setConfigurations([]);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async (config: Partial<CalendarConfiguration> & { clinic_id: string; date: string }) => {
    try {
      console.log('Saving calendar configuration:', config);

      // Preparar dados para inserção/atualização
      const configData = {
        clinic_id: config.clinic_id,
        date: config.date,
        is_open: config.is_open ?? true,
        start_time: config.start_time ?? '08:00',
        end_time: config.end_time ?? '18:00',
        interval_minutes: config.interval_minutes ?? 30,
        lunch_break_start: config.lunch_break_start || null,
        lunch_break_end: config.lunch_break_end || null,
        blocked_times: config.blocked_times ?? []
      };

      const { data, error } = await supabase
        .from('calendar_configurations')
        .upsert(configData, {
          onConflict: 'clinic_id,date'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving calendar configuration:', error);
        throw error;
      }

      console.log('Calendar configuration saved:', data);

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
  };

  const getAvailableTimeSlots = async (clinicId: string, date: string): Promise<string[]> => {
    try {
      console.log('Getting available time slots for:', clinicId, date);

      const { data, error } = await supabase
        .rpc('get_available_time_slots', {
          p_clinic_id: clinicId,
          p_date: date
        });

      if (error) {
        console.error('Error getting available time slots:', error);
        return [];
      }

      console.log('Available time slots:', data);
      return data?.map((slot: any) => slot.time_slot) || [];
    } catch (error) {
      console.error('Error getting available time slots:', error);
      return [];
    }
  };

  const checkTimeSlotAvailability = async (clinicId: string, date: string, time: string, duration: number = 30): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('check_time_slot_availability', {
          p_clinic_id: clinicId,
          p_date: date,
          p_time: time,
          p_duration: duration
        });

      if (error) {
        console.error('Error checking time slot availability:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  };

  return {
    configurations,
    loading,
    loadConfigurations,
    saveConfiguration,
    getAvailableTimeSlots,
    checkTimeSlotAvailability,
  };
};
