/**
 * Offline Page
 * Página que se muestra cuando no hay conexión
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from '@/components/ui';

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Verificar estado inicial
    setIsOnline(navigator.onLine);

    // Escuchar cambios en la conexión
    const handleOnline = () => {
      setIsOnline(true);
      // Intentar volver a la página anterior después de 1 segundo
      setTimeout(() => {
        router.back();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [router]);

  const handleRetry = () => {
    if (navigator.onLine) {
      router.back();
    } else {
      alert('Todavía no hay conexión. Por favor, verifica tu conexión a internet.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card variant="elevated" className="max-w-md w-full">
        <CardBody className="text-center py-12">
          {/* Estado offline */}
          {!isOnline && (
            <>
              <div className="text-6xl mb-6 animate-bounce">📡</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                Sin conexión
              </h1>
              <p className="text-gray-600 mb-6">
                No hay conexión a internet. Pero no te preocupes, la aplicación funciona 100% offline
                y todos tus datos están guardados localmente.
              </p>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={handleRetry}
                  fullWidth
                  icon="🔄"
                >
                  Reintentar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                  fullWidth
                >
                  Ir al Dashboard
                </Button>
              </div>

              {/* Info adicional */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-blue-900 text-sm mb-2">
                  💡 ¿Sabías que?
                </h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Todos tus datos están en tu dispositivo</li>
                  <li>• La app funciona sin internet</li>
                  <li>• Puedes crear y ver transacciones offline</li>
                  <li>• No se pierde ningún dato</li>
                </ul>
              </div>
            </>
          )}

          {/* Estado online */}
          {isOnline && (
            <>
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                ¡Conexión restaurada!
              </h1>
              <p className="text-gray-600 mb-6">
                Tu conexión a internet se ha restablecido. Redirigiendo...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}