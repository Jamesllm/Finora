/**
 * Settings Repository
 * Maneja todas las operaciones relacionadas con configuración
 */

'use client';

import { BaseRepository } from './base.repository';
import { Settings, UpdateSettingsDTO } from '@/types/database.types';

class SettingsRepository extends BaseRepository<Settings> {
  protected tableName = 'settings';

  /**
   * Crea configuración inicial para un usuario
   */
  async create(userId: number): Promise<Settings> {
    try {
      const result = await this.executeCommand(
        `INSERT INTO settings (user_id, currency, currency_symbol, theme, language, date_format) 
         VALUES (?, 'USD', '$', 'system', 'es', 'DD/MM/YYYY')`,
        [userId]
      );

      await this.save();

      const settings = await this.findById(result.lastID);

      if (!settings) {
        throw new Error('Error retrieving created settings');
      }

      return settings;
    } catch (error) {
      console.error('Error creating settings:', error);
      throw error;
    }
  }

  /**
   * Obtiene la configuración de un usuario
   */
  async findByUserId(userId: number): Promise<Settings | null> {
    try {
      const result = this.executeQuerySingle<Settings>(
        'SELECT * FROM settings WHERE user_id = ?',
        [userId]
      );
      return result;
    } catch (error) {
      console.error('Error finding settings by user:', error);
      throw error;
    }
  }

  /**
   * Actualiza la configuración de un usuario
   */
  async updateByUserId(userId: number, data: UpdateSettingsDTO): Promise<boolean> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.currency !== undefined) {
        updates.push('currency = ?');
        values.push(data.currency);
      }

      if (data.currency_symbol !== undefined) {
        updates.push('currency_symbol = ?');
        values.push(data.currency_symbol);
      }

      if (data.theme !== undefined) {
        updates.push('theme = ?');
        values.push(data.theme);
      }

      if (data.language !== undefined) {
        updates.push('language = ?');
        values.push(data.language);
      }

      if (data.date_format !== undefined) {
        updates.push('date_format = ?');
        values.push(data.date_format);
      }

      if (updates.length === 0) {
        return false;
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(userId);

      const result = await this.executeCommand(
        `UPDATE settings SET ${updates.join(', ')} WHERE user_id = ?`,
        values
      );

      await this.save();
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  /**
   * Obtiene o crea la configuración de un usuario
   */
  async getOrCreate(userId: number): Promise<Settings> {
    try {
      let settings = await this.findByUserId(userId);

      if (!settings) {
        settings = await this.create(userId);
      }

      return settings;
    } catch (error) {
      console.error('Error getting or creating settings:', error);
      throw error;
    }
  }

  /**
   * Actualiza solo el tema
   */
  async updateTheme(userId: number, theme: 'light' | 'dark' | 'system'): Promise<boolean> {
    try {
      const result = await this.executeCommand(
        'UPDATE settings SET theme = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [theme, userId]
      );

      await this.save();
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  }

  /**
   * Actualiza la moneda
   */
  async updateCurrency(userId: number, currency: string, symbol: string): Promise<boolean> {
    try {
      const result = await this.executeCommand(
        'UPDATE settings SET currency = ?, currency_symbol = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [currency, symbol, userId]
      );

      await this.save();
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating currency:', error);
      throw error;
    }
  }

  /**
   * Reinicia la configuración a valores por defecto
   */
  async reset(userId: number): Promise<boolean> {
    try {
      const result = await this.executeCommand(
        `UPDATE settings 
         SET currency = 'USD', 
             currency_symbol = '$', 
             theme = 'system', 
             language = 'es', 
             date_format = 'DD/MM/YYYY',
             updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = ?`,
        [userId]
      );

      await this.save();
      return result.changes > 0;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const settingsRepository = new SettingsRepository();