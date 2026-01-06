/**
 * TypeScript Types para la base de datos
 */

// ============================================
// TIPOS BASE
// ============================================

export type TransactionType = 'income' | 'expense';
export type Theme = 'light' | 'dark' | 'system';

// ============================================
// TABLAS
// ============================================

export interface User {
  id: number;
  username: string;
  pin_hash: string;
  salt: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  is_default: number; // SQLite usa INTEGER para BOOLEAN (0 = false, 1 = true)
  user_id: number | null;
  created_at: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  category_id: number;
  description: string | null;
  date: string; // Format: YYYY-MM-DD
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: number;
  user_id: number;
  currency: string;
  currency_symbol: string;
  theme: Theme;
  language: string;
  date_format: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: number;
  category_id: number;
  amount: number;
  month: number; // 1-12
  year: number;
  user_id: number;
  created_at: string;
}

export interface SavingsGoal {
  id: number;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  color: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// VISTAS
// ============================================

export interface MonthlySummary {
  month: string; // Format: YYYY-MM
  type: TransactionType;
  total: number;
  transaction_count: number;
  user_id: number;
}

export interface CategoryTotal {
  category_id: number;
  category_name: string;
  category_type: TransactionType;
  color: string;
  icon: string;
  total: number;
  transaction_count: number;
  user_id: number | null;
}

export interface RecentTransaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  user_id: number;
}

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface CreateUserDTO {
  username: string;
  pin_hash: string;
  salt: string;
}

export interface CreateCategoryDTO {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  user_id?: number | null;
}

export interface UpdateCategoryDTO {
  name?: string;
  color?: string;
  icon?: string;
}

export interface CreateTransactionDTO {
  amount: number;
  type: TransactionType;
  category_id: number;
  description?: string | null;
  date: string; // Format: YYYY-MM-DD
  user_id: number;
}

export interface UpdateTransactionDTO {
  amount?: number;
  type?: TransactionType;
  category_id?: number;
  description?: string | null;
  date?: string;
}

export interface UpdateSettingsDTO {
  currency?: string;
  currency_symbol?: string;
  theme?: Theme;
  language?: string;
  date_format?: string;
}

export interface CreateBudgetDTO {
  category_id: number;
  amount: number;
  month: number;
  year: number;
  user_id: number;
}

// ============================================
// QUERY RESULTS
// ============================================

export interface BalanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
}

export interface MonthlyComparison {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdown {
  category_id: number;
  category_name: string;
  color: string;
  icon: string;
  total: number;
  percentage: number;
}

// ============================================
// FILTROS
// ============================================

export interface TransactionFilters {
  type?: TransactionType;
  category_id?: number;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string; // Buscar en description
}

export interface DateRange {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
}

// ============================================
// HELPERS
// ============================================

/**
 * Convierte un INTEGER de SQLite a boolean
 */
export const sqliteToBoolean = (value: number): boolean => {
  return value === 1;
};

/**
 * Convierte un boolean a INTEGER de SQLite
 */
export const booleanToSqlite = (value: boolean): number => {
  return value ? 1 : 0;
};