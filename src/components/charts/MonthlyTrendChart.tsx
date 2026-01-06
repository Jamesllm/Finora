/**
 * MonthlyTrendChart Component
 * Gráfico de líneas mostrando tendencia de ingresos vs gastos
 */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardBody } from '@/components/ui';
import { MonthlyComparison } from '@/types/database.types';
import { useCurrency } from '@/hooks/useCurrency';


interface MonthlyTrendChartProps {
  data: MonthlyComparison[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const { formatAmount } = useCurrency();

  // Formatear datos para el gráfico
  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    Ingresos: item.income,
    Gastos: item.expense,
    Balance: item.balance,
  }));

  function formatMonth(monthString: string) {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.month}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold text-gray-800">
                {formatAmount(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader
          title="Tendencia Mensual"
          subtitle="Ingresos vs Gastos"
          icon={<span className="text-2xl">📈</span>}
        />
        <CardBody>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-600">No hay datos suficientes para mostrar</p>
            <p className="text-sm text-gray-500 mt-2">
              Crea algunas transacciones para ver el gráfico
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader
        title="Tendencia Mensual"
        subtitle={`Últimos ${data.length} meses`}
        icon={<span className="text-2xl">📈</span>}
      />
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="Ingresos"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: '#10B981', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Gastos"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: '#EF4444', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Balance"
              stroke="#3B82F6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#3B82F6', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}