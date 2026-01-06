/**
 * Reports Page
 * Página de reportes financieros detallados
 */

'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardHeader, CardBody } from '@/components/ui';
import TransactionStats from '@/components/transactions/TransactionStats';
import ExportActions from '@/components/reports/ExportActions';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import { transactionRepository } from '@/repositories';
import { BalanceSummary, CategoryBreakdown, MonthlyComparison, Transaction } from '@/types/database.types';

export default function ReportsPage() {
    const { user } = useRequireAuth();
    const [isLoading, setIsLoading] = useState(true);

    // Datos
    const [transactions, setTransactions] = useState<any[]>([]);
    const [balance, setBalance] = useState<BalanceSummary | null>(null);
    const [monthlyTrend, setMonthlyTrend] = useState<MonthlyComparison[]>([]);
    const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>([]);
    const [incomeBreakdown, setIncomeBreakdown] = useState<CategoryBreakdown[]>([]);

    // Filtros
    const [period, setPeriod] = useState<'all' | 'year' | 'month'>('all');

    const loadData = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            // 1. Cargar Balance General
            const balanceData = await transactionRepository.getBalanceSummary(user.id);
            setBalance(balanceData);

            // 2. Cargar Tendencia Mensual (últimos 12 meses)
            const trendData = await transactionRepository.getMonthlyComparison(user.id, 12);
            setMonthlyTrend(trendData);

            // 3. Cargar Breakdown
            const expenses = await transactionRepository.getCategoryBreakdown(user.id, 'expense');
            setExpenseBreakdown(expenses);

            const incomes = await transactionRepository.getCategoryBreakdown(user.id, 'income');
            setIncomeBreakdown(incomes);

            // 4. Cargar todas las transacciones para exportar (enriquecidas)
            // Nota: Para un app real con muchos datos, esto debería paginarse o filtrarse,
            // pero para "offline personal finance" suele ser manejable.
            const rawTransactions = await transactionRepository.findByUserId(user.id);

            // Enriquecer (esto podría optimizarse con un JOIN en el repo, pero lo hacemos aquí por consistencia con lo existente)
            const enriched = await Promise.all(
                rawTransactions.map(async (t) => {
                    const category = await transactionRepository.executeQuerySingle(
                        'SELECT name FROM categories WHERE id = ?',
                        [t.category_id]
                    );
                    return {
                        ...t,
                        category_name: category?.name || 'Sin categoría'
                    };
                })
            );
            setTransactions(enriched);

        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    if (!user) return null;

    if (isLoading) {
        return (
            <AppLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Generando reportes...</p>
                    </div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    Reportes y Análisis 📈
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Visualiza el estado de tus finanzas en detalle
                </p>
            </div>

            <div className="space-y-6">
                {/* Exportar */}
                <ExportActions
                    transactions={transactions}
                    summary={{
                        totalIncome: balance?.totalIncome || 0,
                        totalExpense: balance?.totalExpense || 0,
                        balance: balance?.balance || 0
                    }}
                />

                {/* Gráfico Principal de Tendencias */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Tendencia Anual</h2>
                    <MonthlyTrendChart data={monthlyTrend} />
                </div>

                {/* Desglose de Gastos e Ingresos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <TransactionStats
                            type="expense"
                            balance={balance || { totalIncome: 0, totalExpense: 0, balance: 0, incomeCount: 0, expenseCount: 0 }}
                            categoryBreakdown={expenseBreakdown}
                        />
                        <div className="mt-6">
                            <CategoryPieChart data={expenseBreakdown} type="expense" />
                        </div>
                    </div>

                    <div>
                        <TransactionStats
                            type="income"
                            balance={balance || { totalIncome: 0, totalExpense: 0, balance: 0, incomeCount: 0, expenseCount: 0 }}
                            categoryBreakdown={incomeBreakdown}
                        />
                        <div className="mt-6">
                            <CategoryPieChart data={incomeBreakdown} type="income" />
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
