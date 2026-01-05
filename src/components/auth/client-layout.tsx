// components/auth/client-layout.tsx
'use client';

import { Toaster } from 'sonner';

import { SessionProvider } from '@/components/providers/session-provider';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <SessionProvider>
            {children}
            <Toaster
                closeButton
                expand={false}
                position='top-center'
                richColors
                toastOptions={{
                    duration: 4000,
                    className: 'font-sans'
                }}
            />
        </SessionProvider>
    );
}
