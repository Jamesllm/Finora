import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { Transaction } from '@/types/database.types'

// Tipo extendido para reporte
interface TransactionWithCategory extends Transaction {
  category_name?: string;
}

export async function exportToCSV(
  transactions: TransactionWithCategory[],
  filename: string = 'transactions.csv'
) {
  const headers = ['Fecha', 'Tipo', 'Categoría', 'Monto', 'Descripción']

  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.type === 'income' ? 'Ingreso' : 'Gasto',
    t.category_name || 'Sin categoría',
    t.amount.toFixed(2),
    t.description || ''
  ])

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

export async function exportToPDF(
  transactions: TransactionWithCategory[],
  summary: {
    totalIncome: number
    totalExpense: number
    balance: number
  },
  filename: string = 'reporte-financiero.pdf',
  currencySymbol: string = '$'
) {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.text('Reporte Financiero', 14, 20)

  doc.setFontSize(12)
  doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30)

  // Summary
  doc.setFontSize(14)
  doc.text('Resumen', 14, 45)

  doc.setFontSize(11)
  doc.text(`Total Ingresos: ${currencySymbol}${summary.totalIncome.toFixed(2)}`, 14, 55)
  doc.text(`Total Gastos: ${currencySymbol}${summary.totalExpense.toFixed(2)}`, 14, 62)
  doc.text(`Balance: ${currencySymbol}${summary.balance.toFixed(2)}`, 14, 69)

  // Transactions table
  const tableData = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.type === 'income' ? 'Ingreso' : 'Gasto',
    t.category_name || 'Sin categoría',
    `${currencySymbol}${t.amount.toFixed(2)}`,
    t.description || ''
  ])

    ; (doc as any).autoTable({
      head: [['Fecha', 'Tipo', 'Categoría', 'Monto', 'Descripción']],
      body: tableData,
      startY: 80,
      styles: { fontSize: 9 }
    })

  doc.save(filename)
}