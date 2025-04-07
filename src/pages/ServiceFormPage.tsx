
import React from 'react';
import ServiceForm from '@/components/services/ServiceForm';

const ServiceFormPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cadastro de Serviço</h2>
      </div>
      <ServiceForm />
    </div>
  );
};

export default ServiceFormPage;
