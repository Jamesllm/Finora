/**
 * BalanceOverview Component
 * Tarjeta de resumen de balance con visualización
 */

'use client';

import { Card, CardHeader, CardBody, Badge } from '@/components/ui';
import { BalanceSummary } from '@/types/database.types';
import { useCurrency } from '@/hooks/useCurrency';
import { Wallet, TrendingUp, TrendingDown, Check, AlertTriangle } from 'lucide-react';

interface BalanceOverviewProps {
  balance: BalanceSummary;
}

export default function BalanceOverview({ balance }: BalanceOverviewProps) {
  const { formatAmount } = useCurrency();
  const balanceValue = balance.balance;
  const isPositive = balanceValue >= 0;
  const savingsRate = balance.totalIncome > 0
    ? ((balance.totalIncome - balance.totalExpense) / balance.totalIncome) * 100
    : 0;

  return (
    <Card variant="gradient">
      <CardHeader
        title="Balance General"
        subtitle="Resumen de tu situación financiera"
        icon={
          <div className="bg-white p-2 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
        }
      />
      <CardBody>
        {/* Balance Principal */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-2">Balance Total</p>
          <p className={`text-5xl font-bold mb-2 ${isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
            {isPositive ? '+' : '-'}{formatAmount(Math.abs(balanceValue))}
          </p>
          <Badge variant={isPositive ? 'success' : 'danger'} size="lg">
            {isPositive ? (
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" /> Positivo
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Negativo
              </span>
            )}
          </Badge>
        </div>

        {/* Desglose */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/50 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">Ingresos</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatAmount(balance.totalIncome)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {balance.incomeCount} {balance.incomeCount === 1 ? 'transacción' : 'transacciones'}
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <p className="text-sm text-gray-600">Gastos</p>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {formatAmount(balance.totalExpense)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {balance.expenseCount} {balance.expenseCount === 1 ? 'transacción' : 'transacciones'}
            </p>
          </div>
        </div>

        {/* Tasa de Ahorro */}
        <div className="bg-white/50 backdrop-blur rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">Tasa de Ahorro</p>
            <Badge variant={savingsRate >= 20 ? 'success' : savingsRate >= 10 ? 'warning' : 'danger'}>
              {savingsRate.toFixed(1)}%
            </Badge>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all ${savingsRate >= 20
                ? 'bg-green-500'
                : savingsRate >= 10
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
                }`}
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>

          <p className="text-xs text-gray-600 mt-2">
            {savingsRate >= 20
              ? '¡Excelente! Estás ahorrando bien'
              : savingsRate >= 10
                ? 'Buen ahorro, puedes mejorar'
                : 'Intenta aumentar tus ahorros'}
          </p>
        </div>

        {/* Promedios */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="text-center p-3 bg-white/30 backdrop-blur rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Ingreso promedio</p>
            <p className="text-lg font-bold text-gray-800">
              {balance.incomeCount > 0
                ? formatAmount(balance.totalIncome / balance.incomeCount)
                : formatAmount(0)}
            </p>
          </div>
          <div className="text-center p-3 bg-white/30 backdrop-blur rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Gasto promedio</p>
            <p className="text-lg font-bold text-gray-800">
              {balance.expenseCount > 0
                ? formatAmount(balance.totalExpense / balance.expenseCount)
                : formatAmount(0)}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}