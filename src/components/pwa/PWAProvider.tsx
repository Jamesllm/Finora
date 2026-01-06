/**
 * PWAProvider Component
 * Inicializa el Service Worker y componentes PWA
 */

'use client';

import { useEffect } from 'react';
import InstallPrompt from './InstallPrompt';
import UpdateNotification from './UpdateNotification';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Registrar Service Worker
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[PWA] Service Worker registered:', registration.scope);

          // Verificar actualizaciones cada hora
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });

      // Detectar cuando el SW está listo
      navigator.serviceWorker.ready.then((registration) => {
        console.log('[PWA] Service Worker ready');
      });
    } else {
      console.warn('[PWA] Service Workers not supported');
    }

    // Detectar cambios en la conexión
    const handleOnline = () => {
      console.log('[PWA] Connection restored');
      // Podrías mostrar una notificación aquí
    };

    const handleOffline = () => {
      console.log('[PWA] Connection lost');
      // Podrías mostrar una notificación aquí
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {children}
      <InstallPrompt />
      <UpdateNotification />
    </>
  );
}