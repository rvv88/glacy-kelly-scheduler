
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthdate: string;
  address: string;
  clinicId: string;
  notes?: string;
  userId: string;
}

export const usePatientProfile = () => {
  const { user } = useAuth();
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (user) {
      loadPatientProfile();
    } else {
      setLoading(false);
      setHasProfile(false);
      setPatientProfile(null);
    }
  }, [user]);

  const loadPatientProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('patient_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading patient profile:', error);
      }

      if (data) {
        const profile: PatientProfile = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
          birthdate: data.birthdate,
          address: data.address,
          clinicId: data.clinic_id,
          notes: data.notes || undefined,
          userId: data.user_id,
        };
        setPatientProfile(profile);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error('Error loading patient profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePatientProfile = async (profileData: Omit<PatientProfile, 'id' | 'userId'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('patient_profiles')
        .upsert({
          user_id: user.id,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          cpf: profileData.cpf,
          birthdate: profileData.birthdate,
          address: profileData.address,
          clinic_id: profileData.clinicId,
          notes: profileData.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newProfile: PatientProfile = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        birthdate: data.birthdate,
        address: data.address,
        clinicId: data.clinic_id,
        notes: data.notes || undefined,
        userId: data.user_id,
      };

      setPatientProfile(newProfile);
      setHasProfile(true);
      
      return data;
    } catch (error) {
      console.error('Error saving patient profile:', error);
      throw error;
    }
  };

  return {
    patientProfile,
    hasProfile,
    loading,
    savePatientProfile,
    refreshProfile: loadPatientProfile,
  };
};
