
import React from 'react';
import PatientForm from '@/components/patients/PatientForm';

const PatientFormPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cadastro de Paciente</h2>
      </div>
      <PatientForm />
    </div>
  );
};

export default PatientFormPage;
