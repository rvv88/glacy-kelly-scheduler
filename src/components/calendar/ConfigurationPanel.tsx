
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';

interface ConfigurationPanelProps {
  config: {
    is_open: boolean;
    start_time: string;
    end_time: string;
    interval_minutes: number;
    blocked_times: string[];
  };
  onConfigChange: (updates: any) => void;
  isMonthlyConfig: boolean;
  selectedDate?: Date;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  config,
  onConfigChange,
  isMonthlyConfig,
  selectedDate
}) => {
  const title = isMonthlyConfig ? 'Configuração Mensal' : 'Configuração do Dia';
  const description = isMonthlyConfig 
    ? 'Parâmetros que se aplicam a todos os dias do mês'
    : `Configuração específica para ${selectedDate?.toLocaleDateString('pt-BR')}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Switch Funcionando */}
        <div className="flex items-center space-x-2">
          <Switch
            id="functioning"
            checked={config.is_open}
            onCheckedChange={(checked) => onConfigChange({ is_open: checked })}
          />
          <Label htmlFor="functioning" className="font-medium">
            Funcionando
          </Label>
        </div>

        {config.is_open && (
          <>
            {/* Horários */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Horário de Início</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={config.start_time}
                  onChange={(e) => onConfigChange({ start_time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-time">Horário de Fim</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={config.end_time}
                  onChange={(e) => onConfigChange({ end_time: e.target.value })}
                />
              </div>
            </div>

            {/* Intervalo */}
            <div>
              <Label htmlFor="interval">Intervalo entre consultas (minutos)</Label>
              <Input
                id="interval"
                type="number"
                min="15"
                max="120"
                step="15"
                value={config.interval_minutes}
                onChange={(e) => onConfigChange({ interval_minutes: parseInt(e.target.value) || 30 })}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfigurationPanel;
