
import React from 'react';
import PatientsList from '@/components/patients/PatientsList';

const PatientsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Pacientes</h2>
      </div>
      <PatientsList />
    </div>
  );
};

export default PatientsPage;
