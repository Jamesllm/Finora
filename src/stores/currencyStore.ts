/**
 * stores/currencyStore.ts
 * Store global para gestión de moneda
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'Dólar estadounidense', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'es-ES' },
  { code: 'GBP', symbol: '£', name: 'Libra esterlina', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Yen japonés', locale: 'ja-JP' },
  { code: 'MXN', symbol: '$', name: 'Peso mexicano', locale: 'es-MX' },
  { code: 'ARS', symbol: '$', name: 'Peso argentino', locale: 'es-AR' },
  { code: 'CLP', symbol: '$', name: 'Peso chileno', locale: 'es-CL' },
  { code: 'COP', symbol: '$', name: 'Peso colombiano', locale: 'es-CO' },
  { code: 'PEN', symbol: 'S/', name: 'Sol peruano', locale: 'es-PE' },
  { code: 'BRL', symbol: 'R$', name: 'Real brasileño', locale: 'pt-BR' },
];

interface CurrencyState {
  currency: Currency;
  isHydrated: boolean;
  setCurrency: (currencyCode: string) => void;
  formatAmount: (amount: number, showSymbol?: boolean) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: CURRENCIES[0], // USD por defecto
      isHydrated: false,

      setCurrency: (currencyCode: string) => {
        const currency = CURRENCIES.find((c) => c.code === currencyCode);
        if (currency) {
          set({ currency });
        }
      },

      formatAmount: (amount: number, showSymbol: boolean = true): string => {
        const { currency } = get();

        try {
          const formatted = new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(amount);

          return formatted;
        } catch (error) {
          // Fallback si falla Intl
          return showSymbol
            ? `${currency.symbol}${amount.toFixed(2)}`
            : amount.toFixed(2);
        }
      },
    }),
    {
      name: 'currency-storage',
      // Marcar como hidratado después de cargar desde localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);