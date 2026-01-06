/**
 * Card Component
 * Componente de tarjeta reutilizable con variantes
 */

'use client';

import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  children: ReactNode;
}

export default function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-lg transition-colors';

  const variants = {
    default: 'bg-white dark:bg-neutral-900 shadow dark:shadow-neutral-900/50',
    bordered: 'bg-white dark:bg-neutral-900 border-2 border-gray-200 dark:border-neutral-800',
    elevated: 'bg-white dark:bg-neutral-900 shadow-lg dark:shadow-neutral-900/50',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow dark:shadow-neutral-900/50',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hoverStyles = hoverable ? 'hover:shadow-xl dark:hover:shadow-neutral-900/80 transition-shadow duration-200 cursor-pointer' : '';

  const combinedClassName = `
    ${baseStyles}
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}

/**
 * CardHeader - Encabezado de tarjeta
 */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, icon, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex items-start gap-3 flex-1">
        {icon && (
          <div className="flex-shrink-0 text-gray-700 dark:text-neutral-300">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * CardBody - Cuerpo de tarjeta
 */
interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`text-gray-700 dark:text-neutral-200 ${className}`}>
      {children}
    </div>
  );
}

/**
 * CardFooter - Pie de tarjeta
 */
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800 ${className}`}>
      {children}
    </div>
  );
}