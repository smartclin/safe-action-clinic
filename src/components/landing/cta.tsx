'use client';

import { ArrowRight, Calendar, Check, Clock, Heart, Shield } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const benefits = [
    '24/7 Pediatric Support',
    'Same-Day Appointments',
    'Video Consultations',
    'Digital Health Records',
    'Vaccination Reminders',
    'HIPAA Compliant'
];

export function CTA() {
    return (
        <section className='relative overflow-hidden bg-sky-50 py-24 sm:py-32 dark:bg-slate-950'>
            {/* Background Effects */}
            <div className='absolute inset-0'>
                {/* Gradient Background */}
                <div className='absolute inset-0 bg-linear-to-b from-sky-400/5 via-transparent to-transparent' />

                {/* Gradient Orbs */}
                <div className='absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[128px]' />
                <div className='absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-[100px]' />
                <div className='absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-blue-400/10 blur-[100px]' />

                {/* Decorative Icons */}
                <div className='absolute top-10 right-10 opacity-10'>
                    <Heart className='h-24 w-24 text-pink-400' />
                </div>
                <div className='absolute bottom-10 left-10 opacity-10'>
                    <Shield className='h-24 w-24 text-sky-400' />
                </div>
            </div>

            <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='mx-auto max-w-4xl text-center'>
                    {/* Badge */}
                    <div className='mb-8 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-1.5 font-medium text-sky-700 text-sm backdrop-blur-sm dark:border-sky-800 dark:bg-slate-900/80 dark:text-sky-300'>
                        <span className='relative flex h-2 w-2'>
                            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75' />
                            <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
                        </span>
                        Welcoming New Patients
                    </div>

                    {/* Headline */}
                    <h2 className='font-bold text-3xl text-slate-800 tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl dark:text-white'>
                        Ready for{' '}
                        <span className='bg-linear-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-emerald-400'>
                            Peace of Mind?
                        </span>
                    </h2>

                    {/* Subheadline */}
                    <p className='mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300'>
                        Join hundreds of families who trust Dr. Hazem and the Smart Clinic team with their children's
                        health. Experience compassionate care combined with modern technology.
                    </p>

                    {/* Benefits Grid */}
                    <div className='mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3'>
                        {benefits.map(benefit => (
                            <div
                                className='flex items-center gap-2 rounded-lg bg-white/50 p-3 text-slate-700 text-sm backdrop-blur-sm dark:bg-slate-900/50 dark:text-slate-300'
                                key={benefit}
                            >
                                <div className='shrink-0'>
                                    {benefit.includes('Support') && <Clock className='h-4 w-4 text-sky-500' />}
                                    {benefit.includes('Appointments') && (
                                        <Calendar className='h-4 w-4 text-emerald-500' />
                                    )}
                                    {benefit.includes('Video') && <ArrowRight className='h-4 w-4 text-blue-500' />}
                                    {benefit.includes('Records') && <Check className='h-4 w-4 text-purple-500' />}
                                    {benefit.includes('Reminders') && <Heart className='h-4 w-4 text-pink-500' />}
                                    {benefit.includes('HIPAA') && <Shield className='h-4 w-4 text-amber-500' />}
                                </div>
                                <span className='text-left'>{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats Banner */}
                    <div className='mx-auto mt-12 max-w-3xl rounded-2xl border border-sky-100 bg-linear-to-r from-sky-50 to-emerald-50 p-6 dark:border-sky-800 dark:from-sky-900/30 dark:to-emerald-900/30'>
                        <div className='grid grid-cols-3 gap-6'>
                            <div className='text-center'>
                                <p className='font-bold text-3xl text-sky-800 dark:text-sky-300'>99%</p>
                                <p className='text-slate-600 text-sm dark:text-slate-400'>Parent Satisfaction</p>
                            </div>
                            <div className='text-center'>
                                <p className='font-bold text-3xl text-emerald-800 dark:text-emerald-300'>15min</p>
                                <p className='text-slate-600 text-sm dark:text-slate-400'>Avg. Wait Time</p>
                            </div>
                            <div className='text-center'>
                                <p className='font-bold text-3xl text-blue-800 dark:text-blue-300'>1,000+</p>
                                <p className='text-slate-600 text-sm dark:text-slate-400'>Happy Families</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className='mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                        <Button
                            asChild
                            className='w-full border-0 bg-linear-to-r from-sky-500 to-emerald-500 text-base text-white shadow-lg shadow-sky-400/25 hover:from-sky-600 hover:to-emerald-600 sm:w-auto'
                            size='lg'
                        >
                            <Link href='/register'>
                                <Calendar className='mr-2 h-5 w-5' />
                                Book Appointment
                                <ArrowRight className='ml-2 h-4 w-4' />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            className='w-full border-sky-200 text-base text-sky-700 hover:bg-sky-50 sm:w-auto dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-900/50'
                            size='lg'
                            variant='outline'
                        >
                            <Link href='#testimonials'>
                                <Heart className='mr-2 h-5 w-5' />
                                Hear from Parents
                            </Link>
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className='mt-8 flex flex-col items-center justify-center gap-4 text-sm sm:flex-row'>
                        <div className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                            <Shield className='h-4 w-4 text-emerald-500' />
                            <span>HIPAA Compliant & Secure</span>
                        </div>
                        <div className='hidden text-slate-400 sm:block'>•</div>
                        <div className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                            <Check className='h-4 w-4 text-sky-500' />
                            <span>Most Insurances Accepted</span>
                        </div>
                        <div className='hidden text-slate-400 sm:block'>•</div>
                        <div className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                            <Clock className='h-4 w-4 text-amber-500' />
                            <span>Same-Day Appointments</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
