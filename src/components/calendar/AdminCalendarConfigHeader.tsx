
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface AdminCalendarConfigHeaderProps {
  onSave: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const AdminCalendarConfigHeader: React.FC<AdminCalendarConfigHeaderProps> = ({
  onSave,
  isLoading,
  disabled,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurar Agenda</h2>
        <p className="text-muted-foreground">
          Configure os horários disponíveis para agendamento por clínica
        </p>
      </div>
      <Button 
        onClick={onSave}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        {isLoading ? 'Salvando...' : 'Salvar Configuração'}
      </Button>
    </div>
  );
};

export default AdminCalendarConfigHeader;
