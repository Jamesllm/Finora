/**
 * User Repository
 * Maneja todas las operaciones relacionadas con usuarios
 */

'use client';

import { BaseRepository } from './base.repository';
import { User, CreateUserDTO } from '@/types/database.types';

class UserRepository extends BaseRepository<User> {
  protected tableName = 'users';

  /**
   * Crea un nuevo usuario
   */
  async create(data: CreateUserDTO): Promise<User> {
    try {
      const result = await this.executeCommand(
        `INSERT INTO users (username, pin_hash, salt) 
         VALUES (?, ?, ?)`,
        [data.username, data.pin_hash, data.salt]
      );

      await this.save();

      // Obtener el usuario recién creado
      const user = await this.findById(result.lastID);

      if (!user) {
        throw new Error('Error retrieving created user');
      }

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Busca un usuario por username
   */
  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.executeQuerySingle<User>(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return result;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  /**
   * Verifica si existe un usuario con el username dado
   */
  async existsByUsername(username: string): Promise<boolean> {
    try {
      const result = await this.executeQuerySingle(
        'SELECT 1 FROM users WHERE username = ? LIMIT 1',
        [username]
      );
      return result !== null;
    } catch (error) {
      console.error('Error checking username existence:', error);
      throw error;
    }
  }

  /**
   * Actualiza el PIN de un usuario
   */
  async updatePin(userId: number, pinHash: string, salt: string): Promise<boolean> {
    try {
      const result = await this.executeCommand(
        'UPDATE users SET pin_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [pinHash, salt, userId]
      );

      await this.save();
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating PIN:', error);
      throw error;
    }
  }

  /**
   * Obtiene el primer usuario (útil para apps de un solo usuario)
   */
  async getFirstUser(): Promise<User | null> {
    try {
      const result = await this.executeQuerySingle<User>(
        'SELECT * FROM users ORDER BY id ASC LIMIT 1'
      );
      return result;
    } catch (error) {
      console.error('Error getting first user:', error);
      throw error;
    }
  }

  /**
   * Verifica si existe al menos un usuario en el sistema
   */
  async hasUsers(): Promise<boolean> {
    try {
      const count = await this.count();
      return count > 0;
    } catch (error) {
      console.error('Error checking if users exist:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const userRepository = new UserRepository();