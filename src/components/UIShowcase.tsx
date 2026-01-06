/**
 * UIShowcase Component
 * Demostración de todos los componentes UI
 */

'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Modal, { ConfirmModal } from '@/components/ui/Modal';

export default function UIShowcase() {
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const categoryOptions = [
        { value: '1', label: '🍔 Alimentación' },
        { value: '2', label: '🚗 Transporte' },
        { value: '3', label: '🏠 Vivienda' },
        { value: '4', label: '💡 Servicios' },
    ];

    const handleLoadingDemo = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    🎨 UI Components Showcase
                </h1>
                <p className="text-gray-600">
                    Sistema de diseño completo con componentes reutilizables
                </p>
            </div>

            {/* Buttons */}
            <Card>
                <CardHeader
                    title="Buttons"
                    subtitle="Variantes de botones con diferentes estilos y tamaños"
                />
                <CardBody>
                    <div className="space-y-6">
                        {/* Variantes */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Variantes</h4>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="success">Success</Button>
                                <Button variant="danger">Danger</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="outline">Outline</Button>
                            </div>
                        </div>

                        {/* Tamaños */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Tamaños</h4>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button size="sm">Small</Button>
                                <Button size="md">Medium</Button>
                                <Button size="lg">Large</Button>
                            </div>
                        </div>

                        {/* Con íconos */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Con Íconos</h4>
                            <div className="flex flex-wrap gap-3">
                                <Button icon="➕" iconPosition="left">Agregar</Button>
                                <Button icon="💾" iconPosition="right" variant="success">Guardar</Button>
                                <Button icon="🗑️" variant="danger">Eliminar</Button>
                            </div>
                        </div>

                        {/* Estados */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Estados</h4>
                            <div className="flex flex-wrap gap-3">
                                <Button disabled>Deshabilitado</Button>
                                <Button loading={loading} onClick={handleLoadingDemo}>
                                    {loading ? 'Cargando...' : 'Cargar'}
                                </Button>
                                <Button fullWidth variant="primary">Full Width</Button>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Cards */}
            <Card>
                <CardHeader
                    title="Cards"
                    subtitle="Diferentes estilos de tarjetas"
                />
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card variant="default">
                            <CardBody>
                                <p className="font-semibold">Default Card</p>
                                <p className="text-sm text-gray-600">Con sombra estándar</p>
                            </CardBody>
                        </Card>

                        <Card variant="bordered">
                            <CardBody>
                                <p className="font-semibold">Bordered Card</p>
                                <p className="text-sm text-gray-600">Con borde</p>
                            </CardBody>
                        </Card>

                        <Card variant="elevated">
                            <CardBody>
                                <p className="font-semibold">Elevated Card</p>
                                <p className="text-sm text-gray-600">Sombra elevada</p>
                            </CardBody>
                        </Card>

                        <Card variant="gradient">
                            <CardBody>
                                <p className="font-semibold">Gradient Card</p>
                                <p className="text-sm text-gray-600">Con gradiente</p>
                            </CardBody>
                        </Card>

                        <Card hoverable variant="default">
                            <CardBody>
                                <p className="font-semibold">Hoverable Card</p>
                                <p className="text-sm text-gray-600">Hover para efecto</p>
                            </CardBody>
                        </Card>
                    </div>
                </CardBody>
            </Card>

            {/* Inputs */}
            <Card>
                <CardHeader
                    title="Inputs"
                    subtitle="Campos de entrada con validación"
                />
                <CardBody>
                    <div className="space-y-4">
                        <Input
                            label="Nombre completo"
                            placeholder="Juan Pérez"
                            helperText="Ingresa tu nombre completo"
                            fullWidth
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            }
                            fullWidth
                        />

                        <Input
                            label="Monto"
                            type="number"
                            placeholder="0.00"
                            leftIcon={<span className="text-gray-600">$</span>}
                            fullWidth
                        />

                        <Input
                            label="Campo con error"
                            placeholder="Valor incorrecto"
                            error="Este campo es requerido"
                            fullWidth
                        />

                        <Input
                            label="Campo deshabilitado"
                            placeholder="No editable"
                            disabled
                            fullWidth
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Selects */}
            <Card>
                <CardHeader
                    title="Selects"
                    subtitle="Dropdowns y selectores"
                />
                <CardBody>
                    <div className="space-y-4">
                        <Select
                            label="Categoría"
                            placeholder="Selecciona una categoría"
                            options={categoryOptions}
                            fullWidth
                        />

                        <Select
                            label="Tipo de transacción"
                            options={[
                                { value: 'income', label: '📈 Ingreso' },
                                { value: 'expense', label: '📉 Gasto' },
                            ]}
                            fullWidth
                        />

                        <Select
                            label="Select con error"
                            options={categoryOptions}
                            error="Debes seleccionar una opción"
                            fullWidth
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Badges */}
            <Card>
                <CardHeader
                    title="Badges"
                    subtitle="Etiquetas de estado"
                />
                <CardBody>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Variantes</h4>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="default">Default</Badge>
                                <Badge variant="primary">Primary</Badge>
                                <Badge variant="success">Success</Badge>
                                <Badge variant="danger">Danger</Badge>
                                <Badge variant="warning">Warning</Badge>
                                <Badge variant="info">Info</Badge>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Tamaños</h4>
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge size="sm" variant="primary">Small</Badge>
                                <Badge size="md" variant="primary">Medium</Badge>
                                <Badge size="lg" variant="primary">Large</Badge>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Uso en contexto</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Ingreso</span>
                                    <Badge variant="success">Completado</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Gasto</span>
                                    <Badge variant="danger">Pendiente</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Transferencia</span>
                                    <Badge variant="warning">En proceso</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Modals */}
            <Card>
                <CardHeader
                    title="Modals"
                    subtitle="Ventanas modales y diálogos"
                />
                <CardBody>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={() => setModalOpen(true)}>
                            Abrir Modal
                        </Button>
                        <Button variant="danger" onClick={() => setConfirmModalOpen(true)}>
                            Abrir Confirmación
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Modal Demo */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Modal de Ejemplo"
                size="md"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={() => setModalOpen(false)}>
                            Guardar
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Este es un modal de ejemplo. Puedes personalizarlo con cualquier contenido.
                    </p>

                    <Input
                        label="Nombre"
                        placeholder="Ingresa un nombre"
                        fullWidth
                    />

                    <Select
                        label="Categoría"
                        options={categoryOptions}
                        fullWidth
                    />

                    <p className="text-sm text-gray-500">
                        Presiona ESC o haz clic fuera del modal para cerrarlo.
                    </p>
                </div>
            </Modal>

            {/* Confirm Modal Demo */}
            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={() => {
                    alert('Confirmado!');
                    setConfirmModalOpen(false);
                }}
                title="¿Confirmar acción?"
                message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas continuar?"
                variant="danger"
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
            />

            {/* Card Completo */}
            <Card variant="elevated">
                <CardHeader
                    title="Ejemplo Completo"
                    subtitle="Card con header, body y footer"
                    icon={
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <span className="text-2xl">📊</span>
                        </div>
                    }
                    action={
                        <Badge variant="success">Activo</Badge>
                    }
                />
                <CardBody>
                    <p className="text-gray-600 mb-4">
                        Este es un ejemplo de card completo con todos sus elementos: header con ícono y acción,
                        body con contenido, y footer con botones.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">$5,000</p>
                            <p className="text-sm text-gray-600">Ingresos</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <p className="text-2xl font-bold text-red-600">$3,200</p>
                            <p className="text-sm text-gray-600">Gastos</p>
                        </div>
                    </div>
                </CardBody>
                <CardFooter>
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" size="sm">Ver detalles</Button>
                        <Button variant="primary" size="sm">Descargar reporte</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}