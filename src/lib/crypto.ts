/**
 * Crypto Library
 * Funciones de encriptación y hashing para autenticación local
 */

import CryptoJS from 'crypto-js';

/**
 * Genera un salt aleatorio
 */
export const generateSalt = (): string => {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
};

/**
 * Hashea un PIN con PBKDF2
 * @param pin - PIN a hashear
 * @param salt - Salt para el hash
 * @param iterations - Número de iteraciones (mayor = más seguro pero más lento)
 */
export const hashPin = (pin: string, salt: string, iterations: number = 10000): string => {
  const hash = CryptoJS.PBKDF2(pin, salt, {
    keySize: 256 / 32,
    iterations,
  });
  return hash.toString();
};

/**
 * Verifica si un PIN coincide con el hash
 */
export const verifyPin = (pin: string, hash: string, salt: string, iterations: number = 10000): boolean => {
  const pinHash = hashPin(pin, salt, iterations);
  return pinHash === hash;
};

/**
 * Valida el formato de un PIN
 * @param pin - PIN a validar
 * @param minLength - Longitud mínima (default: 4)
 * @param maxLength - Longitud máxima (default: 8)
 */
export const validatePinFormat = (
  pin: string,
  minLength: number = 4,
  maxLength: number = 8
): { valid: boolean; error?: string } => {
  if (!pin || pin.trim().length === 0) {
    return { valid: false, error: 'El PIN no puede estar vacío' };
  }

  if (pin.length < minLength) {
    return { valid: false, error: `El PIN debe tener al menos ${minLength} caracteres` };
  }

  if (pin.length > maxLength) {
    return { valid: false, error: `El PIN no puede tener más de ${maxLength} caracteres` };
  }

  // Solo números
  if (!/^\d+$/.test(pin)) {
    return { valid: false, error: 'El PIN solo puede contener números' };
  }

  return { valid: true };
};

/**
 * Valida el formato de un username
 */
export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'El nombre de usuario no puede estar vacío' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'El nombre de usuario no puede tener más de 20 caracteres' };
  }

  // Solo letras, números y guión bajo
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'El nombre de usuario solo puede contener letras, números y guión bajo' };
  }

  return { valid: true };
};

/**
 * Evalúa la fortaleza de un PIN
 */
export const evaluatePinStrength = (pin: string): {
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} => {
  if (pin.length < 4) {
    return { strength: 'weak', message: 'PIN muy corto' };
  }

  if (pin.length === 4) {
    return { strength: 'weak', message: 'PIN débil - usa más dígitos' };
  }

  // Verificar patrones comunes débiles
  const weakPatterns = ['1234', '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999'];
  if (weakPatterns.some((pattern) => pin.includes(pattern))) {
    return { strength: 'weak', message: 'PIN débil - evita patrones obvios' };
  }

  // Verificar secuencias
  const isSequence = (str: string) => {
    for (let i = 0; i < str.length - 1; i++) {
      if (Math.abs(parseInt(str[i]) - parseInt(str[i + 1])) !== 1) {
        return false;
      }
    }
    return true;
  };

  if (isSequence(pin)) {
    return { strength: 'weak', message: 'PIN débil - evita secuencias' };
  }

  // Verificar si todos los dígitos son iguales
  const allSame = pin.split('').every((char) => char === pin[0]);
  if (allSame) {
    return { strength: 'weak', message: 'PIN débil - usa diferentes dígitos' };
  }

  if (pin.length >= 6) {
    return { strength: 'strong', message: 'PIN fuerte' };
  }

  return { strength: 'medium', message: 'PIN medio - considera usar 6+ dígitos' };
};

/**
 * Encripta datos sensibles (opcional)
 */
export const encryptData = (data: string, password: string): string => {
  return CryptoJS.AES.encrypt(data, password).toString();
};

/**
 * Desencripta datos (opcional)
 */
export const decryptData = (encryptedData: string, password: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, password);
  return bytes.toString(CryptoJS.enc.Utf8);
};