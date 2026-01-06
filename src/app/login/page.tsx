
/**
 * Login Page
 * Página de inicio de sesión
 */

'use client';

import { useState, useEffect } from 'react';
import { useGuestOnly } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { userRepository } from '@/repositories';
import { evaluatePinStrength } from '@/lib/crypto';
import {
  Wallet,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, error, isLoading, clearError } = useGuestOnly('/dashboard');

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [hasUsers, setHasUsers] = useState(true);
  const [checkingUsers, setCheckingUsers] = useState(true);

  // Verificar si hay usuarios registrados
  useEffect(() => {
    const checkUsers = async () => {
      try {
        const exists = await userRepository.hasUsers();
        setHasUsers(exists);

        // Si no hay usuarios, ir directo a registro
        if (!exists) {
          setMode('register');
        }
      } catch (error) {
        console.error('Error checking users:', error);
      } finally {
        setCheckingUsers(false);
      }
    };

    checkUsers();
  }, []);

  // Limpiar error al cambiar de modo
  useEffect(() => {
    clearError();
    setPin('');
    setConfirmPin('');
  }, [mode, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (mode === 'register') {
      // Validar que los PINs coincidan
      if (pin !== confirmPin) {
        return; // El error se muestra en tiempo real
      }
    }

    const success = mode === 'login'
      ? await login(username, pin)
      : await register(username, pin);

    if (success) {
      router.push('/dashboard');
    }
  };

  const handlePinChange = (value: string) => {
    // Solo números
    const numericValue = value.replace(/\D/g, '');
    setPin(numericValue);
  };

  const handleConfirmPinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setConfirmPin(numericValue);
  };

  const pinStrength = mode === 'register' && pin.length > 0 ? evaluatePinStrength(pin) : null;
  const pinsMatch = mode === 'register' && confirmPin.length > 0 && pin === confirmPin;
  const pinsDontMatch = mode === 'register' && confirmPin.length > 0 && pin !== confirmPin;

  if (checkingUsers) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-500"></div>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium animate-pulse">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50 dark:bg-neutral-950">
      {/* Left Side: Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 mb-6">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {mode === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
            </h1>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              {mode === 'login'
                ? 'Ingresa tus credenciales para acceder a tus finanzas.'
                : 'Configura tu espacio seguro y offline.'}
            </p>
          </div>

          {/* Toggle Login/Register */}
          {hasUsers && (
            <div className="bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg flex">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === 'login'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === 'register'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
              >
                Registrarse
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Usuario
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                    placeholder="Ej. usuario"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* PIN */}
              <div className="space-y-1.5">
                <label htmlFor="pin" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  PIN de seguridad
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="pin"
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => handlePinChange(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
                    placeholder="••••••••"
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    maxLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                  >
                    {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* PIN Strength */}
                {pinStrength && (
                  <div className="mt-2 space-y-1">
                    <div className="flex h-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className={`transition-all duration-500 ease-out ${pinStrength.strength === 'weak' ? 'w-1/3 bg-rose-500' :
                            pinStrength.strength === 'medium' ? 'w-2/3 bg-amber-500' :
                              'w-full bg-emerald-500'
                          }`}
                      />
                    </div>
                    <p className={`text-xs font-medium ${pinStrength.strength === 'weak' ? 'text-rose-600 dark:text-rose-400' :
                        pinStrength.strength === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                          'text-emerald-600 dark:text-emerald-400'
                      }`}>
                      {pinStrength.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm PIN */}
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label htmlFor="confirmPin" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Confirmar PIN
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      id="confirmPin"
                      type={showPin ? 'text' : 'password'}
                      value={confirmPin}
                      onChange={(e) => handleConfirmPinChange(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all sm:text-sm ${pinsDontMatch ? 'border-rose-300 focus:border-rose-500' :
                          pinsMatch ? 'border-emerald-300 focus:border-emerald-500' :
                            'border-neutral-300 dark:border-neutral-700 focus:border-blue-500'
                        }`}
                      placeholder="••••••••"
                      required
                      autoComplete="new-password"
                      maxLength={8}
                    />
                    {pinsMatch && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-500 animate-in fade-in zoom-in">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  {pinsDontMatch && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      Los PINs no coinciden
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-800 dark:text-rose-200">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (mode === 'register' && pinsDontMatch)}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Footer Info */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 justify-center lg:justify-start">
              <ShieldCheck className="w-4 h-4" />
              <span>Datos encriptados y almacenados localmente.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Visual/Branding */}
      <div className="hidden lg:flex relative bg-neutral-900 items-center justify-center overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 grayscale" />

        <div className="relative z-20 max-w-lg text-center p-12">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Control total de tus finanzas, <br />
            <span className="text-blue-400">100% offline.</span>
          </h2>
          <p className="text-lg text-neutral-300 leading-relaxed">
            Sin servidores, sin tracking, sin riesgos en la nube.
            Tus datos financieros te pertenecen solo a ti y nunca salen de este dispositivo.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6 text-left">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-white">Privacidad Primero</h3>
              <p className="text-sm text-neutral-400 mt-1">Encriptación militar para todos tus registros.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-white">Rendimiento</h3>
              <p className="text-sm text-neutral-400 mt-1">Base de datos SQLite optimizada en el navegador.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}