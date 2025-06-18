
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PatientProfile } from '@/types/patientProfile';

export const usePatientProfileSaver = () => {
  const { user } = useAuth();

  const savePatientProfile = async (
    profileData: Omit<PatientProfile, 'id' | 'userId' | 'clinicName'>,
    hasProfile: boolean,
    existingProfileId?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('Saving patient profile:', profileData);
      console.log('Has existing profile:', hasProfile);
      console.log('Existing profile ID:', existingProfileId);

      let data, error;

      if (hasProfile && existingProfileId) {
        // Update existing profile
        console.log('Updating existing profile with ID:', existingProfileId);
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
          .eq('id', existingProfileId)
          .select()
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
          .select()
          .single();

        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Error saving patient profile:', error);
        throw error;
      }

      console.log('Profile saved successfully:', data);

      // Buscar o nome da clínica para o perfil atualizado
      let clinicName = 'Clínica não encontrada';
      if (data.clinic_id) {
        const { data: clinicData, error: clinicError } = await supabase
          .from('clinics')
          .select('unit_name')
          .eq('id', data.clinic_id)
          .maybeSingle();

        if (clinicData && !clinicError) {
          clinicName = clinicData.unit_name;
        }
      }

      const newProfile: PatientProfile = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        birthdate: data.birthdate,
        address: data.address,
        clinicId: data.clinic_id,
        clinicName: clinicName,
        notes: data.notes || undefined,
        userId: data.user_id,
      };

      return { profile: newProfile, savedData: data };
    } catch (error) {
      console.error('Error saving patient profile:', error);
      throw error;
    }
  };

  return { savePatientProfile };
};
