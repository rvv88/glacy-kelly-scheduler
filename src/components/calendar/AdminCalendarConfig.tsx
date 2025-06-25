
import React from 'react';
import { useAdminCalendarConfig } from '@/hooks/useAdminCalendarConfig';
import { generateTimeSlots } from '@/utils/timeSlotUtils';
import AdminCalendarConfigHeader from './AdminCalendarConfigHeader';
import ClinicSelectorCard from './ClinicSelectorCard';
import CalendarConfigCard from './CalendarConfigCard';
import DayConfigCard from './DayConfigCard';

const AdminCalendarConfig: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedClinicId,
    setSelectedClinicId,
    applyToAll,
    setApplyToAll,
    isLoading,
    clinics,
    clinicsLoading,
    localConfig,
    updateLocalConfig,
    toggleBlockedTime,
    handleSaveConfiguration,
  } = useAdminCalendarConfig();

  if (clinicsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!localConfig && selectedClinicId && selectedDate) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const timeSlots = localConfig ? generateTimeSlots(localConfig) : [];

  return (
    <div className="space-y-6">
      <AdminCalendarConfigHeader
        onSave={handleSaveConfiguration}
        isLoading={isLoading}
        disabled={!selectedClinicId || !localConfig}
      />

      {/* Seleção de Clínica */}
      <ClinicSelectorCard
        clinics={clinics}
        selectedClinicId={selectedClinicId}
        onClinicChange={setSelectedClinicId}
      />

      {selectedClinicId && localConfig && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendário */}
          <CalendarConfigCard
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            applyToAll={applyToAll}
            onApplyToAllChange={setApplyToAll}
          />

          {/* Configuração do Dia */}
          <DayConfigCard
            selectedDate={selectedDate}
            config={localConfig}
            onUpdateConfig={updateLocalConfig}
            timeSlots={timeSlots}
            onToggleBlockedTime={toggleBlockedTime}
          />
        </div>
      )}
    </div>
  );
};

export default AdminCalendarConfig;
