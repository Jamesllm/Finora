/**
 * Auth Store (Zustand)
 * Maneja el estado de autenticación de la aplicación
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/database.types';
import { userRepository, settingsRepository } from '@/repositories';
import { hashPin, verifyPin, generateSalt, validatePinFormat, validateUsername } from '@/lib/crypto';
import { seedDefaultCategories, seedDefaultSettings } from '@/db/seed';

interface AuthState {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (username: string, pin: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, pin: string) => Promise<boolean>;
  changePin: (oldPin: string, newPin: string) => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login - Autentica un usuario existente
       */
      login: async (username: string, pin: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Validar formato
          const usernameValidation = validateUsername(username);
          if (!usernameValidation.valid) {
            set({ error: usernameValidation.error, isLoading: false });
            return false;
          }

          const pinValidation = validatePinFormat(pin);
          if (!pinValidation.valid) {
            set({ error: pinValidation.error, isLoading: false });
            return false;
          }

          // Buscar usuario
          const user = await userRepository.findByUsername(username);

          if (!user) {
            set({ error: 'Usuario no encontrado', isLoading: false });
            return false;
          }

          // Verificar PIN
          const isValid = verifyPin(pin, user.pin_hash, user.salt);

          if (!isValid) {
            set({ error: 'PIN incorrecto', isLoading: false });
            return false;
          }

          // Login exitoso
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      /**
       * Logout - Cierra la sesión del usuario
       */
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Register - Registra un nuevo usuario
       */
      register: async (username: string, pin: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Validar formato del username
          const usernameValidation = validateUsername(username);
          if (!usernameValidation.valid) {
            set({ error: usernameValidation.error, isLoading: false });
            return false;
          }

          // Validar formato del PIN
          const pinValidation = validatePinFormat(pin);
          if (!pinValidation.valid) {
            set({ error: pinValidation.error, isLoading: false });
            return false;
          }

          // Verificar si el username ya existe
          const exists = await userRepository.existsByUsername(username);
          if (exists) {
            set({ error: 'El nombre de usuario ya está en uso', isLoading: false });
            return false;
          }

          // Generar salt y hash
          const salt = generateSalt();
          const pinHash = hashPin(pin, salt);

          // Crear usuario
          const user = await userRepository.create({
            username,
            pin_hash: pinHash,
            salt,
          });

          // Crear configuración por defecto
          await seedDefaultSettings(user.id);

          // Crear categorías por defecto
          await seedDefaultCategories(user.id);

          // Login automático
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al registrar usuario';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      /**
       * Change PIN - Cambia el PIN del usuario actual
       */
      changePin: async (oldPin: string, newPin: string): Promise<boolean> => {
        const { user } = get();

        if (!user) {
          set({ error: 'No hay usuario autenticado' });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          // Validar PIN antiguo
          const isValidOldPin = verifyPin(oldPin, user.pin_hash, user.salt);

          if (!isValidOldPin) {
            set({ error: 'PIN actual incorrecto', isLoading: false });
            return false;
          }

          // Validar formato del nuevo PIN
          const pinValidation = validatePinFormat(newPin);
          if (!pinValidation.valid) {
            set({ error: pinValidation.error, isLoading: false });
            return false;
          }

          // Verificar que el nuevo PIN sea diferente
          if (oldPin === newPin) {
            set({ error: 'El nuevo PIN debe ser diferente al actual', isLoading: false });
            return false;
          }

          // Generar nuevo salt y hash
          const newSalt = generateSalt();
          const newPinHash = hashPin(newPin, newSalt);

          // Actualizar en la base de datos
          const success = await userRepository.updatePin(user.id, newPinHash, newSalt);

          if (!success) {
            set({ error: 'Error al actualizar el PIN', isLoading: false });
            return false;
          }

          // Actualizar usuario en el store
          const updatedUser = await userRepository.findById(user.id);

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al cambiar el PIN';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      /**
       * Check Auth Status - Verifica si hay una sesión activa
       */
      checkAuthStatus: async (): Promise<void> => {
        const { user, isLoading } = get();

        // Si ya estamos cargando o no hay usuario, no hacer nada
        if (isLoading || !user) return;

        try {
          // No marcamos como isLoading global para no bloquear la UI innecesariamente
          // en una verificación de rutina
          const existingUser = await userRepository.findById(user.id);

          if (!existingUser) {
            console.log('🚪 Sesión caducada o usuario no encontrado');
            set({
              user: null,
              isAuthenticated: false,
            });
          } else {
            // Solo actualizar si algo cambió (username o timestamp de actualización)
            const hasChanged =
              existingUser.username !== user.username ||
              existingUser.updated_at !== user.updated_at;

            if (hasChanged) {
              set({
                user: existingUser,
                isAuthenticated: true,
              });
            }
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
        }
      },

      /**
       * Clear Error - Limpia el mensaje de error
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Set Error - Establece un mensaje de error
       */
      setError: (error: string) => {
        set({ error });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persistir user e isAuthenticated
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);