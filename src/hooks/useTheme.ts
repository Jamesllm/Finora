// hooks/useTheme.ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      
      setTheme: (theme) => {
        set({ theme })
        
        const root = document.documentElement
        let resolved: 'light' | 'dark' = 'light'
        
        if (theme === 'system') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? 'dark' 
            : 'light'
        } else {
          resolved = theme
        }
        
        root.classList.remove('light', 'dark')
        root.classList.add(resolved)
        set({ resolvedTheme: resolved })
      }
    }),
    { name: 'theme-storage' }
  )
)