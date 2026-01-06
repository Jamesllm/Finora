/**
 * components/settings/ThemeSettings.tsx
 * Componente para cambiar el tema
 */

'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore, Theme } from '@/stores/themeStore';
import { Card, CardHeader, CardBody } from '@/components/ui';

const THEME_OPTIONS: { value: Theme; icon: any; label: string; description: string }[] = [
  {
    value: 'light',
    icon: Sun,
    label: 'Claro',
    description: 'Tema claro siempre activo',
  },
  {
    value: 'dark',
    icon: Moon,
    label: 'Oscuro',
    description: 'Tema oscuro siempre activo',
  },
  {
    value: 'system',
    icon: Monitor,
    label: 'Sistema',
    description: 'Sigue la preferencia del sistema',
  },
];

export default function ThemeSettings() {
  const { theme, setTheme } = useThemeStore();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <Card variant="elevated">
      <CardHeader
        title="🎨 Tema"
        subtitle="Personaliza la apariencia"
        icon={<span className="text-2xl">🎨</span>}
      />
      <CardBody>
        <div className="space-y-3">
          {THEME_OPTIONS.map(({ value, icon: Icon, label, description }) => (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all
                ${
                  theme === value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div
                className={`
                p-3 rounded-lg transition-colors
                ${
                  theme === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }
              `}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 text-left">
                <h4
                  className={`
                  font-semibold mb-0.5
                  ${
                    theme === value
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-800 dark:text-gray-200'
                  }
                `}
                >
                  {label}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              </div>

              {theme === value && (
                <div className="text-blue-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Vista previa:
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-300 dark:border-gray-700"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}