/**
 * tailwind.config.js
 * Configuración de Tailwind con dark mode
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class', // Importante: usar 'class' para dark mode manual
    theme: {
        extend: {
            colors: {
                // Colores personalizados para dark mode
                dark: {
                    bg: '#1F2937',
                    card: '#374151',
                    border: '#4B5563',
                },
                // Primary (Azul fintech)
                primary: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    900: '#1e3a8a',
                },
                // Success (Verde)
                success: {
                    50: '#f0fdf4',
                    500: '#22c55e',
                    600: '#16a34a',
                },
                // Danger (Rojo)
                danger: {
                    50: '#fef2f2',
                    500: '#ef4444',
                    600: '#dc2626',
                },
                // Neutral (Gris)
                neutral: {
                    50: '#fafafa',
                    100: '#f4f4f5',
                    800: '#27272a',
                    900: '#18181b',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
};