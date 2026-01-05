import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { HeroSection } from '@/components/landing/hero-section';
import { getSession } from '@/lib/auth/server';
import { getRole } from '@/utils/roles';

type Role = 'admin' | 'doctor' | 'staff' | 'patient';

async function LandingPageContent() {
    try {
        const session = await getSession();
        const userId = session?.user.id;
        const role = await getRole();

        if (userId && role) redirect(`/${role}` as Route);

        return (
            <HeroSection
                role={role as Role}
                userId={userId}
            />
        );
    } catch (error) {
        console.error('Failed to fetch session:', error);
        // Fallback to unauthenticated state
        return <HeroSection />;
    }
}

export default function Home() {
    return (
        <Suspense fallback={<HeroSection />}>
            <LandingPageContent />
        </Suspense>
    );
}
