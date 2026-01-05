'use client';

import {
    Baby,
    Bell,
    Calendar,
    Clock,
    FileText,
    Heart,
    MessageSquare,
    Shield,
    Smartphone,
    Stethoscope,
    Users,
    Video
} from 'lucide-react';
import { useId } from 'react';

interface Feature {
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
}

const features: Feature[] = [
    {
        name: 'Easy Appointment Booking',
        description:
            'Schedule well-child visits, vaccinations, or sick appointments in seconds. Choose your preferred date, time, and doctor.',
        icon: <Calendar className='h-6 w-6' />,
        color: 'text-sky-600 dark:text-sky-400',
        gradient: 'from-sky-400 to-blue-400'
    },
    {
        name: 'Virtual Video Consultations',
        description:
            'Get expert pediatric advice from Dr. Hazem from the comfort of your home. Perfect for follow-ups and minor concerns.',
        icon: <Video className='h-6 w-6' />,
        color: 'text-emerald-600 dark:text-emerald-400',
        gradient: 'from-emerald-400 to-green-400'
    },
    {
        name: 'Digital Health Records',
        description:
            "Access your child's complete medical history, growth charts, vaccination records, and lab results anytime, anywhere.",
        icon: <FileText className='h-6 w-6' />,
        color: 'text-violet-600 dark:text-violet-400',
        gradient: 'from-violet-400 to-purple-400'
    },
    {
        name: 'Vaccination Tracker',
        description:
            "Never miss a vaccine. Get automatic reminders for upcoming vaccinations based on your child's age and schedule.",
        icon: <Shield className='h-6 w-6' />,
        color: 'text-amber-600 dark:text-amber-400',
        gradient: 'from-amber-400 to-orange-400'
    },
    {
        name: '24/7 Symptom Checker',
        description:
            "Worried about your child's symptoms? Use our AI-powered symptom checker for instant guidance and when to seek care.",
        icon: <Stethoscope className='h-6 w-6' />,
        color: 'text-rose-600 dark:text-rose-400',
        gradient: 'from-rose-400 to-pink-400'
    },
    {
        name: 'Secure Messaging',
        description:
            'Send secure messages directly to Dr. Hazem and the care team. Get responses within business hours for non-urgent questions.',
        icon: <MessageSquare className='h-6 w-6' />,
        color: 'text-indigo-600 dark:text-indigo-400',
        gradient: 'from-indigo-400 to-blue-400'
    },
    {
        name: 'Growth & Milestone Tracking',
        description:
            "Monitor your child's development with interactive growth charts and milestone trackers compared to pediatric standards.",
        icon: <Baby className='h-6 w-6' />,
        color: 'text-pink-600 dark:text-pink-400',
        gradient: 'from-pink-400 to-rose-400'
    },
    {
        name: 'Medication Reminders',
        description:
            'Set up custom medication schedules with push notifications to ensure your child never misses a dose.',
        icon: <Bell className='h-6 w-6' />,
        color: 'text-teal-600 dark:text-teal-400',
        gradient: 'from-teal-400 to-emerald-400'
    },
    {
        name: 'Family Account Management',
        description:
            'Manage appointments, records, and communications for all your children from one convenient family dashboard.',
        icon: <Users className='h-6 w-6' />,
        color: 'text-cyan-600 dark:text-cyan-400',
        gradient: 'from-cyan-400 to-sky-400'
    }
];

export function Features() {
    return (
        <section
            className='relative bg-white py-24 sm:py-32 dark:bg-slate-950'
            id='features'
        >
            {/* Background Elements */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-40 right-0 h-80 w-80 rounded-full bg-sky-400/10 blur-[96px]' />
                <div className='absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-[96px]' />
            </div>

            <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                {/* Section Header */}
                <div className='mx-auto mb-16 max-w-3xl text-center sm:mb-20'>
                    <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sky-700 dark:bg-sky-900 dark:text-sky-300'>
                        <Heart className='h-4 w-4' />
                        <span className='font-medium text-sm'>Designed for Parents</span>
                    </div>
                    <h2 className='font-bold text-3xl text-slate-900 tracking-tight sm:text-4xl lg:text-5xl dark:text-white'>
                        Everything You Need for{' '}
                        <span className='bg-linear-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-emerald-400'>
                            Your Child's Health
                        </span>
                    </h2>
                    <p className='mt-4 text-lg text-slate-600 dark:text-slate-300'>
                        Smart Clinic combines compassionate pediatric care with cutting-edge technology to give you
                        peace of mind and your child the best care possible.
                    </p>
                </div>

                {/* Features Grid */}
                <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                    {features.map((feature, index) => (
                        <div
                            className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-sky-200 hover:shadow-sky-100/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800 dark:hover:shadow-sky-900/20'
                            key={feature.name}
                            style={{
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            {/* Background Gradient */}
                            <div
                                className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
                            />

                            {/* Icon Container */}
                            <div className='relative mb-4'>
                                <div
                                    className={`inline-flex items-center justify-center rounded-xl bg-linear-to-br ${feature.gradient} p-3 text-white`}
                                >
                                    {feature.icon}
                                </div>
                            </div>

                            {/* Feature Content */}
                            <h3 className={`mb-3 font-semibold text-lg ${feature.color}`}>{feature.name}</h3>
                            <p className='text-slate-600 text-sm leading-relaxed dark:text-slate-300'>
                                {feature.description}
                            </p>

                            {/* Hover Effect Indicator */}
                            <div className='absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-sky-500 to-emerald-500 transition-all duration-300 group-hover:w-full' />
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className='mt-20 text-center'>
                    <div className='mx-auto max-w-2xl'>
                        <h3 className='font-bold text-2xl text-slate-900 dark:text-white'>
                            Ready to Experience Modern Pediatric Care?
                        </h3>
                        <p className='mt-3 text-slate-600 dark:text-slate-300'>
                            Download our app today and join hundreds of families who trust Dr. Hazem with their
                            children's health.
                        </p>
                        <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                            <button
                                className='inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-sky-500 to-emerald-500 px-6 py-3 font-medium text-white shadow-lg shadow-sky-400/25 transition-all hover:shadow-sky-400/30 hover:shadow-xl'
                                type='button'
                            >
                                <Smartphone className='h-5 w-5' />
                                Download App
                            </button>
                            <button
                                className='inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-6 py-3 font-medium text-sky-700 transition-all hover:border-sky-300 hover:bg-sky-50 dark:border-sky-800 dark:bg-slate-900 dark:text-sky-300 dark:hover:bg-sky-900/20'
                                type='button'
                            >
                                <Clock className='h-5 w-5' />
                                Book First Appointment
                            </button>
                        </div>
                        <p className='mt-4 text-slate-500 text-xs dark:text-slate-400'>
                            Available on iOS and Android. First consultation free for new patients.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Optional: Feature highlight component for key features
export function FeatureHighlight() {
    const highlightFeatures = [
        {
            title: 'Secure & Private',
            description: 'HIPAA compliant with bank-level encryption',
            icon: <Shield className='h-8 w-8' />
        },
        {
            title: 'Real-time Updates',
            description: 'Instant notifications for appointments and results',
            icon: <Bell className='h-8 w-8' />
        },
        {
            title: 'Expert Care',
            description: 'Board-certified pediatricians like Dr. Hazem',
            icon: <Stethoscope className='h-8 w-8' />
        }
    ];
    const ID = useId();
    return (
        <div className='mt-20 rounded-2xl bg-linear-to-r from-sky-50 to-emerald-50 p-8 dark:from-sky-950/50 dark:to-emerald-950/50'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                {highlightFeatures.map(feature => (
                    <div
                        className='flex items-start gap-4'
                        key={ID}
                    >
                        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-emerald-500 text-white'>
                            {feature.icon}
                        </div>
                        <div>
                            <h4 className='font-semibold text-slate-900 dark:text-white'>{feature.title}</h4>
                            <p className='mt-1 text-slate-600 text-sm dark:text-slate-300'>{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
