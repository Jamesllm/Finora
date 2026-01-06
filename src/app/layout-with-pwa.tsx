/**
 * Root Layout con PWA
 * Layout principal con metadatos PWA
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import PWAProvider from '@/components/pwa/PWAProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Metadatos para SEO y PWA
export const metadata: Metadata = {
    title: 'Finanzas Offline - Gestión Financiera Personal',
    description: 'Aplicación de finanzas personales 100% offline con SQLite en el navegador. Gestiona tus ingresos, gastos y presupuestos sin conexión.',
    applicationName: 'Finanzas Offline',
    authors: [{ name: 'Finanzas Offline Team' }],
    keywords: ['finanzas', 'offline', 'presupuesto', 'gastos', 'ingresos', 'SQLite', 'PWA'],
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Finanzas Offline',
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: 'website',
        siteName: 'Finanzas Offline',
        title: 'Finanzas Offline - Gestión Financiera Personal',
        description: 'Aplicación de finanzas personales 100% offline',
    },
    twitter: {
        card: 'summary',
        title: 'Finanzas Offline',
        description: 'Aplicación de finanzas personales 100% offline',
    },
};

// Configuración del viewport
export const viewport: Viewport = {
    themeColor: '#3B82F6',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <head>
                {/* PWA Meta Tags */}
                <link rel="manifest" href="/manifest.json" />

                {/* Apple Touch Icons */}
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-192x192.png" />

                {/* Apple Web App */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Finanzas Offline" />

                {/* Microsoft */}
                <meta name="msapplication-TileColor" content="#3B82F6" />
                <meta name="msapplication-tap-highlight" content="no" />
            </head>
            <body className={inter.className}>
                <PWAProvider>
                    {children}
                </PWAProvider>
            </body>
        </html>
    );
}