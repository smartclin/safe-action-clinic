'use client';

import dynamic from 'next/dynamic';

function Skeleton({ className }: { className: string }) {
    return (
        <div
            aria-hidden
            className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`}
        />
    );
}
function SectionSkeleton({
    cards,
    cardHeight = 'h-64',
    bg = 'bg-white dark:bg-slate-950'
}: {
    cards: number;
    cardHeight?: string;
    bg?: string;
}) {
    const items = Array.from({ length: cards }, (_, n) => `skeleton-${cards}-${n}`);

    return (
        <section className={`py-24 sm:py-32 ${bg}`}>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='mx-auto mb-16 max-w-3xl text-center'>
                    <Skeleton className='mx-auto mb-4 h-8 w-48' />
                    <Skeleton className='mb-4 h-12 w-full' />
                    <Skeleton className='mx-auto h-6 w-3/4' />
                </div>

                <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                    {items.map(key => (
                        <Skeleton
                            className={`${cardHeight} rounded-xl`}
                            key={key}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

const FeaturesSkeleton = () => <SectionSkeleton cards={6} />;
const ServicesSkeleton = () => (
    <SectionSkeleton
        bg='bg-background'
        cardHeight='h-48'
        cards={5}
    />
);
const TestimonialsSkeleton = () => (
    <SectionSkeleton
        bg='bg-sky-50/50 dark:bg-sky-950/20'
        cards={6}
    />
);

function CTASkeleton() {
    return (
        <section className='bg-sky-50 py-24 sm:py-32 dark:bg-slate-950'>
            <div className='mx-auto max-w-4xl text-center'>
                <Skeleton className='mx-auto mb-8 h-8 w-64' />
                <Skeleton className='mb-6 h-16 w-full' />
                <Skeleton className='mx-auto mb-10 h-6 w-3/4' />
                <div className='flex justify-center gap-4'>
                    <Skeleton className='h-12 w-48' />
                    <Skeleton className='h-12 w-48' />
                </div>
            </div>
        </section>
    );
}

export function AnimatedBackground() {
    return (
        <div className='fixed inset-0 -z-10'>
            <div className='absolute inset-0 bg-linear-to-br from-sky-50 via-pink-50 to-emerald-50 dark:from-sky-950 dark:via-pink-950 dark:to-emerald-950' />
        </div>
    );
}

export function LoadingFallback() {
    return (
        <div className='flex min-h-screen items-center justify-center'>
            <div className='flex flex-col items-center gap-4'>
                <div className='h-12 w-12 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600' />
                <p className='text-slate-600 text-sm dark:text-slate-400'>Loading...</p>
            </div>
        </div>
    );
}
// Optimize dynamic imports with proper loading states
const Features = dynamic(() => import('@/components/landing/features').then(m => m.Features), {
    loading: () => <FeaturesSkeleton />,
    ssr: false // Only load on client if it's heavy
});

const ClinicServices = dynamic(() => import('@/components/landing/ClinicServices').then(m => m.ClinicServices), {
    loading: () => <ServicesSkeleton />
});

const Testimonials = dynamic(() => import('@/components/landing/testimonials').then(m => m.Testimonials), {
    loading: () => <TestimonialsSkeleton />
});

const CTA = dynamic(() => import('@/components/landing/cta').then(m => m.CTA), {
    loading: () => <CTASkeleton />
});

export function LandingPageContent() {
    return (
        <>
            <Features />
            <ClinicServices />
            <Testimonials />
            <CTA />
        </>
    );
}
