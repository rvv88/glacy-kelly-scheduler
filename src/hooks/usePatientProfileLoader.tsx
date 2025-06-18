
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PatientProfile } from '@/types/patientProfile';

export const usePatientProfileLoader = () => {
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
      
      // Buscar o perfil do paciente primeiro
      const { data: profileData, error: profileError } = await supabase
        .from('patient_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading patient profile:', profileError);
        return;
      }

      if (profileData) {
        console.log('Patient profile found:', profileData);
        
        // Buscar o nome da clínica separadamente
        let clinicName = 'Clínica não encontrada';
        if (profileData.clinic_id) {
          const { data: clinicData, error: clinicError } = await supabase
            .from('clinics')
            .select('unit_name')
            .eq('id', profileData.clinic_id)
            .maybeSingle();

          if (clinicData && !clinicError) {
            clinicName = clinicData.unit_name;
          }
        }

        const profile: PatientProfile = {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          cpf: profileData.cpf,
          birthdate: profileData.birthdate,
          address: profileData.address,
          clinicId: profileData.clinic_id,
          clinicName: clinicName,
          notes: profileData.notes || undefined,
          userId: profileData.user_id,
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

  return {
    patientProfile,
    hasProfile,
    loading,
    setPatientProfile,
    setHasProfile,
    refreshProfile: loadPatientProfile,
  };
};
