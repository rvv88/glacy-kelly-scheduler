
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface AppointmentChartProps {
  onMonthClick?: (month: string) => void;
}

const mockChartData = [
  { name: 'Jan', total: 38 },
  { name: 'Fev', total: 42 },
  { name: 'Mar', total: 57 },
  { name: 'Abr', total: 45 },
  { name: 'Mai', total: 35 },
  { name: 'Jun', total: 50 },
  { name: 'Jul', total: 62 },
  { name: 'Ago', total: 44 },
  { name: 'Set', total: 52 },
  { name: 'Out', total: 48 },
  { name: 'Nov', total: 55 },
  { name: 'Dez', total: 39 },
];

const AppointmentChart: React.FC<AppointmentChartProps> = ({ onMonthClick }) => {
  const handleBarClick = (data: any) => {
    if (onMonthClick) {
      onMonthClick(data.name);
      toast.info(`Mostrando consultas de ${data.name}`);
    }
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Consultas por Mês</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Bar
                dataKey="total"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="fill-primary cursor-pointer"
                onClick={handleBarClick}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentChart;
