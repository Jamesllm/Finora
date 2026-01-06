/**
 * DatabaseTest Component
 * Componente de prueba para verificar que SQLite WASM funciona correctamente
 */

'use client';

import { useDatabase } from '@/hooks/useDatabase';
import { sqliteClient } from '@/db/sqlite-client';
import { useState } from 'react';

export default function DatabaseTest() {
  const { isInitialized, isLoading, error, exportDatabase, resetDatabase } = useDatabase();
  const [testResult, setTestResult] = useState<string>('');

  const runTest = async () => {
    if (!isInitialized) {
      setTestResult('❌ Base de datos no inicializada');
      return;
    }

    try {
      // Test 1: Insertar una categoría
      const result = sqliteClient.run(
        `INSERT INTO categories (name, type, color, icon, is_default) 
         VALUES (?, ?, ?, ?, ?)`,
        ['Prueba', 'expense', '#FF0000', '🧪', 0]
      );

      // Test 2: Leer la categoría
      const categories = sqliteClient.getAll(
        'SELECT * FROM categories WHERE name = ?',
        ['Prueba']
      );

      // Test 3: Guardar en IndexedDB
      await sqliteClient.saveDatabase();

      setTestResult(`✅ Test exitoso!
- Insertado ID: ${result.lastID}
- Categorías encontradas: ${categories.length}
- Primera categoría: ${JSON.stringify(categories[0], null, 2)}`);
    } catch (err) {
      setTestResult(`❌ Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handleExport = async () => {
    try {
      await exportDatabase();
      setTestResult('✅ Base de datos exportada correctamente');
    } catch (err) {
      setTestResult(`❌ Error al exportar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  const handleReset = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar todos los datos?')) {
      return;
    }

    try {
      await resetDatabase();
      setTestResult('✅ Base de datos reiniciada correctamente');
    } catch (err) {
      setTestResult(`❌ Error al reiniciar: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando SQLite WASM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-center mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold">Error al inicializar</h2>
          </div>
          <p className="text-gray-700">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            🧪 SQLite WASM - Test Suite
          </h1>

          {/* Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-semibold">
                Estado: {isInitialized ? '✅ Inicializado' : '❌ No inicializado'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              SQLite está corriendo 100% en tu navegador usando WebAssembly
            </p>
          </div>

          {/* Botones de prueba */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={runTest}
              disabled={!isInitialized}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              🧪 Ejecutar Test
            </button>

            <button
              onClick={handleExport}
              disabled={!isInitialized}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              💾 Exportar DB
            </button>

            <button
              onClick={handleReset}
              disabled={!isInitialized}
              className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors col-span-2"
            >
              🗑️ Reiniciar DB (PELIGRO)
            </button>
          </div>

          {/* Resultado */}
          {testResult && (
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Resultado:</h3>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {testResult}
              </pre>
            </div>
          )}

          {/* Información técnica */}
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold mb-3">📊 Información Técnica</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Motor:</span>
                <span className="font-mono">SQLite 3.x (WASM)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Persistencia:</span>
                <span className="font-mono">IndexedDB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ubicación:</span>
                <span className="font-mono">localStorage del navegador</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Backend:</span>
                <span className="font-mono text-green-600">❌ No requerido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}