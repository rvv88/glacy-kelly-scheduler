
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Clinic {
  id: string;
  name: string;
}

interface ClinicSelectorProps {
  clinics: Clinic[];
  selectedClinicId: string;
  onClinicChange: (clinicId: string) => void;
}

const ClinicSelector: React.FC<ClinicSelectorProps> = ({
  clinics,
  selectedClinicId,
  onClinicChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Clínica</CardTitle>
        <CardDescription>
          Escolha a clínica para visualizar a agenda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedClinicId} onValueChange={onClinicChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma clínica" />
          </SelectTrigger>
          <SelectContent>
            {clinics.map((clinic) => (
              <SelectItem key={clinic.id} value={clinic.id}>
                {clinic.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default ClinicSelector;
