import type { Route } from 'next';
import { redirect } from 'next/navigation';
import type React from 'react';

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { requireAuth } from '@/lib/auth/server';

/**
 * Protected Layout - Server Component
 *
 * This layout:
 * 1. Requires authentication (redirects to /login if not authenticated)
 * 2. Provides shared UI (Sidebar + Navbar) for all protected routes
 * 3. Fetches session once at layout level (not in each page)
 *
 * All routes under (protected) group inherit this authentication check.
 */
const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
    // Require authentication - redirects to /login if not authenticated
    const session = await requireAuth();

    // Session is guaranteed to exist here
    if (!session) {
        redirect('/login' as Route);
    }

    return (
        <div className='flex h-screen w-full bg-gray-200'>
            <div className='w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]'>
                <Sidebar />
            </div>

            <div className='flex w-[86%] flex-col bg-[#F7F8FA] md:w-[92%] lg:w-[84%] xl:w-[86%]'>
                <Navbar />

                <div className='h-full w-full overflow-y-scroll p-2'>{children}</div>
            </div>
        </div>
    );
};

export default ProtectedLayout;
