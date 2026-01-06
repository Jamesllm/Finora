/**
 * CategoryPieChart Component
 * Gráfico de pie mostrando distribución por categorías
 */

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardBody, Badge } from '@/components/ui';
import { CategoryBreakdown, TransactionType } from '@/types/database.types';
import { useCurrency } from '@/hooks/useCurrency';

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
  type: TransactionType;
}

export default function CategoryPieChart({ data, type }: CategoryPieChartProps) {
  const { formatAmount } = useCurrency();

  const isIncome = type === 'income';

  // Limitar a top 8 categorías y agrupar el resto
  const topCategories = data.slice(0, 8);
  const othersTotal = data.slice(8).reduce((sum, item) => sum + item.total, 0);

  const chartData = [
    ...topCategories.map((item) => ({
      name: item.category_name,
      value: item.total,
      icon: item.icon,
      percentage: item.percentage,
    })),
    ...(othersTotal > 0
      ? [{ name: 'Otros', value: othersTotal, icon: '📦', percentage: 0 }]
      : []),
  ];

  // Colores para el gráfico
  const COLORS = isIncome
    ? ['#10B981', '#059669', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#ECFDF5', '#F0FDF4']
    : ['#EF4444', '#DC2626', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2', '#FEF2F2', '#FFF5F5'];

  // Custom label
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    if (percent < 0.05) return null; // No mostrar labels muy pequeños

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{data.icon}</span>
            <p className="font-semibold text-gray-800">{data.name}</p>
          </div>
          <p className="text-sm text-gray-600">
            Total: <span className="font-bold">{formatAmount(data.value)}</span>
          </p>
          {data.percentage > 0 && (
            <p className="text-sm text-gray-600">
              Porcentaje: <span className="font-bold">{data.percentage.toFixed(1)}%</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-700">
              {entry.payload.icon} {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <Card variant="elevated">
        <CardHeader
          title={isIncome ? 'Ingresos por Categoría' : 'Gastos por Categoría'}
          subtitle="Distribución porcentual"
          icon={<span className="text-2xl">{isIncome ? '📈' : '📉'}</span>}
        />
        <CardBody>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🥧</div>
            <p className="text-gray-600">No hay datos de categorías</p>
            <p className="text-sm text-gray-500 mt-2">
              Crea algunas transacciones para ver la distribución
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card variant="elevated">
      <CardHeader
        title={isIncome ? 'Ingresos por Categoría' : 'Gastos por Categoría'}
        subtitle={`Top ${Math.min(data.length, 8)} categorías`}
        icon={<span className="text-2xl">{isIncome ? '📈' : '📉'}</span>}
        action={
          <Badge variant={isIncome ? 'success' : 'danger'} size="lg">
            {formatAmount(total)}
          </Badge>
        }
      />
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>

        {/* Lista detallada */}
        <div className="mt-6 space-y-2">
          {data.slice(0, 5).map((item, index) => (
            <div
              key={item.category_id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {item.category_name}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">
                  {formatAmount(item.total)}
                </p>
                <p className="text-xs text-gray-500">
                  {item.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}