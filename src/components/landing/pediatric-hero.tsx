'use client';

import { ArrowRight, Baby, Calendar, Heart, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * Pediatric Hero Section - Optimized for Performance
 *
 * Features:
 * - Colorful, child-friendly design
 * - Lazy-loaded animations
 * - Accessible and SEO-friendly
 */
export function PediatricHero() {
    return (
        <section className='relative flex min-h-screen items-center justify-center overflow-hidden pt-16'>
            {/* Colorful Animated Background */}
            <div className='absolute inset-0 overflow-hidden'>
                {/* Large gradient orbs - pediatric colors */}
                <div className='absolute top-1/4 -left-32 h-[500px] w-[500px] animate-pulse rounded-full bg-pink-300/20 blur-[150px] dark:bg-pink-500/10' />
                <div className='absolute top-1/3 -right-32 h-[500px] w-[500px] animate-pulse rounded-full bg-sky-300/20 blur-[150px] delay-700 dark:bg-sky-500/10' />
                <div className='absolute bottom-1/4 left-1/3 h-[400px] w-[400px] animate-pulse rounded-full bg-emerald-300/20 blur-[120px] delay-1000 dark:bg-emerald-500/10' />
                <div className='absolute top-1/2 right-1/4 h-[350px] w-[350px] animate-pulse rounded-full bg-amber-300/15 blur-[100px] delay-500 dark:bg-amber-500/10' />
                <div className='absolute bottom-0 left-0 h-[300px] w-[300px] animate-pulse rounded-full bg-purple-300/15 blur-[100px] delay-300 dark:bg-purple-500/10' />

                {/* Decorative sparkles */}
                <div className='absolute top-20 right-20 opacity-20'>
                    <Sparkles className='h-16 w-16 animate-pulse text-yellow-400' />
                </div>
                <div className='absolute bottom-20 left-20 opacity-20'>
                    <Heart className='h-20 w-20 animate-pulse text-pink-400 delay-500' />
                </div>
            </div>

            {/* Content */}
            <div className='relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32'>
                <div className='flex flex-col items-center text-center'>
                    {/* Badge */}
                    <div className='fade-in slide-in-from-bottom-4 mb-8 animate-in duration-700'>
                        <div className='inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 font-medium text-sky-700 text-sm shadow-sm backdrop-blur-sm dark:border-sky-800 dark:bg-slate-900/80 dark:text-sky-300'>
                            <Shield className='h-4 w-4' />
                            <span className='relative flex h-2 w-2'>
                                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                                <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
                            </span>
                            Clinic Management System
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className='fade-in slide-in-from-bottom-4 max-w-5xl animate-in font-extrabold text-4xl tracking-tight delay-100 duration-700 sm:text-5xl lg:text-6xl xl:text-7xl'>
                        <span className='block text-slate-900 dark:text-white'>Your Complete </span>
                        <span className='relative block'>
                            <span className='relative z-10 bg-linear-to-r from-sky-500 via-emerald-500 to-pink-500 bg-clip-text text-transparent dark:from-sky-400 dark:via-emerald-400 dark:to-pink-400'>
                                Pediatric Clinic Portal
                            </span>
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className='fade-in slide-in-from-bottom-4 mt-6 max-w-3xl animate-in text-lg text-slate-600 delay-200 duration-700 sm:text-xl dark:text-slate-300'>
                        Manage your clinic with ease. Access patient records, schedule appointments, track
                        immunizations, monitor growth charts, and handle billing — all in one integrated system designed
                        for pediatric care.
                    </p>

                    {/* CTA Buttons - Doctor Portal as Primary */}
                    <div className='fade-in slide-in-from-bottom-4 mt-10 flex animate-in flex-col items-center gap-4 delay-300 duration-700 sm:flex-row'>
                        <Button
                            asChild
                            className='w-full border-0 bg-linear-to-r from-sky-500 via-emerald-500 to-pink-500 text-base text-white shadow-lg shadow-sky-400/25 hover:from-sky-600 hover:via-emerald-600 hover:to-pink-600 sm:w-auto'
                            size='lg'
                        >
                            <Link href='/login'>
                                <Shield className='mr-2 h-5 w-5' />
                                Doctor Portal
                                <ArrowRight className='ml-2 h-4 w-4' />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className='w-full border-sky-200 bg-white/80 text-base text-sky-700 hover:bg-sky-50 sm:w-auto dark:border-sky-800 dark:bg-slate-900/80 dark:text-sky-300 dark:hover:bg-slate-800'
                            size='lg'
                            variant='outline'
                        >
                            <Link href='/register'>
                                <Baby className='mr-2 h-5 w-5' />
                                Patient Registration
                            </Link>
                        </Button>
                    </div>

                    {/* Feature Pills */}
                    <div className='fade-in slide-in-from-bottom-4 mt-16 grid animate-in grid-cols-1 gap-4 delay-500 duration-700 sm:grid-cols-3 sm:gap-6'>
                        <FeaturePill
                            icon={<Shield className='h-4 w-4 text-sky-500' />}
                            text='Secure & HIPAA Compliant'
                        />
                        <FeaturePill
                            icon={<Calendar className='h-4 w-4 text-emerald-500' />}
                            text='Appointment Management'
                        />
                        <FeaturePill
                            icon={<Heart className='h-4 w-4 text-pink-500' />}
                            text='Patient Records'
                        />
                    </div>

                    {/* Trust Indicators */}
                    <div className='fade-in slide-in-from-bottom-4 mt-12 flex animate-in flex-wrap items-center justify-center gap-6 text-slate-600 text-sm delay-700 duration-700 dark:text-slate-400'>
                        <div className='flex items-center gap-2'>
                            <Shield className='h-4 w-4 text-emerald-500' />
                            <span>Local & Secure</span>
                        </div>
                        <div className='hidden text-slate-400 sm:block'>•</div>
                        <div className='flex items-center gap-2'>
                            <Calendar className='h-4 w-4 text-sky-500' />
                            <span>Complete Clinic Management</span>
                        </div>
                        <div className='hidden text-slate-400 sm:block'>•</div>
                        <div className='flex items-center gap-2'>
                            <Heart className='h-4 w-4 text-pink-500' />
                            <span>All-in-One System</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className='flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-white/80 px-4 py-2.5 text-slate-700 text-sm shadow-sm backdrop-blur-sm dark:border-pink-800 dark:bg-slate-900/80 dark:text-slate-300'>
            <span>{icon}</span>
            <span className='font-medium'>{text}</span>
        </div>
    );
}
