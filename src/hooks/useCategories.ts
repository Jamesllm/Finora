/**
 * useCategories Hook
 * Hook personalizado para manejar categorías
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { categoryRepository } from '@/repositories';
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  TransactionType,
  CategoryTotal,
} from '@/types/database.types';

interface UseCategoriesOptions {
  userId?: number;
  autoLoad?: boolean;
  type?: TransactionType;
  withTotals?: boolean;
}

interface UseCategoriesReturn {
  categories: Category[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  categoriesWithTotals: CategoryTotal[];
  isLoading: boolean;
  error: Error | null;
  createCategory: (data: CreateCategoryDTO) => Promise<Category>;
  updateCategory: (id: number, data: UpdateCategoryDTO) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  refreshCategories: () => Promise<void>;
  getCategoryById: (id: number) => Category | undefined;
}

/**
 * Hook para manejar categorías
 */
export const useCategories = (options: UseCategoriesOptions = {}): UseCategoriesReturn => {
  const { userId, autoLoad = true, type, withTotals = false } = options;

  const [categories, setCategories] = useState<Category[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [categoriesWithTotals, setCategoriesWithTotals] = useState<CategoryTotal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Carga las categorías
   */
  const refreshCategories = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Cargar categorías según opciones
      if (withTotals) {
        const totals = await categoryRepository.findWithTotals(userId);
        setCategoriesWithTotals(totals);
      }

      if (type) {
        const results = await categoryRepository.findByType(type, userId);
        setCategories(results);
      } else {
        const results = await categoryRepository.findByUserId(userId);
        setCategories(results);

        // Separar por tipo
        const income = results.filter((cat) => cat.type === 'income');
        const expense = results.filter((cat) => cat.type === 'expense');
        
        setIncomeCategories(income);
        setExpenseCategories(expense);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error loading categories');
      setError(error);
      console.error('Error refreshing categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, type, withTotals]);

  /**
   * Crea una nueva categoría
   */
  const createCategory = useCallback(async (data: CreateCategoryDTO): Promise<Category> => {
    try {
      setError(null);
      const category = await categoryRepository.create(data);
      
      // Refrescar categorías
      await refreshCategories();

      return category;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error creating category');
      setError(error);
      throw error;
    }
  }, [refreshCategories]);

  /**
   * Actualiza una categoría
   */
  const updateCategory = useCallback(async (id: number, data: UpdateCategoryDTO): Promise<boolean> => {
    try {
      setError(null);
      const success = await categoryRepository.update(id, data);

      if (success) {
        // Refrescar categorías
        await refreshCategories();
      }

      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error updating category');
      setError(error);
      throw error;
    }
  }, [refreshCategories]);

  /**
   * Elimina una categoría
   */
  const deleteCategory = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);

      // Verificar si la categoría está en uso
      const isInUse = await categoryRepository.isInUse(id);
      
      if (isInUse) {
        throw new Error('No se puede eliminar una categoría que está siendo usada en transacciones');
      }

      const success = await categoryRepository.delete(id);

      if (success) {
        // Refrescar categorías
        await refreshCategories();
      }

      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error deleting category');
      setError(error);
      throw error;
    }
  }, [refreshCategories]);

  /**
   * Obtiene una categoría por ID
   */
  const getCategoryById = useCallback((id: number): Category | undefined => {
    return categories.find((cat) => cat.id === id);
  }, [categories]);

  /**
   * Auto-cargar al montar
   */
  useEffect(() => {
    if (autoLoad && userId) {
      refreshCategories();
    }
  }, [autoLoad, userId, refreshCategories]);

  return {
    categories,
    incomeCategories,
    expenseCategories,
    categoriesWithTotals,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    getCategoryById,
  };
};