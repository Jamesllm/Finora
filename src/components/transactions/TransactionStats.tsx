/**
 * TransactionStats Component
 * Estadísticas y resumen de transacciones
 */

'use client';

import { Card, CardHeader, CardBody, Badge } from '@/components/ui';
import { BalanceSummary, CategoryBreakdown } from '@/types/database.types';
import { useCurrency } from '@/hooks/useCurrency';

interface TransactionStatsProps {
  balance: BalanceSummary;
  categoryBreakdown: CategoryBreakdown[];
  type: 'income' | 'expense';
}

export default function TransactionStats({
  balance,
  categoryBreakdown,
  type,
}: TransactionStatsProps) {
  const { formatAmount } = useCurrency();
  const isIncome = type === 'income';
  const total = isIncome ? balance.totalIncome : balance.totalExpense;
  const count = isIncome ? balance.incomeCount : balance.expenseCount;

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <Card variant="gradient">
        <CardHeader
          title={isIncome ? 'Resumen de Ingresos' : 'Resumen de Gastos'}
          icon={<span className="text-2xl">{isIncome ? '📈' : '📉'}</span>}
        />
        <CardBody>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Total</span>
              <span className={`text-2xl font-bold ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                {formatAmount(total)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Transacciones</span>
              <Badge variant={isIncome ? 'success' : 'danger'} size="lg">
                {count}
              </Badge>
            </div>

            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Promedio</span>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {count > 0 ? formatAmount(total / count) : formatAmount(0)}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Breakdown por categoría */}
      {categoryBreakdown.length > 0 && (
        <Card variant="elevated">
          <CardHeader
            title="Por Categoría"
            subtitle={`Top ${Math.min(5, categoryBreakdown.length)} categorías`}
          />
          <CardBody>
            <div className="space-y-3">
              {categoryBreakdown.slice(0, 5).map((item, index) => (
                <div key={item.category_id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {item.category_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 dark:text-gray-200">
                        {formatAmount(item.total)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${isIncome ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}