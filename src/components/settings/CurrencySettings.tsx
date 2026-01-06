/**
 * components/settings/CurrencySettings.tsx
 * Componente para cambiar la moneda
 */

'use client';

import { DollarSign, Check } from 'lucide-react';
import { useCurrencyStore, CURRENCIES } from '@/stores/currencyStore';
import { Card, CardHeader, CardBody, Badge } from '@/components/ui';

export default function CurrencySettings() {
  const { currency, setCurrency, formatAmount } = useCurrencyStore();

  const handleCurrencyChange = (currencyCode: string) => {
    setCurrency(currencyCode);
  };

  return (
    <Card variant="elevated">
      <CardHeader
        title="💱 Moneda"
        subtitle="Selecciona tu moneda preferida"
        icon={<span className="text-2xl">💱</span>}
      />
      <CardBody>
        {/* Moneda actual */}
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Moneda actual
              </p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {currency.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currency.code} ({currency.symbol})
              </p>
            </div>
            <Badge variant="success" size="sm">
              Activa
            </Badge>
          </div>
        </div>

        {/* Lista de monedas */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {CURRENCIES.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencyChange(curr.code)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg border transition-all
                ${
                  currency.code === curr.code
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              <div
                className={`
                w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg
                ${
                  currency.code === curr.code
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }
              `}
              >
                {curr.symbol}
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h4
                    className={`
                    font-semibold
                    ${
                      currency.code === curr.code
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-gray-800 dark:text-gray-200'
                    }
                  `}
                  >
                    {curr.name}
                  </h4>
                  <Badge
                    variant={currency.code === curr.code ? 'success' : 'default'}
                    size="sm"
                  >
                    {curr.code}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  Ejemplo: {formatAmount(1234.56)}
                </p>
              </div>

              {currency.code === curr.code && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </button>
          ))}
        </div>

        {/* Ejemplo de formato */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
            💡 <strong>Ejemplo de formato:</strong>
          </p>
          <div className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
            <div className="flex justify-between">
              <span>1,000.00:</span>
              <span className="font-mono font-bold">{formatAmount(1000)}</span>
            </div>
            <div className="flex justify-between">
              <span>50,250.75:</span>
              <span className="font-mono font-bold">{formatAmount(50250.75)}</span>
            </div>
            <div className="flex justify-between">
              <span>-1,500.00:</span>
              <span className="font-mono font-bold">{formatAmount(-1500)}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}