
import { usePatientProfileLoader } from './usePatientProfileLoader';
import { usePatientProfileSaver } from './usePatientProfileSaver';
import { PatientProfile } from '@/types/patientProfile';

export const usePatientProfile = () => {
  const {
    patientProfile,
    hasProfile,
    loading,
    setPatientProfile,
    setHasProfile,
    refreshProfile,
  } = usePatientProfileLoader();

  const { savePatientProfile: saveProfile } = usePatientProfileSaver();

  const savePatientProfile = async (profileData: Omit<PatientProfile, 'id' | 'userId' | 'clinicName'>) => {
    const { profile, savedData } = await saveProfile(profileData, hasProfile, patientProfile?.id);
    
    setPatientProfile(profile);
    setHasProfile(true);
    
    return savedData;
  };

  return {
    patientProfile,
    hasProfile,
    loading,
    savePatientProfile,
    refreshProfile,
  };
};
