'use client';

import { domAnimation, LazyMotion, motion } from 'framer-motion';
import type { Route } from 'next';
import Link from 'next/link';

import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';

type Role = 'admin' | 'doctor' | 'staff' | 'patient';

interface HeroSectionProps {
    userId?: string;
    role?: Role;
}

/**
 * Maps user roles to dashboard routes.
 * Keeps routing logic centralized and type-safe.
 */
const DASHBOARD_BY_ROLE: Record<Role, string> = {
    admin: '/admin',
    doctor: '/doctor',
    staff: '/staff',
    patient: '/patient'
};

export function HeroSection({ userId, role }: HeroSectionProps) {
    const dashboardHref = userId && role ? (DASHBOARD_BY_ROLE[role] ?? '/dashboard') : null;

    return (
        <LazyMotion features={domAnimation}>
            <main className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6'>
                <section
                    aria-labelledby='hero-title'
                    className='flex max-w-3xl flex-1 flex-col items-center justify-center text-center'
                >
                    <motion.h1
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-6 font-extrabold text-4xl text-gray-900 leading-tight md:text-5xl'
                        id='hero-title'
                        initial={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        Welcome to <br />
                        <span className='text-5xl text-blue-700 md:text-6xl'>Smart Clinic</span>
                    </motion.h1>

                    <motion.p
                        animate={{ opacity: 1 }}
                        className='mb-8 text-gray-700 text-lg md:text-xl'
                        initial={{ opacity: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        A complete Pediatric Clinic Management System to handle appointments, immunizations, growth
                        tracking, and prescriptions — effortlessly.
                    </motion.p>

                    <div className='flex flex-wrap justify-center gap-4'>
                        {dashboardHref ? (
                            <Link href={dashboardHref as Route}>
                                <Button size='lg'>View Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href='/register'>
                                    <Button size='lg'>New Patient</Button>
                                </Link>

                                <Link href='/login'>
                                    <Button
                                        size='lg'
                                        variant='outline'
                                    >
                                        Login
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </section>

                <Footer />
            </main>
        </LazyMotion>
    );
}
