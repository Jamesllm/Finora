/**
 * useTransactions Hook
 * Hook personalizado para manejar transacciones
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { transactionRepository } from '@/repositories';
import {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilters,
  RecentTransaction,
  BalanceSummary,
} from '@/types/database.types';

interface UseTransactionsOptions {
  userId?: number;
  autoLoad?: boolean;
  filters?: TransactionFilters;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  recentTransactions: RecentTransaction[];
  balance: BalanceSummary | null;
  isLoading: boolean;
  error: Error | null;
  createTransaction: (data: CreateTransactionDTO) => Promise<Transaction>;
  updateTransaction: (id: number, data: UpdateTransactionDTO) => Promise<boolean>;
  deleteTransaction: (id: number) => Promise<boolean>;
  refreshTransactions: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  loadRecent: (limit?: number) => Promise<void>;
}

/**
 * Hook para manejar transacciones
 */
export const useTransactions = (options: UseTransactionsOptions = {}): UseTransactionsReturn => {
  const { userId, autoLoad = true, filters } = options;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [balance, setBalance] = useState<BalanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Carga las transacciones
   */
  const refreshTransactions = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      let results: Transaction[];

      if (filters) {
        results = await transactionRepository.findWithFilters(userId, filters);
      } else {
        results = await transactionRepository.findByUserId(userId);
      }

      setTransactions(results);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error loading transactions');
      setError(error);
      console.error('Error refreshing transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, filters]);

  /**
   * Carga el balance
   */
  const refreshBalance = useCallback(async () => {
    if (!userId) return;

    try {
      const summary = await transactionRepository.getBalanceSummary(
        userId,
        filters?.start_date,
        filters?.end_date
      );
      setBalance(summary);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error loading balance');
      setError(error);
      console.error('Error refreshing balance:', error);
    }
  }, [userId, filters]);

  /**
   * Carga transacciones recientes
   */
  const loadRecent = useCallback(async (limit: number = 10) => {
    if (!userId) return;

    try {
      const results = await transactionRepository.findRecent(userId, limit);
      setRecentTransactions(results);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error loading recent transactions');
      setError(error);
      console.error('Error loading recent transactions:', error);
    }
  }, [userId]);

  /**
   * Crea una nueva transacción
   */
  const createTransaction = useCallback(async (data: CreateTransactionDTO): Promise<Transaction> => {
    try {
      setError(null);
      const transaction = await transactionRepository.create(data);
      
      // Refrescar datos
      await Promise.all([
        refreshTransactions(),
        refreshBalance(),
        loadRecent(),
      ]);

      return transaction;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error creating transaction');
      setError(error);
      throw error;
    }
  }, [refreshTransactions, refreshBalance, loadRecent]);

  /**
   * Actualiza una transacción
   */
  const updateTransaction = useCallback(async (id: number, data: UpdateTransactionDTO): Promise<boolean> => {
    try {
      setError(null);
      const success = await transactionRepository.update(id, data);

      if (success) {
        // Refrescar datos
        await Promise.all([
          refreshTransactions(),
          refreshBalance(),
          loadRecent(),
        ]);
      }

      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error updating transaction');
      setError(error);
      throw error;
    }
  }, [refreshTransactions, refreshBalance, loadRecent]);

  /**
   * Elimina una transacción
   */
  const deleteTransaction = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const success = await transactionRepository.delete(id);

      if (success) {
        // Refrescar datos
        await Promise.all([
          refreshTransactions(),
          refreshBalance(),
          loadRecent(),
        ]);
      }

      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error deleting transaction');
      setError(error);
      throw error;
    }
  }, [refreshTransactions, refreshBalance, loadRecent]);

  /**
   * Auto-cargar al montar
   */
  useEffect(() => {
    if (autoLoad && userId) {
      Promise.all([
        refreshTransactions(),
        refreshBalance(),
        loadRecent(),
      ]);
    }
  }, [autoLoad, userId, refreshTransactions, refreshBalance, loadRecent]);

  return {
    transactions,
    recentTransactions,
    balance,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    refreshBalance,
    loadRecent,
  };
};