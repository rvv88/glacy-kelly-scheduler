
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
        .from('clínica')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error loading clinics:', error);
        return;
      }

      console.log('Dados recebidos do Supabase:', data);

      // Convert Supabase data to our Clinic interface
      const mappedClinics: Clinic[] = data.map(clinic => ({
        id: clinic.id,
        name: clinic['Nome da Unidade'],
        street: clinic.Logradouro,
        number: clinic.Número,
        complement: clinic.Complemento || undefined,
        neighborhood: clinic.Bairro,
        city: clinic.Cidade,
        state: clinic.Estado,
        zipCode: clinic.CEP,
        phone: clinic.Telefone || '',
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
        'Nome da Unidade': clinicData.name,
        Logradouro: clinicData.street,
        Número: clinicData.number,
        Complemento: clinicData.complement || null,
        Bairro: clinicData.neighborhood,
        Cidade: clinicData.city,
        Estado: clinicData.state,
        CEP: clinicData.zipCode,
        Telefone: clinicData.phone || null,
      };

      console.log('Dados a serem inseridos:', dataToInsert);

      const { data, error } = await supabase
        .from('clínica')
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
        name: data['Nome da Unidade'],
        street: data.Logradouro,
        number: data.Número,
        complement: data.Complemento || undefined,
        neighborhood: data.Bairro,
        city: data.Cidade,
        state: data.Estado,
        zipCode: data.CEP,
        phone: data.Telefone || '',
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
        .from('clínica')
        .update({
          'Nome da Unidade': clinicData.name,
          Logradouro: clinicData.street,
          Número: clinicData.number,
          Complemento: clinicData.complement || null,
          Bairro: clinicData.neighborhood,
          Cidade: clinicData.city,
          Estado: clinicData.state,
          CEP: clinicData.zipCode,
          Telefone: clinicData.phone || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Convert and update local state
      const updatedClinic: Clinic = {
        id: data.id,
        name: data['Nome da Unidade'],
        street: data.Logradouro,
        number: data.Número,
        complement: data.Complemento || undefined,
        neighborhood: data.Bairro,
        city: data.Cidade,
        state: data.Estado,
        zipCode: data.CEP,
        phone: data.Telefone || '',
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
        .from('clínica')
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
