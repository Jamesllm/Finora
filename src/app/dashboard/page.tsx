/**
 * Dashboard Page - Version con Gráficos
 * Dashboard principal con visualización completa de datos
 */

'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { Button, Card, CardHeader, CardBody, Badge } from '@/components/ui';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import BarComparisonChart from '@/components/charts/BarComparisonChart';
import BalanceOverview from '@/components/dashboard/BalanceOverview';
import { AnimatedCard } from '@/components/AnimatedCard';
import { transactionRepository } from '@/repositories';
import { BalanceSummary, MonthlyComparison, CategoryBreakdown } from '@/types/database.types';
import { useCurrency } from '@/hooks/useCurrency';
import { LayoutDashboard, Plus, TrendingUp, TrendingDown, Wallet, RefreshCw, ArrowLeftRight, Lightbulb, Target, BarChart3 } from 'lucide-react';
import { CategoryIcon } from '@/components/CategoryIcon';

export default function DashboardPage() {
  const { user } = useRequireAuth();
  const router = useRouter();
  const { formatAmount } = useCurrency();

  const [balance, setBalance] = useState<BalanceSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyComparison[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>([]);
  const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryBreakdown[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      // Si no hay usuario, no podemos cargar datos
      if (!user) {
        // Si ya terminamos de cargar la auth (según el store) y no hay usuario, 
        // dejar de mostrar el cargando del dashboard
        return;
      }

      setIsLoading(true);
      try {
        console.log('📊 Cargando datos del dashboard para el usuario:', user.id);

        // Balance general
        const balanceData = await transactionRepository.getBalanceSummary(user.id);
        if (isMounted) setBalance(balanceData);

        // Comparación mensual (últimos 6 meses)
        const monthlyComparison = await transactionRepository.getMonthlyComparison(user.id, 6);
        if (isMounted) setMonthlyData(monthlyComparison);

        // Breakdown por categoría
        const expenseData = await transactionRepository.getCategoryBreakdown(user.id, 'expense');
        if (isMounted) setExpenseBreakdown(expenseData);

        const incomeData = await transactionRepository.getCategoryBreakdown(user.id, 'income');
        if (isMounted) setIncomeBreakdown(incomeData);

        // Transacciones recientes
        const recent = await transactionRepository.findRecent(user.id, 5);
        if (isMounted) setRecentTransactions(recent);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Si no hay usuario, mostramos el cargando general de auth
  // Pero lo ideal es que useRequireAuth nos redireccione
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Solo mostrar el loader si realmente estamos cargando los datos iniciales
  // Si balance es null pero isLoading es false, significa que hubo un error o no hay datos
  if (isLoading && !balance) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Si falló la carga del balance pero ya no estamos cargando
  const displayBalance = balance || {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    incomeCount: 0,
    expenseCount: 0
  };

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vista general de tus finanzas
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push('/transactions')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Transacción
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <AnimatedCard delay={0.1}>
          <Card variant="elevated" hoverable>
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <Badge variant="success" size="sm">
                  {displayBalance.incomeCount}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ingresos</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatAmount(displayBalance.totalIncome)}
              </p>
            </CardBody>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <Card variant="elevated" hoverable>
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <Badge variant="danger" size="sm">
                  {displayBalance.expenseCount}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gastos</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatAmount(displayBalance.totalExpense)}
              </p>
            </CardBody>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <Card variant="elevated" hoverable>
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge
                  variant={displayBalance.balance >= 0 ? 'success' : 'danger'}
                  size="sm"
                >
                  {displayBalance.balance >= 0 ? 'Positivo' : 'Negativo'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
              <p className={`text-2xl font-bold ${displayBalance.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                {displayBalance.balance >= 0 ? '+' : '-'}{formatAmount(Math.abs(displayBalance.balance))}
              </p>
            </CardBody>
          </Card>
        </AnimatedCard>

        <AnimatedCard delay={0.4}>
          <Card variant="elevated" hoverable>
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="primary" size="sm">
                  Total
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transacciones</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {displayBalance.incomeCount + displayBalance.expenseCount}
              </p>
            </CardBody>
          </Card>
        </AnimatedCard>
      </div>

      {/* Balance Overview + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Balance Overview */}
        <div className="lg:col-span-1">
          <BalanceOverview balance={displayBalance} />
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardHeader
              title="Transacciones Recientes"
              subtitle={`Últimas ${recentTransactions.length} transacciones`}
              icon={<ArrowLeftRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => router.push('/transactions')}
                >
                  Ver todas →
                </Button>
              }
            />
            <CardBody>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No hay transacciones recientes</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                          }`}>
                          <CategoryIcon iconName={transaction.category_icon} className="w-5 h-5" color={transaction.type === 'income' ? '#10B981' : '#EF4444'} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                            {transaction.description || 'Sin descripción'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={transaction.type === 'income' ? 'success' : 'danger'}
                              size="sm"
                            >
                              {transaction.category_name}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(transaction.date).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Gráfico de Tendencia Mensual */}
      <div className="mb-6">
        <MonthlyTrendChart data={monthlyData} />
      </div>

      {/* Gráficos de Comparación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BarComparisonChart data={monthlyData} />
        <CategoryPieChart data={expenseBreakdown} type="expense" />
      </div>

      {/* Gráfico de Ingresos */}
      {incomeBreakdown.length > 0 && (
        <div className="mb-6">
          <CategoryPieChart data={incomeBreakdown} type="income" />
        </div>
      )}

      <Card variant="gradient">
        <CardHeader
          title="Consejos Financieros"
          icon={<Lightbulb className="w-6 h-6 text-yellow-500" />}
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur rounded-lg p-4">
              <Target className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Regla 50/30/20</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                50% necesidades, 30% deseos, 20% ahorros
              </p>
            </div>
            <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur rounded-lg p-4">
              <BarChart3 className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Revisa tus gastos</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Analiza tus categorías más altas mensualmente
              </p>
            </div>
            <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur rounded-lg p-4">
              <Wallet className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Ahorra primero</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Separa un % de ingresos antes de gastar
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </AppLayout>
  );
}