
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
  clinicName?: string; // Adicionar nome da clínica
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
      console.log('Loading patient profile for user:', user.id);
      
      // Buscar o perfil do paciente com JOIN para obter o nome da clínica
      const { data, error } = await supabase
        .from('patient_profiles')
        .select(`
          *,
          clinics:clinic_id (
            id,
            unit_name
          )
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading patient profile:', error);
      }

      if (data) {
        console.log('Patient profile found:', data);
        const profile: PatientProfile = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
          birthdate: data.birthdate,
          address: data.address,
          clinicId: data.clinic_id,
          clinicName: data.clinics?.unit_name || 'Clínica não encontrada',
          notes: data.notes || undefined,
          userId: data.user_id,
        };
        setPatientProfile(profile);
        setHasProfile(true);
      } else {
        console.log('No patient profile found for user');
        setHasProfile(false);
      }
    } catch (error) {
      console.error('Error loading patient profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePatientProfile = async (profileData: Omit<PatientProfile, 'id' | 'userId' | 'clinicName'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Saving patient profile:', profileData);
      console.log('Has existing profile:', hasProfile);
      console.log('Existing profile ID:', patientProfile?.id);

      let data, error;

      if (hasProfile && patientProfile?.id) {
        // Update existing profile
        console.log('Updating existing profile with ID:', patientProfile.id);
        const result = await supabase
          .from('patient_profiles')
          .update({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            cpf: profileData.cpf,
            birthdate: profileData.birthdate,
            address: profileData.address,
            clinic_id: profileData.clinicId,
            notes: profileData.notes || null,
          })
          .eq('id', patientProfile.id)
          .select(`
            *,
            clinics:clinic_id (
              id,
              unit_name
            )
          `)
          .single();

        data = result.data;
        error = result.error;
      } else {
        // Create new profile
        console.log('Creating new profile for user:', user.id);
        const result = await supabase
          .from('patient_profiles')
          .insert({
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
          .select(`
            *,
            clinics:clinic_id (
              id,
              unit_name
            )
          `)
          .single();

        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Error saving patient profile:', error);
        throw error;
      }

      console.log('Profile saved successfully:', data);

      const newProfile: PatientProfile = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        birthdate: data.birthdate,
        address: data.address,
        clinicId: data.clinic_id,
        clinicName: data.clinics?.unit_name || 'Clínica não encontrada',
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
