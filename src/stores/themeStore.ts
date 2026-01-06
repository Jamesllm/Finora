/**
 * stores/themeStore.ts
 * Store global para gestión de tema
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  isHydrated: boolean;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      isHydrated: false,

      // Configurar tema
      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme);
      },

      // Inicializar tema (debe llamarse en el cliente)
      initTheme: () => {
        const { theme } = get();
        applyTheme(theme);

        // Escuchar cambios en preferencia del sistema
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

          const handleChange = () => {
            const currentTheme = get().theme;
            if (currentTheme === 'system') {
              applyTheme('system');
            }
          };

          mediaQuery.addEventListener('change', handleChange);
          return () => mediaQuery.removeEventListener('change', handleChange);
        }
      },
    }),
    {
      name: 'theme-storage',
      // Solo persistir el tema seleccionado
      partialize: (state) => ({ theme: state.theme }),
      // Aplicar tema inmediatamente después de hidratar
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
          applyTheme(state.theme);
        }
      },
    }
  )
);

// Función auxiliar para aplicar el tema
function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  let resolved: ResolvedTheme = 'light';

  if (theme === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } else {
    resolved = theme;
  }

  // Remover clases anteriores
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);

  // Actualizar meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      resolved === 'dark' ? '#1F2937' : '#FFFFFF'
    );
  }

  // Actualizar el store con el tema resuelto
  useThemeStore.setState({ resolvedTheme: resolved });
}