// app/layout.tsx - IMPROVED
import type { Metadata } from 'next';
import { Suspense } from 'react';
import '../styles/globals.css';

import { ClientLayout } from '@/components/auth/client-layout';
import { ErrorBoundary } from '@/components/error-boundry';
import { LoadingFallback } from '@/components/layout-skeleton';
import { geistMono, geistSans } from '@/styles/fonts';

export const metadata: Metadata = {
    title: {
        default: 'Smart Clinic',
        template: '%s | Smart Clinic'
    },
    description: 'Modern pediatric healthcare platform',
    keywords: ['healthcare', 'pediatric', 'medical', 'clinic'],
    authors: [{ name: 'Smart Clinic' }],
    robots: {
        index: true,
        follow: true
    },
    openGraph: {
        type: 'website',
        title: 'Smart Clinic',
        description: 'Modern pediatric healthcare platform',
        siteName: 'Smart Clinic'
    }
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            className={`${geistSans.variable} ${geistMono.variable}`}
            data-scroll-behavior='smooth'
            lang='en'
            suppressHydrationWarning
        >
            <body className='antialiased'>
                <ErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                        <ClientLayout>{children}</ClientLayout>
                    </Suspense>
                </ErrorBoundary>
            </body>
        </html>
    );
}
