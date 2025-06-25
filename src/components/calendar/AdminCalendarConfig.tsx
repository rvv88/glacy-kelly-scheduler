
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useCalendarConfig } from '@/hooks/useCalendarConfig';
import ClinicSelector from './ClinicSelector';
import ConfigurationPanel from './ConfigurationPanel';
import TimeSlotSelector from './TimeSlotSelector';
import CalendarSelector from './CalendarSelector';

const AdminCalendarConfig: React.FC = () => {
  const {
    selectedClinicId,
    setSelectedClinicId,
    selectedDate,
    isMonthlyConfig,
    isLoading,
    clinics,
    clinicsLoading,
    currentConfig,
    timeSlots,
    selectDate,
    toggleTimeSlot,
    saveConfig,
    setCurrentConfig
  } = useCalendarConfig();

  if (clinicsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurar Agenda</h2>
          <p className="text-muted-foreground">
            Configure os horários disponíveis para agendamento por clínica
          </p>
        </div>
        <Button 
          onClick={saveConfig}
          disabled={!selectedClinicId || isLoading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      {/* Seleção de Clínica */}
      <ClinicSelector
        clinics={clinics}
        selectedClinicId={selectedClinicId}
        onClinicChange={setSelectedClinicId}
      />

      {selectedClinicId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário - Lado Esquerdo */}
          <div className="lg:col-span-1">
            <CalendarSelector
              selectedDate={selectedDate}
              onDateSelect={selectDate}
            />
          </div>

          {/* Configurações - Lado Direito */}
          <div className="lg:col-span-2 space-y-6">
            {/* Parâmetros de Configuração */}
            <ConfigurationPanel
              config={currentConfig}
              onConfigChange={(updates) => setCurrentConfig(prev => ({ ...prev, ...updates }))}
              isMonthlyConfig={isMonthlyConfig}
              selectedDate={selectedDate}
            />

            {/* Horários Disponíveis */}
            <TimeSlotSelector
              timeSlots={timeSlots}
              blockedTimes={currentConfig.blocked_times}
              onToggleTimeSlot={toggleTimeSlot}
              isOpen={currentConfig.is_open}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendarConfig;
