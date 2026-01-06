/**
 * Seed Data - Categorías por defecto
 * Se insertan automáticamente al crear un nuevo usuario
 */

'use client';

import { sqliteClient } from './sqlite-client';

export interface DefaultCategory {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

// Categorías por defecto para INGRESOS
export const DEFAULT_INCOME_CATEGORIES: DefaultCategory[] = [
  { name: 'Salario', type: 'income', color: '#10B981', icon: 'Briefcase' },
  { name: 'Freelance', type: 'income', color: '#06B6D4', icon: 'Monitor' },
  { name: 'Inversiones', type: 'income', color: '#8B5CF6', icon: 'TrendingUp' },
  { name: 'Negocio', type: 'income', color: '#F59E0B', icon: 'Building2' },
  { name: 'Regalos', type: 'income', color: '#EC4899', icon: 'Gift' },
  { name: 'Otros Ingresos', type: 'income', color: '#6B7280', icon: 'Wallet' },
];

// Categorías por defecto para GASTOS
export const DEFAULT_EXPENSE_CATEGORIES: DefaultCategory[] = [
  { name: 'Alimentación', type: 'expense', color: '#EF4444', icon: 'Utensils' },
  { name: 'Transporte', type: 'expense', color: '#F59E0B', icon: 'Car' },
  { name: 'Vivienda', type: 'expense', color: '#3B82F6', icon: 'Home' },
  { name: 'Servicios', type: 'expense', color: '#8B5CF6', icon: 'Lightbulb' },
  { name: 'Salud', type: 'expense', color: '#EC4899', icon: 'Heart' },
  { name: 'Educación', type: 'expense', color: '#06B6D4', icon: 'Book' },
  { name: 'Entretenimiento', type: 'expense', color: '#F43F5E', icon: 'Gamepad2' },
  { name: 'Compras', type: 'expense', color: '#A855F7', icon: 'ShoppingCart' },
  { name: 'Gimnasio', type: 'expense', color: '#10B981', icon: 'Dumbbell' },
  { name: 'Suscripciones', type: 'expense', color: '#6366F1', icon: 'Smartphone' },
  { name: 'Mascotas', type: 'expense', color: '#F97316', icon: 'Dog' },
  { name: 'Ropa', type: 'expense', color: '#EC4899', icon: 'Shirt' },
  { name: 'Regalos', type: 'expense', color: '#14B8A6', icon: 'Gift' },
  { name: 'Viajes', type: 'expense', color: '#0EA5E9', icon: 'Plane' },
  { name: 'Otros Gastos', type: 'expense', color: '#6B7280', icon: 'Package' },
];

/**
 * Inserta las categorías por defecto para un usuario
 */
export const seedDefaultCategories = async (userId: number): Promise<void> => {
  try {
    const allCategories = [
      ...DEFAULT_INCOME_CATEGORIES,
      ...DEFAULT_EXPENSE_CATEGORIES,
    ];

    for (const category of allCategories) {
      sqliteClient.run(
        `INSERT INTO categories (name, type, color, icon, is_default, user_id) 
         VALUES (?, ?, ?, ?, 1, ?)`,
        [category.name, category.type, category.color, category.icon, userId]
      );
    }

    await sqliteClient.saveDatabase();
    console.log(`✅ Categorías por defecto creadas para usuario ${userId}`);
  } catch (error) {
    console.error('Error seeding default categories:', error);
    throw error;
  }
};

/**
 * Inserta transacciones de ejemplo (solo para demo)
 */
export const seedDemoTransactions = async (userId: number): Promise<void> => {
  try {
    // Obtener algunas categorías para usar en las transacciones
    const categories = sqliteClient.getAll(
      'SELECT id, type FROM categories WHERE user_id = ? LIMIT 5',
      [userId]
    );

    if (categories.length === 0) {
      console.warn('No hay categorías disponibles para crear transacciones demo');
      return;
    }

    const today = new Date();
    const demoTransactions = [
      {
        amount: 3000,
        type: 'income',
        categoryId: categories.find((c: any) => c.type === 'income')?.id,
        description: 'Salario del mes',
        date: today.toISOString().split('T')[0],
      },
      {
        amount: 50,
        type: 'expense',
        categoryId: categories.find((c: any) => c.type === 'expense')?.id,
        description: 'Almuerzo con amigos',
        date: today.toISOString().split('T')[0],
      },
      {
        amount: 120,
        type: 'expense',
        categoryId: categories.find((c: any) => c.type === 'expense')?.id,
        description: 'Compra de supermercado',
        date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0],
      },
    ];

    for (const transaction of demoTransactions) {
      if (transaction.categoryId) {
        sqliteClient.run(
          `INSERT INTO transactions (amount, type, category_id, description, date, user_id)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            transaction.amount,
            transaction.type,
            transaction.categoryId,
            transaction.description,
            transaction.date,
            userId,
          ]
        );
      }
    }

    await sqliteClient.saveDatabase();
    console.log(`✅ Transacciones demo creadas para usuario ${userId}`);
  } catch (error) {
    console.error('Error seeding demo transactions:', error);
    throw error;
  }
};

/**
 * Crea la configuración por defecto para un nuevo usuario
 */
export const seedDefaultSettings = async (userId: number): Promise<void> => {
  try {
    sqliteClient.run(
      `INSERT INTO settings (user_id, currency, currency_symbol, theme, language, date_format) 
       VALUES (?, 'PEN', 'S/', 'light', 'es', 'DD/MM/YYYY')`,
      [userId]
    );

    await sqliteClient.saveDatabase();
    console.log(`✅ Configuración por defecto creada para usuario ${userId}`);
  } catch (error) {
    console.error('Error seeding default settings:', error);
    throw error;
  }
};