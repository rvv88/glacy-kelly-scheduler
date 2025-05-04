
import React from 'react';
import PatientsList from '@/components/patients/PatientsList';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const PatientsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Pacientes</h2>
        <Button asChild>
          <Link to="/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Link>
        </Button>
      </div>
      <PatientsList />
    </div>
  );
};

export default PatientsPage;
