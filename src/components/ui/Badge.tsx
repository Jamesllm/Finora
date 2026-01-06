/**
 * Badge Component
 * Componente de badge/etiqueta reutilizable
 */

'use client';

import { ReactNode, HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'primary';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

export default function Badge({
    variant = 'default',
    size = 'md',
    className = '',
    children,
    ...props
}: BadgeProps) {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full';

    const variants = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-blue-100 text-blue-800',
        primary: 'bg-indigo-100 text-indigo-800',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    const combinedClassName = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <span className={combinedClassName} {...props}>
            {children}
        </span>
    );
}