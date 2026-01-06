/**
 * useAuth Hook
 * Hook personalizado para manejar autenticación
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';

interface UseAuthOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: string;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const { redirectTo, redirectIfAuthenticated } = options;
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    changePin,
    checkAuthStatus,
    clearError,
    setError,
  } = useAuthStore();

  // Verificar estado de autenticación al montar
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (redirectTo && !isAuthenticated && !isLoading) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (redirectIfAuthenticated && isAuthenticated && !isLoading) {
      router.push(redirectIfAuthenticated);
    }
  }, [isAuthenticated, isLoading, redirectIfAuthenticated, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    changePin,
    clearError,
    setError,
  };
};

/**
 * Hook para proteger rutas (require auth)
 */
export const useRequireAuth = (redirectTo: string = '/login') => {
  return useAuth({ redirectTo });
};

/**
 * Hook para rutas públicas (redirect si ya está autenticado)
 */
export const useGuestOnly = (redirectTo: string = '/') => {
  return useAuth({ redirectIfAuthenticated: redirectTo });
};