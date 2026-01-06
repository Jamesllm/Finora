/**
 * hooks/useCurrency.ts
 * Hook personalizado para formatear montos con la moneda activa
 */

'use client';

import { useCurrencyStore } from '@/stores/currencyStore';

export function useCurrency() {
  const { currency, formatAmount } = useCurrencyStore();

  return {
    currency,
    formatAmount,
    
    // Función auxiliar para formatear con signo
    formatWithSign: (amount: number, type: 'income' | 'expense'): string => {
      const formatted = formatAmount(Math.abs(amount));
      return type === 'income' ? `+${formatted}` : `-${formatted}`;
    },
    
    // Solo el símbolo
    symbol: currency.symbol,
    
    // Código de moneda
    code: currency.code,
  };
}