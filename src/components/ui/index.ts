/**
 * UI Components Index
 * Exporta todos los componentes UI desde un solo lugar
 */

export { default as Button } from './Button';
export { default as Card, CardHeader, CardBody, CardFooter } from './Card';
export { default as Input } from './Input';
export { default as Select } from './Select';
export { default as Badge } from './Badge';
export { default as Modal, ConfirmModal } from './Modal';

/**
 * Ejemplo de uso:
 * 
 * import { Button, Card, Input, Modal } from '@/components/ui';
 * 
 * <Card>
 *   <Input label="Nombre" />
 *   <Button>Guardar</Button>
 * </Card>
 */