/**
 * Select Component
 * Componente de select/dropdown reutilizable
 */

'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseSelectStyles = 'px-4 py-2.5 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none bg-white';
    const normalStyles = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
    const errorStyles = 'border-red-300 focus:border-red-500 focus:ring-red-500';
    const disabledStyles = 'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500';
    const widthStyle = fullWidth ? 'w-full' : '';

    const selectClassName = `
      ${baseSelectStyles}
      ${error ? errorStyles : normalStyles}
      ${disabledStyles}
      ${widthStyle}
      pr-10
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={selectClassName}
            disabled={disabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Icono de flecha */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;