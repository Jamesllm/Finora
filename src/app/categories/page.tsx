/**
 * Categories Page
 * Gestión de categorías
 */

'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { Button, Modal } from '@/components/ui';
import CategoryList from '@/components/categories/CategoryList';
import CategoryForm from '@/components/categories/CategoryForm';
import { categoryRepository } from '@/repositories';
import { Category, CreateCategoryDTO } from '@/types/database.types';

export default function CategoriesPage() {
    const { user } = useRequireAuth();

    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const loadCategories = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const data = await categoryRepository.findByUserId(user.id);
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, [user]);

    const handleCreate = async (data: CreateCategoryDTO) => {
        setIsSaving(true);
        try {
            await categoryRepository.create(data);
            await loadCategories();
            setModalOpen(false);
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Error al crear la categoría');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = async (data: CreateCategoryDTO) => {
        if (!editingCategory) return;

        setIsSaving(true);
        try {
            await categoryRepository.update(editingCategory.id, {
                name: data.name,
                color: data.color,
                icon: data.icon,
            });
            await loadCategories();
            setEditingCategory(null);
            setModalOpen(false);
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Error al actualizar la categoría');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            // Verificar si está en uso
            if (await categoryRepository.isInUse(id)) {
                alert('No se puede eliminar porque tiene transacciones asociadas.');
                return;
            }

            await categoryRepository.delete(id);
            await loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error al eliminar la categoría');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
    };

    if (!user) return null;

    return (
        <AppLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Categorías 🏷️
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Organiza tus transacciones
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    icon="➕"
                    onClick={() => setModalOpen(true)}
                >
                    Nueva Categoría
                </Button>
            </div>

            <CategoryList
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            >
                <CategoryForm
                    userId={user.id}
                    category={editingCategory}
                    onSubmit={editingCategory ? handleUpdate : handleCreate}
                    onCancel={handleCloseModal}
                    isLoading={isSaving}
                />
            </Modal>
        </AppLayout>
    );
}
