/**
 * Base Repository
 * Clase base abstracta con operaciones CRUD genéricas
 */

'use client';

import { sqliteClient } from '@/db/sqlite-client';

export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  /**
   * Obtiene todos los registros
   */
  async findAll(): Promise<T[]> {
    try {
      await sqliteClient.initialize();
      const results = sqliteClient.getAll(`SELECT * FROM ${this.tableName}`);
      return results as T[];
    } catch (error) {
      console.error(`Error fetching all from ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene un registro por ID
   */
  async findById(id: number): Promise<T | null> {
    try {
      await sqliteClient.initialize();
      const result = sqliteClient.getFirstRow(
        `SELECT * FROM ${this.tableName} WHERE id = ?`,
        [id]
      );
      return result as T | null;
    } catch (error) {
      console.error(`Error fetching by id from ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un registro por ID
   */
  async delete(id: number): Promise<boolean> {
    try {
      await sqliteClient.initialize();
      const result = sqliteClient.run(
        `DELETE FROM ${this.tableName} WHERE id = ?`,
        [id]
      );

      await sqliteClient.saveDatabase();
      return result.changes > 0;
    } catch (error) {
      console.error(`Error deleting from ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Cuenta el total de registros
   */
  async count(): Promise<number> {
    try {
      await sqliteClient.initialize();
      const result = sqliteClient.getFirstRow(
        `SELECT COUNT(*) as total FROM ${this.tableName}`
      );
      return result?.total || 0;
    } catch (error) {
      console.error(`Error counting ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Verifica si existe un registro con el ID dado
   */
  async exists(id: number): Promise<boolean> {
    try {
      await sqliteClient.initialize();
      const result = sqliteClient.getFirstRow(
        `SELECT 1 FROM ${this.tableName} WHERE id = ? LIMIT 1`,
        [id]
      );
      return result !== null;
    } catch (error) {
      console.error(`Error checking existence in ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Ejecuta una query personalizada
   */
  protected async executeQuery<R = any>(sql: string, params?: any[]): Promise<R[]> {
    try {
      await sqliteClient.initialize();
      return sqliteClient.getAll(sql, params) as R[];
    } catch (error) {
      console.error('Error executing custom query:', error);
      throw error;
    }
  }

  /**
   * Ejecuta una query que retorna una sola fila
   */
  async executeQuerySingle<R = any>(sql: string, params?: any[]): Promise<R | null> {
    try {
      await sqliteClient.initialize();
      return sqliteClient.getFirstRow(sql, params) as R | null;
    } catch (error) {
      console.error('Error executing single query:', error);
      throw error;
    }
  }

  /**
   * Ejecuta una operación de modificación (INSERT, UPDATE, DELETE)
   */
  protected async executeCommand(sql: string, params?: any[]): Promise<{ lastID: number; changes: number }> {
    try {
      await sqliteClient.initialize();
      return sqliteClient.run(sql, params);
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }

  /**
   * Guarda los cambios en IndexedDB
   */
  protected async save(): Promise<void> {
    await sqliteClient.saveDatabase();
  }
}