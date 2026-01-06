/**
 * Repositories Index
 * Exporta todos los repositorios desde un solo punto
 */

export { BaseRepository } from './base.repository';
export { userRepository } from './user.repository';
export { categoryRepository } from './category.repository';
export { transactionRepository } from './transaction.repository';
export { settingsRepository } from './settings.repository';

/**
 * Ejemplo de uso:
 * 
 * import { userRepository, transactionRepository } from '@/repositories';
 * 
 * const user = await userRepository.findById(1);
 * const transactions = await transactionRepository.findByUserId(user.id);
 */