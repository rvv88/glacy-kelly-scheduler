
import React from 'react';
import ServicesList from '@/components/services/ServicesList';

const ServicesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tipos de Atendimento</h2>
      </div>
      <ServicesList />
    </div>
  );
};

export default ServicesPage;
