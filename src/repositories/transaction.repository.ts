/**
 * Transaction Repository
 * Maneja todas las operaciones relacionadas con transacciones
 */

'use client';

import { BaseRepository } from './base.repository';
import {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionFilters,
  RecentTransaction,
  BalanceSummary,
  MonthlyComparison,
  CategoryBreakdown,
  TransactionType,
} from '@/types/database.types';

class TransactionRepository extends BaseRepository<Transaction> {
  protected tableName = 'transactions';

  /**
   * Crea una nueva transacción
   */
  async create(data: CreateTransactionDTO): Promise<Transaction> {
    try {
      const result = await this.executeCommand(
        `INSERT INTO transactions (amount, type, category_id, description, date, user_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.amount,
          data.type,
          data.category_id,
          data.description || null,
          data.date,
          data.user_id,
        ]
      );

      await this.save();

      const transaction = await this.findById(result.lastID);

      if (!transaction) {
        throw new Error('Error retrieving created transaction');
      }

      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Actualiza una transacción
   */
  async update(id: number, data: UpdateTransactionDTO): Promise<boolean> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.amount !== undefined) {
        updates.push('amount = ?');
        values.push(data.amount);
      }

      if (data.type !== undefined) {
        updates.push('type = ?');
        values.push(data.type);
      }

      if (data.category_id !== undefined) {
        updates.push('category_id = ?');
        values.push(data.category_id);
      }

      if (data.description !== undefined) {
        updates.push('description = ?');
        values.push(data.description);
      }

      if (data.date !== undefined) {
        updates.push('date = ?');
        values.push(data.date);
      }

      if (updates.length === 0) {
        return false;
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const result = await this.executeCommand(
        `UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      await this.save();
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las transacciones de un usuario
   */
  async findByUserId(userId: number, limit?: number): Promise<Transaction[]> {
    try {
      let sql = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC';

      if (limit) {
        sql += ` LIMIT ${limit}`;
      }

      const results = this.executeQuery<Transaction>(sql, [userId]);
      return results;
    } catch (error) {
      console.error('Error finding transactions by user:', error);
      throw error;
    }
  }

  /**
   * Obtiene transacciones recientes con información de categoría (usa la vista)
   */
  async findRecent(userId: number, limit: number = 10): Promise<RecentTransaction[]> {
    try {
      const results = this.executeQuery<RecentTransaction>(
        'SELECT * FROM recent_transactions WHERE user_id = ? LIMIT ?',
        [userId, limit]
      );
      return results;
    } catch (error) {
      console.error('Error finding recent transactions:', error);
      throw error;
    }
  }

  /**
   * Obtiene transacciones con filtros avanzados
   */
  async findWithFilters(userId: number, filters: TransactionFilters): Promise<Transaction[]> {
    try {
      let sql = 'SELECT * FROM transactions WHERE user_id = ?';
      const params: any[] = [userId];

      // Filtro por tipo
      if (filters.type) {
        sql += ' AND type = ?';
        params.push(filters.type);
      }

      // Filtro por categoría
      if (filters.category_id) {
        sql += ' AND category_id = ?';
        params.push(filters.category_id);
      }

      // Filtro por rango de fechas
      if (filters.start_date) {
        sql += ' AND date >= ?';
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        sql += ' AND date <= ?';
        params.push(filters.end_date);
      }

      // Filtro por rango de montos
      if (filters.min_amount !== undefined) {
        sql += ' AND amount >= ?';
        params.push(filters.min_amount);
      }

      if (filters.max_amount !== undefined) {
        sql += ' AND amount <= ?';
        params.push(filters.max_amount);
      }

      // Filtro por búsqueda en descripción
      if (filters.search) {
        sql += ' AND description LIKE ?';
        params.push(`%${filters.search}%`);
      }

      sql += ' ORDER BY date DESC, created_at DESC';

      const results = this.executeQuery<Transaction>(sql, params);
      return results;
    } catch (error) {
      console.error('Error finding transactions with filters:', error);
      throw error;
    }
  }

  /**
   * Obtiene el resumen de balance (ingresos, gastos, balance)
   */
  async getBalanceSummary(userId: number, startDate?: string, endDate?: string): Promise<BalanceSummary> {
    try {
      let sql = `
        SELECT 
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense,
          COUNT(CASE WHEN type = 'income' THEN 1 END) as incomeCount,
          COUNT(CASE WHEN type = 'expense' THEN 1 END) as expenseCount
        FROM transactions 
        WHERE user_id = ?
      `;
      const params: any[] = [userId];

      if (startDate) {
        sql += ' AND date >= ?';
        params.push(startDate);
      }

      if (endDate) {
        sql += ' AND date <= ?';
        params.push(endDate);
      }

      const result = await this.executeQuerySingle<any>(sql, params);

      const totalIncome = result?.totalIncome || 0;
      const totalExpense = result?.totalExpense || 0;

      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        incomeCount: result?.incomeCount || 0,
        expenseCount: result?.expenseCount || 0,
      };
    } catch (error) {
      console.error('Error getting balance summary:', error);
      throw error;
    }
  }

  /**
   * Obtiene comparación mensual (últimos N meses)
   */
  async getMonthlyComparison(userId: number, months: number = 6): Promise<MonthlyComparison[]> {
    try {
      const sql = `
        SELECT 
          strftime('%Y-%m', date) as month,
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
        FROM transactions 
        WHERE user_id = ?
        GROUP BY month
        ORDER BY month DESC
        LIMIT ?
      `;

      const results = await this.executeQuery<any>(sql, [userId, months]);

      return results.map((row) => ({
        month: row.month,
        income: row.income || 0,
        expense: row.expense || 0,
        balance: (row.income || 0) - (row.expense || 0),
      })).reverse();
    } catch (error) {
      console.error('Error getting monthly comparison:', error);
      throw error;
    }
  }

  /**
   * Obtiene desglose por categoría
   */
  async getCategoryBreakdown(
    userId: number,
    type: TransactionType,
    startDate?: string,
    endDate?: string
  ): Promise<CategoryBreakdown[]> {
    try {
      let sql = `
        SELECT 
          c.id as category_id,
          c.name as category_name,
          c.color,
          c.icon,
          SUM(t.amount) as total
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ? AND t.type = ?
      `;
      const params: any[] = [userId, type];

      if (startDate) {
        sql += ' AND t.date >= ?';
        params.push(startDate);
      }

      if (endDate) {
        sql += ' AND t.date <= ?';
        params.push(endDate);
      }

      sql += ' GROUP BY c.id, c.name, c.color, c.icon ORDER BY total DESC';

      const results = await this.executeQuery<any>(sql, params);
      const totalAmount = results.reduce((sum, row) => sum + (row.total || 0), 0);

      return results.map((row) => ({
        category_id: row.category_id,
        category_name: row.category_name,
        color: row.color,
        icon: row.icon,
        total: row.total || 0,
        percentage: totalAmount > 0 ? ((row.total || 0) / totalAmount) * 100 : 0,
      }));
    } catch (error) {
      console.error('Error getting category breakdown:', error);
      throw error;
    }
  }

  /**
   * Obtiene transacciones por mes
   */
  async findByMonth(userId: number, year: number, month: number): Promise<Transaction[]> {
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

      const results = this.executeQuery<Transaction>(
        'SELECT * FROM transactions WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
        [userId, startDate, endDate]
      );

      return results;
    } catch (error) {
      console.error('Error finding transactions by month:', error);
      throw error;
    }
  }

  /**
   * Obtiene el total por tipo en un rango de fechas
   */
  async getTotalByType(
    userId: number,
    type: TransactionType,
    startDate?: string,
    endDate?: string
  ): Promise<number> {
    try {
      let sql = 'SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = ?';
      const params: any[] = [userId, type];

      if (startDate) {
        sql += ' AND date >= ?';
        params.push(startDate);
      }

      if (endDate) {
        sql += ' AND date <= ?';
        params.push(endDate);
      }

      const result = await this.executeQuerySingle<{ total: number }>(sql, params);
      return result?.total || 0;
    } catch (error) {
      console.error('Error getting total by type:', error);
      throw error;
    }
  }

  /**
   * Elimina todas las transacciones de un usuario (usado en reset)
   */
  async deleteByUserId(userId: number): Promise<number> {
    try {
      const result = await this.executeCommand(
        'DELETE FROM transactions WHERE user_id = ?',
        [userId]
      );

      await this.save();
      return result.changes;
    } catch (error) {
      console.error('Error deleting transactions by user:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const transactionRepository = new TransactionRepository();