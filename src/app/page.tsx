import type { Route } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { Footer, Navbar } from '@/components/landing';
import { PediatricHero } from '@/components/landing/pediatric-hero';
import { getSession } from '@/lib/auth/server';
import { getRole } from '@/utils/roles';

type Role = 'admin' | 'doctor' | 'staff' | 'patient';

// Lazy load heavy components for better performance
const LazyFeatures = dynamic(() => import('@/components/landing/features').then(mod => ({ default: mod.Features })), {
    loading: () => <FeaturesSkeleton />
});

const LazyClinicServices = dynamic(
    () => import('@/components/landing/ClinicServices').then(mod => ({ default: mod.ClinicServices })),
    {
        loading: () => <ServicesSkeleton />
    }
);

const LazyTestimonials = dynamic(
    () => import('@/components/landing/testimonials').then(mod => ({ default: mod.Testimonials })),
    {
        loading: () => <TestimonialsSkeleton />
    }
);

const LazyCTA = dynamic(() => import('@/components/landing/cta').then(mod => ({ default: mod.CTA })), {
    loading: () => <CTASkeleton />
});

/**
 * Landing Page Content - Server Component
 *
 * Performance optimizations:
 * - Suspense boundaries for async operations
 * - Lazy loading of components
 * - Server-side session check with redirect
 */
async function LandingPageContent() {
    try {
        const session = await getSession();
        const userId = session?.user.id;
        const role = await getRole();

        // Redirect authenticated users to their dashboard
        if (userId && role) {
            redirect(`/${role.toLowerCase()}` as Route);
        }

        // Show full landing page for unauthenticated users
        return (
            <>
                <PediatricHero />
                <LazyFeatures />
                <LazyClinicServices />
                <LazyTestimonials />
                <LazyCTA />
            </>
        );
    } catch (error) {
        console.error('Failed to fetch session:', error);
        // Fallback to full landing page
        return (
            <>
                <PediatricHero />
                <LazyFeatures />
                <LazyClinicServices />
                <LazyTestimonials />
                <LazyCTA />
            </>
        );
    }
}

// Loading skeletons for better UX
function FeaturesSkeleton() {
    return (
        <section className='relative bg-white py-24 sm:py-32 dark:bg-slate-950'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='mx-auto mb-16 max-w-3xl text-center'>
                    <div className='mx-auto mb-4 h-8 w-48 animate-pulse rounded-full bg-slate-200' />
                    <div className='mb-4 h-12 w-full animate-pulse rounded-lg bg-slate-200' />
                    <div className='mx-auto h-6 w-3/4 animate-pulse rounded-lg bg-slate-200' />
                </div>
                <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            className='h-64 animate-pulse rounded-xl bg-slate-200'
                            key={i}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ServicesSkeleton() {
    return (
        <section className='relative bg-background py-24 sm:py-32'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='mx-auto mb-16 max-w-3xl text-center'>
                    <div className='mb-4 h-12 w-full animate-pulse rounded-lg bg-slate-200' />
                    <div className='mx-auto h-6 w-3/4 animate-pulse rounded-lg bg-slate-200' />
                </div>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            className='h-48 animate-pulse rounded-2xl bg-slate-200'
                            key={i}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSkeleton() {
    return (
        <section className='relative bg-sky-50/50 py-24 sm:py-32 dark:bg-sky-950/20'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='mx-auto mb-16 max-w-3xl text-center'>
                    <div className='mx-auto mb-4 h-8 w-48 animate-pulse rounded-full bg-slate-200' />
                    <div className='mb-4 h-12 w-full animate-pulse rounded-lg bg-slate-200' />
                </div>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            className='h-64 animate-pulse rounded-2xl bg-white dark:bg-slate-900'
                            key={i}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASkeleton() {
    return (
        <section className='relative overflow-hidden bg-sky-50 py-24 sm:py-32 dark:bg-slate-950'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='mx-auto max-w-4xl text-center'>
                    <div className='mx-auto mb-8 h-8 w-64 animate-pulse rounded-full bg-slate-200' />
                    <div className='mb-6 h-16 w-full animate-pulse rounded-lg bg-slate-200' />
                    <div className='mx-auto mb-10 h-6 w-3/4 animate-pulse rounded-lg bg-slate-200' />
                    <div className='flex justify-center gap-4'>
                        <div className='h-12 w-48 animate-pulse rounded-lg bg-slate-200' />
                        <div className='h-12 w-48 animate-pulse rounded-lg bg-slate-200' />
                    </div>
                </div>
            </div>
        </section>
    );
}

/**
 * Landing Page - Optimized for Performance
 *
 * Features:
 * - Colorful pediatric-friendly design
 * - Suspense boundaries for non-blocking renders
 * - Server-side authentication check
 * - Lazy-loaded components
 */
export default function Home() {
    return (
        <div className='relative min-h-screen overflow-hidden'>
            {/* Colorful Animated Background - Pediatric Theme */}
            <div className='fixed inset-0 -z-10'>
                {/* Base gradient - soft pastels for pediatric clinic */}
                <div className='absolute inset-0 bg-gradient-to-br from-sky-50 via-pink-50 to-emerald-50 dark:from-sky-950 dark:via-pink-950 dark:to-emerald-950' />

                {/* Animated colorful orbs */}
                <div className='absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-300/20 blur-[120px] dark:bg-pink-500/10' />
                <div className='absolute top-1/3 right-1/4 h-96 w-96 animate-pulse rounded-full bg-sky-300/20 blur-[120px] delay-700 dark:bg-sky-500/10' />
                <div className='absolute bottom-1/4 left-1/3 h-96 w-96 animate-pulse rounded-full bg-emerald-300/20 blur-[120px] delay-1000 dark:bg-emerald-500/10' />
                <div className='absolute top-1/2 right-0 h-80 w-80 animate-pulse rounded-full bg-amber-300/15 blur-[100px] delay-500 dark:bg-amber-500/10' />
                <div className='absolute bottom-0 left-0 h-80 w-80 animate-pulse rounded-full bg-purple-300/15 blur-[100px] delay-300 dark:bg-purple-500/10' />

                {/* Decorative shapes - child-friendly */}
                <div className='absolute top-20 right-20 h-32 w-32 rounded-full bg-yellow-200/10 blur-2xl dark:bg-yellow-400/5' />
                <div className='absolute bottom-20 left-20 h-40 w-40 rounded-full bg-cyan-200/10 blur-2xl dark:bg-cyan-400/5' />

                {/* Subtle pattern overlay */}
                <div
                    className='absolute inset-0 opacity-[0.02] dark:opacity-[0.03]'
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Content */}
            <div className='relative z-10'>
                <Navbar />
                <main>
                    <Suspense
                        fallback={
                            <div className='flex min-h-screen items-center justify-center'>
                                <div className='flex flex-col items-center gap-4'>
                                    <div className='h-12 w-12 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600' />
                                    <p className='text-slate-600 text-sm dark:text-slate-400'>Loading...</p>
                                </div>
                            </div>
                        }
                    >
                        <LandingPageContent />
                    </Suspense>
                </main>
                <Footer />
            </div>
        </div>
    );
}
