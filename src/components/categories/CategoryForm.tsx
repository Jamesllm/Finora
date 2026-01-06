/**
 * CategoryForm Component (Fixed)
 * Formulario con preview en tiempo real del color e ícono
 */

'use client';

import { useState } from 'react';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';
import { CreateCategoryDTO, Category, TransactionType } from '@/types/database.types';
import { TrendingUp } from 'lucide-react';
import { CategoryIcon, ICON_LIST } from '@/components/CategoryIcon';

interface CategoryFormProps {
    userId: number;
    category?: Category | null;
    onSubmit: (data: CreateCategoryDTO) => Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
}

const COLORS = [
    { name: 'Rojo', hex: '#EF4444' },
    { name: 'Naranja', hex: '#F97316' },
    { name: 'Ámbar', hex: '#F59E0B' },
    { name: 'Amarillo', hex: '#EAB308' },
    { name: 'Lima', hex: '#84CC16' },
    { name: 'Verde', hex: '#10B981' },
    { name: 'Esmeralda', hex: '#059669' },
    { name: 'Cyan', hex: '#06B6D4' },
    { name: 'Azul', hex: '#3B82F6' },
    { name: 'Índigo', hex: '#6366F1' },
    { name: 'Violeta', hex: '#8B5CF6' },
    { name: 'Púrpura', hex: '#A855F7' },
    { name: 'Fucsia', hex: '#D946EF' },
    { name: 'Rosa', hex: '#EC4899' },
    { name: 'Gris', hex: '#6B7280' },
];

export default function CategoryForm({
    userId,
    category,
    onSubmit,
    onCancel,
    isLoading = false,
}: CategoryFormProps) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        type: category?.type || 'expense' as TransactionType,
        color: category?.color || COLORS[0].hex,
        icon: category?.icon || ICON_LIST[0].name,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const categoryData: CreateCategoryDTO = {
            name: formData.name.trim(),
            type: formData.type,
            color: formData.color,
            icon: formData.icon,
            user_id: userId,
        };

        await onSubmit(categoryData);
    };

    return (
        <Card variant="elevated">
            <CardHeader
                title={category ? 'Editar Categoría' : 'Nueva Categoría'}
                subtitle={category ? 'Modifica los datos de la categoría' : 'Crea una nueva categoría para organizar tus finanzas'}
                icon={<CategoryIcon iconName={formData.icon} color={formData.color} />}
            />
            <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Preview en Tiempo Real */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">
                            Vista previa
                        </p>
                        <div className="flex flex-col items-center gap-3">
                            {/* Ícono con color */}
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform transition-all hover:scale-105"
                                style={{
                                    backgroundColor: formData.color + '30',
                                    border: `3px solid ${formData.color}`
                                }}
                            >
                                <CategoryIcon iconName={formData.icon} color={formData.color} className="w-10 h-10" />
                            </div>

                            {/* Nombre */}
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                    {formData.name || 'Nombre de categoría'}
                                </p>
                                <div className="flex items-center gap-2 justify-center mt-2">
                                    <div
                                        className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                                        style={{ backgroundColor: formData.color }}
                                    />
                                    <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                        {formData.color}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tipo (Solo si es nueva) */}
                    {!category && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tipo de categoría
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                                    className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${formData.type === 'income'
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 shadow-md'
                                            : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    <TrendingUp className="w-6 h-6" />
                                    <span className="font-semibold">Ingreso</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                                    className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${formData.type === 'expense'
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 shadow-md'
                                            : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    <TrendingUp className="w-6 h-6 rotate-180" />
                                    <span className="font-semibold">Gasto</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Nombre */}
                    <Input
                        label="Nombre"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Alimentación, Transporte..."
                        error={errors.name}
                        fullWidth
                        required
                    />

                    {/* Ícono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ícono
                        </label>
                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-3 border-2 border-gray-200 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-900">
                            {ICON_LIST.map((iconData) => {
                                const IconComponent = iconData.icon;
                                return (
                                    <button
                                        key={iconData.name}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, icon: iconData.name }))}
                                        className={`p-3 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-all ${formData.icon === iconData.name
                                                ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 scale-110 shadow-md'
                                                : 'hover:scale-105'
                                            }`}
                                    >
                                        <IconComponent className="w-6 h-6" style={{ color: formData.color }} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Color
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {COLORS.map((color) => (
                                <button
                                    key={color.hex}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, color: color.hex }))}
                                    className={`group flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${formData.color === color.hex
                                            ? 'border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-neutral-800 shadow-md'
                                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-lg transition-transform group-hover:scale-110 ${formData.color === color.hex ? 'ring-4 ring-offset-2 ring-gray-400 dark:ring-gray-600 scale-110' : ''
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {color.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onCancel}
                                disabled={isLoading}
                                fullWidth
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isLoading}
                            fullWidth
                        >
                            {category ? 'Actualizar Categoría' : 'Guardar Categoría'}
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}