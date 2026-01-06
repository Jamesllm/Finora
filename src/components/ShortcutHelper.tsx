// components/ShortcutHelper.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useShortcutHelper } from '@/hooks/useKeyboardShortcuts'
import { X } from 'lucide-react'

export function ShortcutHelper() {
  const router = useRouter()

  const APP_SHORTCUTS = [
    { key: 'n', ctrl: true, description: 'Nueva transacción', handler: () => router.push('/transactions?new=true') },
    {
      key: 'k', ctrl: true, description: 'Buscar', handler: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (searchInput) searchInput.focus()
      }
    },
    { key: 'd', ctrl: true, description: 'Dashboard', handler: () => router.push('/dashboard') },
    { key: 't', ctrl: true, description: 'Transacciones', handler: () => router.push('/transactions') },
    { key: 'c', ctrl: true, description: 'Categorías', handler: () => router.push('/categories') },
    { key: 'r', ctrl: true, description: 'Reportes', handler: () => router.push('/reports') },
    { key: ',', ctrl: true, description: 'Configuración', handler: () => router.push('/settings') }
  ]

  const { shortcuts, isOpen, setIsOpen } = useShortcutHelper(APP_SHORTCUTS)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-neutral-800 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Atajos de Teclado</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className="flex justify-between items-center group">
              <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                {shortcut.description}
              </span>
              <div className="flex gap-1.5 items-center">
                {shortcut.ctrl && (
                  <kbd className="px-2 py-1.5 bg-gray-100 dark:bg-neutral-800 border-b-2 border-gray-300 dark:border-neutral-700 rounded-md text-[10px] font-bold font-sans text-gray-500 dark:text-gray-400">
                    CTRL
                  </kbd>
                )}
                {shortcut.shift && (
                  <kbd className="px-2 py-1.5 bg-gray-100 dark:bg-neutral-800 border-b-2 border-gray-300 dark:border-neutral-700 rounded-md text-[10px] font-bold font-sans text-gray-500 dark:text-gray-400">
                    SHIFT
                  </kbd>
                )}
                <span className="text-gray-400 font-light">+</span>
                <kbd className="min-w-[28px] flex items-center justify-center px-2 py-1.5 bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-200 dark:border-blue-800 rounded-md text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                  {shortcut.key.toUpperCase()}
                </kbd>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-neutral-800/30 border-t border-gray-100 dark:border-neutral-800">
          <p className="text-center text-xs text-gray-500 dark:text-gray-500">
            Presiona <span className="font-bold underline">ESC</span> para cerrar esta ayuda
          </p>
        </div>
      </div>
    </div>
  )
}