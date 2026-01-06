/**
 * RepositoryTest Component
 * Componente para probar todos los repositorios
 */

'use client';

import { useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import {
  userRepository,
  categoryRepository,
  transactionRepository,
  settingsRepository,
} from '@/repositories';
import { seedDefaultCategories } from '@/db/seed';

export default function RepositoryTest() {
  const { isInitialized, isLoading } = useDatabase();
  const [output, setOutput] = useState<string>('');
  const [testUserId, setTestUserId] = useState<number | null>(null);

  const log = (message: string) => {
    setOutput((prev) => prev + message + '\n');
    console.log(message);
  };

  const clearOutput = () => {
    setOutput('');
  };

  /**
   * Test 1: Crear usuario
   */
  const testCreateUser = async () => {
    clearOutput();
    try {
      log('🧪 Test 1: Crear Usuario');
      log('─────────────────────────────');

      // Crear usuario
      const user = await userRepository.create({
        username: 'testuser',
        pin_hash: 'hash123',
        salt: 'salt123',
      });

      log(`✅ Usuario creado: ID=${user.id}, Username=${user.username}`);
      setTestUserId(user.id);

      // Crear configuración
      const settings = await settingsRepository.create(user.id);
      log(`✅ Configuración creada: Currency=${settings.currency}`);

      // Crear categorías por defecto
      await seedDefaultCategories(user.id);
      log(`✅ Categorías por defecto creadas`);

    } catch (error) {
      log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Test 2: Listar categorías
   */
  const testListCategories = async () => {
    clearOutput();
    try {
      log('🧪 Test 2: Listar Categorías');
      log('─────────────────────────────');

      if (!testUserId) {
        log('⚠️ Primero debes crear un usuario (Test 1)');
        return;
      }

      const categories = await categoryRepository.findByUserId(testUserId);
      log(`✅ Total de categorías: ${categories.length}`);

      const income = categories.filter((c) => c.type === 'income');
      const expense = categories.filter((c) => c.type === 'expense');

      log(`   • Ingresos: ${income.length}`);
      log(`   • Gastos: ${expense.length}`);
      log('');
      log('Primeras 5 categorías:');
      categories.slice(0, 5).forEach((cat) => {
        log(`   ${cat.icon} ${cat.name} (${cat.type})`);
      });

    } catch (error) {
      log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Test 3: Crear transacciones
   */
  const testCreateTransactions = async () => {
    clearOutput();
    try {
      log('🧪 Test 3: Crear Transacciones');
      log('─────────────────────────────');

      if (!testUserId) {
        log('⚠️ Primero debes crear un usuario (Test 1)');
        return;
      }

      // Obtener categorías
      const categories = await categoryRepository.findByUserId(testUserId);
      const incomeCategory = categories.find((c) => c.type === 'income');
      const expenseCategory = categories.find((c) => c.type === 'expense');

      if (!incomeCategory || !expenseCategory) {
        log('❌ No hay categorías disponibles');
        return;
      }

      // Crear ingreso
      const income = await transactionRepository.create({
        amount: 5000,
        type: 'income',
        category_id: incomeCategory.id,
        description: 'Salario mensual',
        date: new Date().toISOString().split('T')[0],
        user_id: testUserId,
      });

      log(`✅ Ingreso creado: $${income.amount} - ${income.description}`);

      // Crear gasto
      const expense = await transactionRepository.create({
        amount: 150,
        type: 'expense',
        category_id: expenseCategory.id,
        description: 'Compra de supermercado',
        date: new Date().toISOString().split('T')[0],
        user_id: testUserId,
      });

      log(`✅ Gasto creado: $${expense.amount} - ${expense.description}`);

      // Crear más transacciones
      await transactionRepository.create({
        amount: 50,
        type: 'expense',
        category_id: expenseCategory.id,
        description: 'Cena en restaurante',
        date: new Date().toISOString().split('T')[0],
        user_id: testUserId,
      });

      log(`✅ Transacción adicional creada`);

    } catch (error) {
      log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Test 4: Balance y estadísticas
   */
  const testBalance = async () => {
    clearOutput();
    try {
      log('🧪 Test 4: Balance y Estadísticas');
      log('─────────────────────────────');

      if (!testUserId) {
        log('⚠️ Primero debes crear un usuario (Test 1)');
        return;
      }

      // Balance general
      const balance = await transactionRepository.getBalanceSummary(testUserId);
      log(`💰 Balance Total:`);
      log(`   • Ingresos: $${balance.totalIncome.toFixed(2)}`);
      log(`   • Gastos: $${balance.totalExpense.toFixed(2)}`);
      log(`   • Balance: $${balance.balance.toFixed(2)}`);
      log(`   • Transacciones: ${balance.incomeCount + balance.expenseCount}`);
      log('');

      // Desglose por categoría
      const breakdown = await transactionRepository.getCategoryBreakdown(
        testUserId,
        'expense'
      );

      log(`📊 Gastos por Categoría:`);
      breakdown.forEach((item) => {
        log(`   ${item.icon} ${item.category_name}: $${item.total.toFixed(2)} (${item.percentage.toFixed(1)}%)`);
      });

    } catch (error) {
      log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Test 5: Queries avanzadas
   */
  const testAdvancedQueries = async () => {
    clearOutput();
    try {
      log('🧪 Test 5: Queries Avanzadas');
      log('─────────────────────────────');

      if (!testUserId) {
        log('⚠️ Primero debes crear un usuario (Test 1)');
        return;
      }

      // Transacciones recientes
      const recent = await transactionRepository.findRecent(testUserId, 5);
      log(`📋 Últimas ${recent.length} transacciones:`);
      recent.forEach((t) => {
        const sign = t.type === 'income' ? '+' : '-';
        log(`   ${t.category_icon} ${sign}$${t.amount} - ${t.description || 'Sin descripción'}`);
      });
      log('');

      // Categorías con totales
      const categoriesWithTotals = await categoryRepository.findWithTotals(testUserId);
      const topCategories = categoriesWithTotals
        .filter((c) => c.total > 0)
        .slice(0, 5);

      log(`🏆 Top 5 Categorías Más Usadas:`);
      topCategories.forEach((cat, index) => {
        log(`   ${index + 1}. ${cat.icon} ${cat.category_name}: $${cat.total.toFixed(2)}`);
      });

    } catch (error) {
      log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Test 6: Actualizar y eliminar
   */
  const testUpdateDelete = async () => {
    clearOutput();
    try {
      log('🧪 Test 6: Actualizar y Eliminar');
      log('─────────────────────────────');

      if (!testUserId) {
        log('⚠️ Primero debes crear un usuario (Test 1)');
        return;
      }

      // Obtener una transacción
      const transactions = await transactionRepository.findByUserId(testUserId, 1);
      
      if (transactions.length === 0) {
        log('⚠️ No hay transacciones para probar');
        return;
      }

      const transaction = transactions[0];
      log(`📝 Transacción original: $${transaction.amount} - ${transaction.description}`);

      // Actualizar
      const updated = await transactionRepository.update(transaction.id, {
        amount: 999,
        description: 'Transacción actualizada',
      });

      if (updated) {
        log(`✅ Transacción actualizada exitosamente`);
      }

      // Verificar
      const updatedTransaction = await transactionRepository.findById(transaction.id);
      if (updatedTransaction) {
        log(`📝 Nueva versión: $${updatedTransaction.amount} - ${updatedTransaction.description}`);
      }

      // Actualizar configuración
      const settingsUpdated = await settingsRepository.updateByUserId(testUserId, {
        currency: 'EUR',
        currency_symbol: '€',
      });

      if (settingsUpdated) {
        log(`✅ Configuración actualizada a EUR (€)`);
      }

    } catch (error) {
      log(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando base de datos...</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Base de datos no inicializada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🗂️ Repository Pattern - Test Suite
          </h1>
          <p className="text-gray-600 mb-4">
            Prueba completa de todos los repositorios (User, Category, Transaction, Settings)
          </p>
          
          {testUserId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-800">
                ✅ Usuario de prueba activo: <span className="font-mono font-bold">ID={testUserId}</span>
              </p>
            </div>
          )}
        </div>

        {/* Botones de prueba */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={testCreateUser}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            1️⃣ Crear Usuario
          </button>

          <button
            onClick={testListCategories}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 font-semibold transition-colors"
          >
            2️⃣ Listar Categorías
          </button>

          <button
            onClick={testCreateTransactions}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-semibold transition-colors"
          >
            3️⃣ Crear Transacciones
          </button>

          <button
            onClick={testBalance}
            className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 font-semibold transition-colors"
          >
            4️⃣ Ver Balance
          </button>

          <button
            onClick={testAdvancedQueries}
            className="bg-pink-600 text-white px-4 py-3 rounded-lg hover:bg-pink-700 font-semibold transition-colors"
          >
            5️⃣ Queries Avanzadas
          </button>

          <button
            onClick={testUpdateDelete}
            className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
          >
            6️⃣ Actualizar/Eliminar
          </button>
        </div>

        {/* Output */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Consola de Resultados</h3>
            <button
              onClick={clearOutput}
              className="text-gray-400 hover:text-white text-sm"
            >
              Limpiar
            </button>
          </div>
          
          <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap min-h-[400px]">
            {output || '// Ejecuta un test para ver los resultados aquí...'}
          </pre>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Instrucciones</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Empieza con <strong>"1️⃣ Crear Usuario"</strong> para crear los datos iniciales</li>
            <li>Luego ejecuta los demás tests en orden</li>
            <li>Cada test usa el Repository Pattern para acceder a la DB</li>
            <li>Todos los cambios se guardan automáticamente en IndexedDB</li>
          </ol>
        </div>
      </div>
    </div>
  );
}