/**
 * UserProfile Component
 * Información del perfil del usuario
 */

'use client';

import { Card, CardHeader, CardBody, Badge } from '@/components/ui';
import { User } from '@/types/database.types';

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const accountAge = () => {
    const created = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'año' : 'años'}`;
    }
  };

  return (
    <Card variant="gradient">
      <CardHeader
        title="Perfil de Usuario"
        subtitle="Información de tu cuenta"
        icon={
          <div className="bg-white p-2 rounded-lg">
            <span className="text-2xl">👤</span>
          </div>
        }
      />
      <CardBody>
        {/* Avatar y nombre */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-3xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{user.username}</h3>
            <Badge variant="success" size="md">
              ✓ Cuenta Activa
            </Badge>
          </div>
        </div>

        {/* Información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/50 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">ID de Usuario</p>
            <p className="font-mono font-semibold text-gray-800">#{user.id}</p>
          </div>

          <div className="bg-white/50 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Tiempo en la plataforma</p>
            <p className="font-semibold text-gray-800">{accountAge()}</p>
          </div>

          <div className="bg-white/50 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Cuenta creada</p>
            <p className="font-semibold text-gray-800 text-sm">
              {formatDate(user.created_at)}
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Última actualización</p>
            <p className="font-semibold text-gray-800 text-sm">
              {formatDate(user.updated_at)}
            </p>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 bg-white/30 backdrop-blur rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Seguridad</h4>
              <p className="text-sm text-gray-700">
                Tu PIN está protegido con encriptación PBKDF2 (10,000 iteraciones).
                Nunca se almacena en texto plano.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white/30 backdrop-blur rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💾</span>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Almacenamiento</h4>
              <p className="text-sm text-gray-700">
                Todos tus datos se almacenan localmente en tu navegador usando IndexedDB.
                No se envía ninguna información a servidores externos.
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}