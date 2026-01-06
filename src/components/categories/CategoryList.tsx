/**
 * CategoryList Component (Fixed)
 * Lista de categorías con preview de color corregido
 */

'use client';

import { useState } from 'react';
import { Card, CardHeader, CardBody, Badge, Button } from '@/components/ui';
import { Category, TransactionType } from '@/types/database.types';
import { ConfirmModal } from '@/components/ui/Modal';
import { useCurrency } from '@/hooks/useCurrency';
import { TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react';
import { CategoryIcon } from '@/components/CategoryIcon';

interface CategoryListProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => Promise<void>;
    isLoading?: boolean;
}

export default function CategoryList({
    categories,
    onEdit,
    onDelete,
    isLoading = false,
}: CategoryListProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const { formatAmount } = useCurrency();

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId === null) return;

        setDeleting(true);
        try {
            await onDelete(selectedId);
            setDeleteModalOpen(false);
            setSelectedId(null);
        } catch (error) {
            console.error('Error deleting category:', error);
        } finally {
            setDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando categorías...</p>
            </div>
        );
    }

    const renderCategoryGroup = (type: TransactionType, title: string, icon: string) => {
        const filtered = categories.filter(c => c.type === type);

        if (filtered.length === 0) {
            return (
                <Card variant="elevated" className="mb-6">
                    <CardHeader
                        title={title}
                        icon={type === 'income' ?
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" /> :
                            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        }
                    />
                    <CardBody>
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                            No hay categorías registradas
                        </p>
                    </CardBody>
                </Card>
            );
        }

        return (
            <Card variant="elevated" className="mb-6">
                <CardHeader
                    title={title}
                    subtitle={`${filtered.length} categorías`}
                    icon={type === 'income' ?
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" /> :
                        <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                    }
                />
                <CardBody className="space-y-2">
                    {filtered.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg group hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all"
                        >
                            {/* Lado izquierdo: Ícono, nombre, color */}
                            <div className="flex items-center gap-4 flex-1">
                                {/* Ícono con color de fondo */}
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                                    style={{
                                        backgroundColor: category.color + '20',
                                        border: `2px solid ${category.color}40`
                                    }}
                                >
                                    <CategoryIcon iconName={category.icon} color={category.color} className="w-6 h-6" />
                                </div>

                                {/* Información */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                                            {category.name}
                                        </p>
                                        {category.is_default === 1 && (
                                            <Badge variant="default" size="sm">
                                                Por defecto
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Preview del color */}
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                            {category.color}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Lado derecho: Botones de acción */}
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onEdit(category)}
                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <Edit2 className="w-4 h-4 mr-1" /> Editar
                                </Button>
                                {category.is_default !== 1 && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => handleDeleteClick(category.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </CardBody>
            </Card>
        );
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderCategoryGroup('income', 'Ingresos', '')}
                {renderCategoryGroup('expense', 'Gastos', '')}
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="¿Eliminar categoría?"
                message="Si eliminas esta categoría, las transacciones asociadas podrían quedar sin categoría. ¿Estás seguro?"
                variant="danger"
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                isLoading={deleting}
            />
        </>
    );
}