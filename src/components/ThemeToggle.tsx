// components/ThemeToggle.tsx
'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light', icon: Sun, label: 'Claro' },
    { value: 'dark', icon: Moon, label: 'Oscuro' },
    { value: 'system', icon: Monitor, label: 'Sistema' }
  ] as const

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            px-3 py-2 rounded-md transition-all duration-200
            ${theme === value 
              ? 'bg-white dark:bg-gray-700 shadow-sm' 
              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  )
}