
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminCalendarActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 mb-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/calendar-config')}
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        Configurar Agenda
      </Button>
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/appointment-requests')}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Analisar Agenda
      </Button>
    </div>
  );
};

export default AdminCalendarActions;
