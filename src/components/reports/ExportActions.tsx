/**
 * ExportActions Component
 * Botones para exportar reportes
 */

'use client';

import { useState } from 'react';
import { Card, CardBody } from '@/components/ui';
import { exportToCSV, exportToPDF } from '@/lib/exporters';
import { Transaction } from '@/types/database.types';
import { useCurrency } from '@/hooks/useCurrency';

interface ExportActionsProps {
    transactions: Array<Transaction & { category_name?: string }>;
    summary: {
        totalIncome: number;
        totalExpense: number;
        balance: number;
    };
}

export default function ExportActions({ transactions, summary }: ExportActionsProps) {
    const [isExporting, setIsExporting] = useState(false);
    const { currency } = useCurrency();

    const handleExportCSV = async () => {
        setIsExporting(true);
        try {
            await exportToCSV(transactions, `reporte-${new Date().toISOString().split('T')[0]}.csv`);
        } catch (error) {
            console.error('Error exporting CSV:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            await exportToPDF(
                transactions,
                summary,
                `reporte-${new Date().toISOString().split('T')[0]}.pdf`,
                currency.symbol
            );
        } catch (error) {
            console.error('Error exporting PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Card variant="elevated">
            <CardBody>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Exportar Datos</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Descarga tus movimientos para guardar copias</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportCSV}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50"
                        >
                            <span className="text-xl">📊</span>
                            <span>CSV (Excel)</span>
                        </button>
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                        >
                            <span className="text-xl">📄</span>
                            <span>PDF</span>
                        </button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
