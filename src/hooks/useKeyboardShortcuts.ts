// hooks/useKeyboardShortcuts.ts
'use client'

import { useEffect, useCallback, useState } from 'react'

type KeyHandler = (e: KeyboardEvent) => void

interface Shortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  handler?: KeyHandler
  description: string
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      if (!shortcut.handler) continue

      const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey
      const altMatch = shortcut.alt ? e.altKey : !e.altKey
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey

      if (
        e.key.toLowerCase() === shortcut.key.toLowerCase() &&
        ctrlMatch &&
        altMatch &&
        shiftMatch
      ) {
        e.preventDefault()
        shortcut.handler(e)
      }
    }
  }, [shortcuts])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Hook para mostrar ayuda
export function useShortcutHelper(shortcuts: Shortcut[]) {
  const [isOpen, setIsOpen] = useState(false)

  const helpShortcut: Shortcut = {
    key: '?',
    shift: true,
    handler: () => setIsOpen(true),
    description: 'Mostrar atajos de teclado'
  }

  // Registrar todos los atajos, incluyendo el de ayuda
  const allShortcuts = [...shortcuts, helpShortcut]
  useKeyboardShortcuts(allShortcuts)

  return { shortcuts: allShortcuts, isOpen, setIsOpen }
}