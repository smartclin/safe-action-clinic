'use client';

import { Baby, Calendar, Heart, Phone, Shield, Stethoscope } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Icons } from '../icons';

interface FooterLink {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

const footerLinks: Record<string, FooterSection> = {
    services: {
        title: 'Our Services',
        links: [
            { label: 'Well-child Visits', href: '#', icon: <Baby className='h-3 w-3' /> },
            { label: 'Vaccinations', href: '#', icon: <Shield className='h-3 w-3' /> },
            { label: 'Sick Visits', href: '#', icon: <Stethoscope className='h-3 w-3' /> },
            { label: 'Video Consultations', href: '#', icon: <Phone className='h-3 w-3' /> },
            { label: '24/7 Support', href: '#', icon: <Heart className='h-3 w-3' /> }
        ]
    },
    resources: {
        title: 'Parent Resources',
        links: [
            { label: 'Health Tips', href: '#' },
            { label: 'Growth Charts', href: '#' },
            { label: 'Vaccination Schedule', href: '#' },
            { label: 'Emergency Guide', href: '#' }
        ]
    },
    clinic: {
        title: 'Our Clinic',
        links: [
            { label: 'Meet Dr. Hazem', href: '#' },
            { label: 'Our Team', href: '#' },
            { label: 'Facility Tour', href: '#' },
            { label: 'Insurance Info', href: '#' }
        ]
    },
    contact: {
        title: 'Contact Info',
        links: [
            { label: '📞 (555) 123-4567', href: 'tel:5551234567' },
            { label: '📧 hello@smartclinic.com', href: 'mailto:hello@smartclinic.com' },
            { label: '📍 123 Pediatric St, Health City', href: '#' },
            { label: '⏰ Mon-Fri: 8AM-6PM', href: '#' }
        ]
    }
};

interface SocialLink {
    label: string;
    href: string;
    // Change from LucideIcon to a generic React Component type
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

const socialLinks: SocialLink[] = [
    {
        label: 'Facebook',
        href: 'https://facebook.com',
        icon: Icons.facebook,
        color: 'hover:text-blue-600'
    },
    {
        label: 'Instagram',
        href: 'https://instagram.com',
        icon: Icons.instagram,
        color: 'hover:text-pink-600'
    }
];

export function Footer() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    if (!year) return null;

    return (
        <footer className='relative border-sky-100 border-t bg-white dark:border-sky-900 dark:bg-slate-950'>
            {/* Decorative elements */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-24 left-1/4 h-48 w-48 rounded-full bg-sky-400/5 blur-[96px]' />
            </div>

            <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                {/* Main Footer */}
                <div className='py-12 lg:py-16'>
                    <div className='grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5'>
                        {/* Brand Column */}
                        <div className='col-span-2 mb-8 md:col-span-4 lg:col-span-1 lg:mb-0'>
                            <Link
                                className='group flex items-center gap-3'
                                href='/'
                            >
                                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-400/25'>
                                    <Heart className='h-5 w-5' />
                                </div>
                                <div>
                                    <span className='font-bold text-sky-800 text-xl tracking-tight dark:text-sky-300'>
                                        Smart Clinic
                                    </span>
                                    <p className='text-muted-foreground text-xs'>by Dr. Hazem</p>
                                </div>
                            </Link>
                            <p className='mt-4 max-w-xs text-slate-600 text-sm dark:text-slate-300'>
                                Providing compassionate, expert pediatric care for your little ones. Where every child's
                                health journey begins with care and innovation.
                            </p>

                            {/* Quick Appointment CTA */}
                            <div className='mt-6'>
                                <Link
                                    className='inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-sky-500 to-emerald-500 px-4 py-2 font-medium text-sm text-white shadow-md shadow-sky-400/25 transition-all hover:shadow-lg hover:shadow-sky-400/30'
                                    href='#'
                                >
                                    <Calendar className='h-4 w-4' />
                                    Book Appointment
                                </Link>
                            </div>

                            {/* Social Links */}
                            <div className='mt-6 flex items-center gap-4'>
                                {socialLinks.map(social => {
                                    const Icon = social.icon;
                                    return (
                                        <Link
                                            aria-label={social.label}
                                            className={`text-slate-400 transition-colors ${social.color} dark:text-slate-400`}
                                            href={social.href as Route}
                                            key={social.label}
                                            rel='noopener noreferrer'
                                            target='_blank'
                                        >
                                            <Icon className='h-5 w-5' />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Link Columns */}
                        {Object.values(footerLinks).map(section => (
                            <div key={section.title}>
                                <h3 className='mb-4 font-semibold text-sky-800 text-sm dark:text-sky-300'>
                                    {section.title}
                                </h3>
                                <ul className='space-y-3'>
                                    {section.links.map(link => (
                                        <li
                                            className='group'
                                            key={link.label}
                                        >
                                            <Link
                                                className='flex items-start gap-2 text-slate-600 text-sm transition-all hover:translate-x-1 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400'
                                                href={link.href as Route}
                                            >
                                                {link.icon && <span className='mt-0.5 text-sky-500'>{link.icon}</span>}
                                                <span>{link.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Banner */}
                <div className='mb-8 rounded-xl bg-linear-to-r from-rose-50 to-pink-50 p-4 text-center dark:from-rose-950/30 dark:to-pink-950/30'>
                    <div className='flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4'>
                        <div className='flex items-center gap-2'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/50'>
                                <Phone className='h-4 w-4 text-rose-600 dark:text-rose-400' />
                            </div>
                            <p className='font-medium text-rose-800 dark:text-rose-300'>Emergency?</p>
                        </div>
                        <p className='text-rose-700 text-sm dark:text-rose-200'>
                            Call our 24/7 emergency line:{' '}
                            <a
                                className='font-bold underline'
                                href='tel:5559114567'
                            >
                                (555) 911-4567
                            </a>
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className='flex flex-col items-center justify-between gap-4 border-sky-100 border-t py-6 sm:flex-row dark:border-sky-900'>
                    <p className='text-slate-500 text-sm'>© {year} Smart Clinic by Dr. Hazem. All rights reserved.</p>
                    <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-6'>
                        <Link
                            className='text-slate-500 text-sm transition-colors hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400'
                            href='#'
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            className='text-slate-500 text-sm transition-colors hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400'
                            href='#'
                        >
                            Terms of Service
                        </Link>
                        <Link
                            className='text-slate-500 text-sm transition-colors hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400'
                            href='#'
                        >
                            HIPAA Compliance
                        </Link>
                        <div className='flex items-center gap-2'>
                            <Shield className='h-4 w-4 text-emerald-500' />
                            <span className='font-medium text-emerald-600 text-sm dark:text-emerald-400'>
                                HIPAA Compliant
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
