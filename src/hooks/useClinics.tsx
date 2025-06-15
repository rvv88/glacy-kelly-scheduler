
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clinic } from '@/models/clinic';

export const useClinics = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    try {
      console.log('Carregando clínicas...');
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading clinics:', error);
        return;
      }

      console.log('Dados recebidos do Supabase:', data);

      // Convert Supabase data to our Clinic interface
      const mappedClinics: Clinic[] = data.map(clinic => ({
        id: clinic.id,
        name: clinic.unit_name,
        street: clinic.street,
        number: clinic.number,
        complement: clinic.complement || undefined,
        neighborhood: clinic.neighborhood,
        city: clinic.city,
        state: clinic.state,
        zipCode: clinic.zip_code,
        phone: clinic.phone || '',
      }));

      console.log('Clínicas mapeadas:', mappedClinics);
      setClinics(mappedClinics);
    } catch (error) {
      console.error('Error loading clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveClinic = async (clinicData: Omit<Clinic, 'id'>) => {
    try {
      console.log('Salvando clínica:', clinicData);
      
      const dataToInsert = {
        unit_name: clinicData.name,
        street: clinicData.street,
        number: clinicData.number,
        complement: clinicData.complement || null,
        neighborhood: clinicData.neighborhood,
        city: clinicData.city,
        state: clinicData.state,
        zip_code: clinicData.zipCode,
        phone: clinicData.phone || null,
      };

      console.log('Dados a serem inseridos:', dataToInsert);

      const { data, error } = await supabase
        .from('clinics')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir clínica:', error);
        throw error;
      }

      console.log('Clínica inserida com sucesso:', data);

      // Convert and add to local state
      const newClinic: Clinic = {
        id: data.id,
        name: data.unit_name,
        street: data.street,
        number: data.number,
        complement: data.complement || undefined,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        phone: data.phone || '',
      };

      setClinics(prev => [newClinic, ...prev]);
      return data;
    } catch (error) {
      console.error('Error saving clinic:', error);
      throw error;
    }
  };

  const updateClinic = async (id: string, clinicData: Omit<Clinic, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .update({
          unit_name: clinicData.name,
          street: clinicData.street,
          number: clinicData.number,
          complement: clinicData.complement || null,
          neighborhood: clinicData.neighborhood,
          city: clinicData.city,
          state: clinicData.state,
          zip_code: clinicData.zipCode,
          phone: clinicData.phone || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Convert and update local state
      const updatedClinic: Clinic = {
        id: data.id,
        name: data.unit_name,
        street: data.street,
        number: data.number,
        complement: data.complement || undefined,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        phone: data.phone || '',
      };

      setClinics(prev => prev.map(clinic => 
        clinic.id === id ? updatedClinic : clinic
      ));

      return data;
    } catch (error) {
      console.error('Error updating clinic:', error);
      throw error;
    }
  };

  const deleteClinic = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClinics(prev => prev.filter(clinic => clinic.id !== id));
    } catch (error) {
      console.error('Error deleting clinic:', error);
      throw error;
    }
  };

  return {
    clinics,
    loading,
    saveClinic,
    updateClinic,
    deleteClinic,
    refreshClinics: loadClinics,
  };
};
