/**
 * components/providers/ThemeProvider.tsx
 * Provider que inicializa el tema al cargar la app
 */

'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    // Inicializar tema cuando el componente se monta
    initTheme();
  }, [initTheme]);

  return <>{children}</>;
}