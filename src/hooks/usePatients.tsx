
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

export interface PatientFromDB {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  user_id: string;
  clinic_id: string;
}

export const usePatients = () => {
  const [patients, setPatients] = useState<PatientFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { userRole } = useUserRole();

  useEffect(() => {
    if (user && userRole) {
      loadPatients();
    }
  }, [user, userRole]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      console.log('Loading patients with role:', userRole);
      
      // Com as novas políticas RLS, não precisamos filtrar manualmente
      // O banco já vai retornar apenas os dados que o usuário pode ver
      const { data, error } = await supabase
        .from('patient_profiles')
        .select('id, name, email, phone, cpf, user_id, clinic_id')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading patients:', error);
        return;
      }

      console.log('Patients loaded:', data);
      setPatients(data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    patients,
    loading,
    refreshPatients: loadPatients,
  };
};
