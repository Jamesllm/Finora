/**
 * ChangePinForm Component
 * Formulario para cambiar el PIN del usuario
 */

'use client';

import { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { evaluatePinStrength, validatePinFormat } from '@/lib/crypto';

export default function ChangePinForm() {
  const { changePin } = useAuth();

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const pinStrength = newPin.length > 0 ? evaluatePinStrength(newPin) : null;
  const pinsMatch = confirmPin.length > 0 && newPin === confirmPin;
  const pinsDontMatch = confirmPin.length > 0 && newPin !== confirmPin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validar PIN antiguo
    const oldPinValidation = validatePinFormat(oldPin);
    if (!oldPinValidation.valid) {
      setError(oldPinValidation.error || 'PIN actual inválido');
      return;
    }

    // Validar nuevo PIN
    const newPinValidation = validatePinFormat(newPin);
    if (!newPinValidation.valid) {
      setError(newPinValidation.error || 'Nuevo PIN inválido');
      return;
    }

    // Verificar que coincidan
    if (newPin !== confirmPin) {
      setError('Los PINs no coinciden');
      return;
    }

    // Verificar que sean diferentes
    if (oldPin === newPin) {
      setError('El nuevo PIN debe ser diferente al actual');
      return;
    }

    setIsLoading(true);

    try {
      const result = await changePin(oldPin, newPin);

      if (result) {
        setSuccess(true);
        setOldPin('');
        setNewPin('');
        setConfirmPin('');
        
        // Limpiar éxito después de 3 segundos
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      // El error ya está en el store
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader
        title="Cambiar PIN"
        subtitle="Actualiza tu PIN de acceso"
        icon={
          <div className="bg-blue-100 p-2 rounded-lg">
            <span className="text-2xl">🔐</span>
          </div>
        }
      />
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PIN Actual */}
          <Input
            label="PIN Actual"
            type={showPins ? 'text' : 'password'}
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            maxLength={8}
            fullWidth
            required
          />

          {/* Nuevo PIN */}
          <Input
            label="Nuevo PIN"
            type={showPins ? 'text' : 'password'}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            maxLength={8}
            fullWidth
            required
          />

          {/* Indicador de fortaleza */}
          {pinStrength && (
            <div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      pinStrength.strength === 'weak'
                        ? 'bg-red-500 w-1/3'
                        : pinStrength.strength === 'medium'
                        ? 'bg-yellow-500 w-2/3'
                        : 'bg-green-500 w-full'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    pinStrength.strength === 'weak'
                      ? 'text-red-600'
                      : pinStrength.strength === 'medium'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                >
                  {pinStrength.message}
                </span>
              </div>
            </div>
          )}

          {/* Confirmar PIN */}
          <Input
            label="Confirmar Nuevo PIN"
            type={showPins ? 'text' : 'password'}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            maxLength={8}
            error={pinsDontMatch ? 'Los PINs no coinciden' : ''}
            fullWidth
            required
          />

          {pinsMatch && (
            <p className="text-green-600 text-sm">✓ Los PINs coinciden</p>
          )}

          {/* Mostrar/Ocultar */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPins"
              checked={showPins}
              onChange={(e) => setShowPins(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="showPins" className="text-sm text-gray-700">
              Mostrar PINs
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">✓ PIN actualizado exitosamente</p>
            </div>
          )}

          {/* Botón */}
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading || pinsDontMatch}
            fullWidth
          >
            Cambiar PIN
          </Button>
        </form>

        {/* Consejos */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">💡 Consejos de seguridad</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Usa un PIN de al menos 6 dígitos</li>
            <li>• Evita patrones obvios (1234, 0000, etc.)</li>
            <li>• No uses fechas de nacimiento</li>
            <li>• Cambia tu PIN periódicamente</li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}