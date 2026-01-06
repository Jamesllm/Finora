/**
 * BarComparisonChart Component
 * Gráfico de barras comparando ingresos vs gastos por mes
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardBody } from '@/components/ui';
import { MonthlyComparison } from '@/types/database.types';
import { useCurrency } from '@/hooks/useCurrency';

interface BarComparisonChartProps {
  data: MonthlyComparison[];
}

export default function BarComparisonChart({ data }: BarComparisonChartProps) {
  const { formatAmount } = useCurrency();

  // Formatear datos para el gráfico
  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    Ingresos: item.income,
    Gastos: item.expense,
  }));

  function formatMonth(monthString: string) {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { month: 'short' });
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload[0].value;
      const expense = payload[1].value;
      const balance = income - expense;

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-3">{label}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Ingresos:</span>
              </div>
              <span className="font-bold text-green-600">{formatAmount(income)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">Gastos:</span>
              </div>
              <span className="font-bold text-red-600">{formatAmount(expense)}</span>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-gray-700">Balance:</span>
                <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {balance >= 0 ? '+' : '-'}{formatAmount(Math.abs(balance))}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader
          title="Comparación Mensual"
          subtitle="Ingresos vs Gastos"
          icon={<span className="text-2xl">📊</span>}
        />
        <CardBody>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-600">No hay datos para comparar</p>
            <p className="text-sm text-gray-500 mt-2">
              Agrega transacciones para ver la comparación
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader
        title="Comparación Mensual"
        subtitle={`Últimos ${data.length} meses`}
        icon={<span className="text-2xl">📊</span>}
      />
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
              iconType="square"
            />
            <Bar
              dataKey="Ingresos"
              fill="#10B981"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
            <Bar
              dataKey="Gastos"
              fill="#EF4444"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}