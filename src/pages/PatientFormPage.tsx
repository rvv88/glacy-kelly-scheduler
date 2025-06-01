
import React from 'react';
import PatientForm from '@/components/patients/PatientForm';
import { useAuth } from '@/contexts/AuthContext';
import { usePatientProfile } from '@/hooks/usePatientProfile';

const PatientFormPage: React.FC = () => {
  const { user } = useAuth();
  const { hasProfile } = usePatientProfile();

  if (!user) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Acesso Negado</h2>
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {hasProfile ? 'Editar Meus Dados' : 'Complete seu Cadastro'}
        </h2>
      </div>
      <PatientForm />
    </div>
  );
};

export default PatientFormPage;
