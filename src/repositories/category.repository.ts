/**
 * Category Repository (Actualizado)
 * Maneja todas las operaciones relacionadas con categorías
 * ✅ Fix: Al editar categoría por defecto, se marca como personalizada
 */

'use client';

import { BaseRepository } from './base.repository';
import { Category, CreateCategoryDTO, UpdateCategoryDTO, TransactionType, CategoryTotal } from '@/types/database.types';

class CategoryRepository extends BaseRepository<Category> {
  protected tableName = 'categories';

  /**
   * Crea una nueva categoría
   */
  async create(data: CreateCategoryDTO): Promise<Category> {
    try {
      const result = await this.executeCommand(
        `INSERT INTO categories (name, type, color, icon, user_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [data.name, data.type, data.color, data.icon, data.user_id || null]
      );

      await this.save();

      const category = await this.findById(result.lastID);

      if (!category) {
        throw new Error('Error retrieving created category');
      }

      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Actualiza una categoría
   * ✅ FIX: Si la categoría es por defecto (is_default = 1), automáticamente
   *     se marca como personalizada (is_default = 0) al editarla
   */
  async update(id: number, data: UpdateCategoryDTO): Promise<boolean> {
    try {
      // Primero verificar si es una categoría por defecto
      const category = await this.findById(id);
      
      if (!category) {
        throw new Error(`Category with id ${id} not found`);
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (data.name !== undefined) {
        updates.push('name = ?');
        values.push(data.name);
      }

      if (data.color !== undefined) {
        updates.push('color = ?');
        values.push(data.color);
      }

      if (data.icon !== undefined) {
        updates.push('icon = ?');
        values.push(data.icon);
      }

      // ✅ Si se está editando una categoría por defecto, marcarla como personalizada
      if (category.is_default === 1) {
        updates.push('is_default = 0');
        console.log(`✅ Categoría "${category.name}" marcada como personalizada al editarla`);
      }

      if (updates.length === 0) {
        return false;
      }

      values.push(id);

      const result = await this.executeCommand(
        `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      await this.save();
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Marca una categoría como personalizada (quita el flag de "por defecto")
   * Útil para cuando un usuario quiere explícitamente personalizar una categoría
   */
  async markAsCustom(categoryId: number): Promise<boolean> {
    try {
      const result = await this.executeCommand(
        'UPDATE categories SET is_default = 0 WHERE id = ?',
        [categoryId]
      );

      await this.save();
      
      if (result.changes > 0) {
        console.log(`✅ Categoría ${categoryId} marcada como personalizada`);
      }
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error marking category as custom:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las categorías de un usuario
   */
  async findByUserId(userId: number): Promise<Category[]> {
    try {
      const results = this.executeQuery<Category>(
        'SELECT * FROM categories WHERE user_id = ? OR user_id IS NULL ORDER BY type, name',
        [userId]
      );
      return results;
    } catch (error) {
      console.error('Error finding categories by user:', error);
      throw error;
    }
  }

  /**
   * Obtiene categorías por tipo (income o expense)
   */
  async findByType(type: TransactionType, userId?: number): Promise<Category[]> {
    try {
      let sql = 'SELECT * FROM categories WHERE type = ?';
      const params: any[] = [type];

      if (userId !== undefined) {
        sql += ' AND (user_id = ? OR user_id IS NULL)';
        params.push(userId);
      }

      sql += ' ORDER BY name';

      const results = this.executeQuery<Category>(sql, params);
      return results;
    } catch (error) {
      console.error('Error finding categories by type:', error);
      throw error;
    }
  }

  /**
   * Obtiene categorías de ingresos
   */
  async findIncomeCategories(userId?: number): Promise<Category[]> {
    return this.findByType('income', userId);
  }

  /**
   * Obtiene categorías de gastos
   */
  async findExpenseCategories(userId?: number): Promise<Category[]> {
    return this.findByType('expense', userId);
  }

  /**
   * Obtiene categorías con sus totales (usando la vista category_totals)
   */
  async findWithTotals(userId: number): Promise<CategoryTotal[]> {
    try {
      const results = this.executeQuery<CategoryTotal>(
        'SELECT * FROM category_totals WHERE user_id = ? OR user_id IS NULL ORDER BY total DESC',
        [userId]
      );
      return results;
    } catch (error) {
      console.error('Error finding categories with totals:', error);
      throw error;
    }
  }

  /**
   * Obtiene categorías por defecto
   */
  async findDefaultCategories(): Promise<Category[]> {
    try {
      const results = this.executeQuery<Category>(
        'SELECT * FROM categories WHERE is_default = 1 ORDER BY type, name'
      );
      return results;
    } catch (error) {
      console.error('Error finding default categories:', error);
      throw error;
    }
  }

  /**
   * Obtiene categorías personalizadas (no por defecto)
   */
  async findCustomCategories(userId: number): Promise<Category[]> {
    try {
      const results = this.executeQuery<Category>(
        'SELECT * FROM categories WHERE user_id = ? AND is_default = 0 ORDER BY type, name',
        [userId]
      );
      return results;
    } catch (error) {
      console.error('Error finding custom categories:', error);
      throw error;
    }
  }

  /**
   * Verifica si una categoría está siendo usada en transacciones
   */
  async isInUse(categoryId: number): Promise<boolean> {
    try {
      const result = this.executeQuerySingle(
        'SELECT 1 FROM transactions WHERE category_id = ? LIMIT 1',
        [categoryId]
      );
      return result !== null;
    } catch (error) {
      console.error('Error checking if category is in use:', error);
      throw error;
    }
  }

  /**
   * Obtiene el conteo de transacciones por categoría
   */
  async getTransactionCount(categoryId: number): Promise<number> {
    try {
      const result = await this.executeQuerySingle<{ count: number }>(
        'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
        [categoryId]
      );
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting transaction count for category:', error);
      throw error;
    }
  }

  /**
   * Obtiene el total gastado/ganado en una categoría
   */
  async getTotalAmount(categoryId: number): Promise<number> {
    try {
      const result = await this.executeQuerySingle<{ total: number }>(
        'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE category_id = ?',
        [categoryId]
      );
      return result?.total || 0;
    } catch (error) {
      console.error('Error getting total amount for category:', error);
      throw error;
    }
  }

  /**
   * Cuenta categorías por tipo
   */
  async countByType(type: TransactionType, userId?: number): Promise<number> {
    try {
      let sql = 'SELECT COUNT(*) as total FROM categories WHERE type = ?';
      const params: any[] = [type];

      if (userId !== undefined) {
        sql += ' AND (user_id = ? OR user_id IS NULL)';
        params.push(userId);
      }

      const result = await this.executeQuerySingle<{ total: number }>(sql, params);
      return result?.total || 0;
    } catch (error) {
      console.error('Error counting categories by type:', error);
      throw error;
    }
  }

  /**
   * Busca categorías por nombre (búsqueda parcial)
   */
  async searchByName(query: string, userId?: number): Promise<Category[]> {
    try {
      let sql = 'SELECT * FROM categories WHERE name LIKE ?';
      const params: any[] = [`%${query}%`];

      if (userId !== undefined) {
        sql += ' AND (user_id = ? OR user_id IS NULL)';
        params.push(userId);
      }

      sql += ' ORDER BY name LIMIT 20';

      const results = this.executeQuery<Category>(sql, params);
      return results;
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de una categoría
   */
  async getCategoryStats(categoryId: number): Promise<{
    id: number;
    name: string;
    type: TransactionType;
    color: string;
    icon: string;
    is_default: number;
    transaction_count: number;
    total_amount: number;
    avg_amount: number;
    last_transaction_date: string | null;
  } | null> {
    try {
      const result = await this.executeQuerySingle<any>(
        `SELECT 
          c.id,
          c.name,
          c.type,
          c.color,
          c.icon,
          c.is_default,
          COUNT(t.id) as transaction_count,
          COALESCE(SUM(t.amount), 0) as total_amount,
          COALESCE(AVG(t.amount), 0) as avg_amount,
          MAX(t.date) as last_transaction_date
        FROM categories c
        LEFT JOIN transactions t ON c.id = t.category_id
        WHERE c.id = ?
        GROUP BY c.id`,
        [categoryId]
      );
      
      return result;
    } catch (error) {
      console.error('Error getting category stats:', error);
      throw error;
    }
  }

  /**
   * Duplica una categoría (útil para crear variantes)
   */
  async duplicate(categoryId: number, newName: string, userId: number): Promise<Category> {
    try {
      const original = await this.findById(categoryId);
      
      if (!original) {
        throw new Error(`Category with id ${categoryId} not found`);
      }

      const duplicated = await this.create({
        name: newName,
        type: original.type,
        color: original.color,
        icon: original.icon,
        user_id: userId,
      });

      console.log(`✅ Categoría "${original.name}" duplicada como "${newName}"`);
      return duplicated;
    } catch (error) {
      console.error('Error duplicating category:', error);
      throw error;
    }
  }

  /**
   * Resetea todas las categorías a sus valores por defecto
   * ⚠️ PELIGRO: Elimina categorías personalizadas del usuario
   */
  async resetToDefaults(userId: number): Promise<void> {
    try {
      // Eliminar categorías personalizadas del usuario
      await this.executeCommand(
        'DELETE FROM categories WHERE user_id = ? AND is_default = 0',
        [userId]
      );

      // Restaurar categorías por defecto que fueron modificadas
      await this.executeCommand(
        'UPDATE categories SET is_default = 1 WHERE user_id = ? AND is_default = 0',
        [userId]
      );

      await this.save();
      console.log(`✅ Categorías del usuario ${userId} reseteadas a valores por defecto`);
    } catch (error) {
      console.error('Error resetting categories to defaults:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const categoryRepository = new CategoryRepository();