/**
 * UpdateNotification Component
 * Notifica cuando hay una nueva versión disponible
 */

'use client';

import { useState, useEffect } from 'react';
import { Button, Card, CardBody } from '@/components/ui';

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Escuchar cambios en el service worker
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Detectar si hay un nuevo SW esperando
        if (reg.waiting) {
          setShowUpdate(true);
        }

        // Escuchar nuevas instalaciones
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            });
          }
        });
      });

      // Escuchar mensajes del SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setShowUpdate(true);
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (!registration || !registration.waiting) return;

    // Enviar mensaje al SW para que se active
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Recargar la página
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-top duration-300">
      <Card variant="elevated">
        <CardBody>
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
              <span className="text-3xl">🔄</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">
                Nueva versión disponible
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Hay una actualización lista para instalar. Recarga la página para obtener la última versión.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUpdate}
                  fullWidth
                >
                  Actualizar ahora
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                >
                  Después
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}