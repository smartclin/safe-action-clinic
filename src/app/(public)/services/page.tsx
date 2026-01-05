// app/services/page.tsx
'use client';

import {
    Baby,
    Calendar,
    ChartLine,
    CheckCircle,
    ClipboardCheck,
    FileText,
    Heart,
    Shield,
    Smartphone,
    Stethoscope,
    Syringe,
    Users,
    Zap
} from 'lucide-react';
import Link from 'next/link';

import { generateId } from '@/lib/id';

export default function ServicesPage() {
    const coreServices = [
        {
            icon: Users,
            title: 'Patient Management',
            description:
                'Complete patient profiles with growth charts, immunization records, and developmental milestones tracking.',
            features: [
                'Comprehensive patient profiles',
                'Growth and development tracking',
                'Family medical history',
                'Allergy and medication lists'
            ],
            color: 'blue'
        },
        {
            icon: Calendar,
            title: 'Appointment Scheduling',
            description: 'Smart scheduling with automated reminders, doctor availability, and real-time calendar sync.',
            features: [
                'Online appointment booking',
                'Automated SMS/email reminders',
                'Waitlist management',
                'Recurring appointments'
            ],
            color: 'purple'
        },
        {
            icon: FileText,
            title: 'Electronic Health Records',
            description:
                'Secure digital health records with vital signs tracking, treatment plans, and prescription management.',
            features: [
                'Complete medical history',
                'Digital prescriptions',
                'Lab results integration',
                'Progress notes'
            ],
            color: 'teal'
        }
    ];

    const pediatricSpecialties = [
        {
            icon: ChartLine,
            title: 'Growth Monitoring',
            description: 'WHO growth standards integration with percentile calculations and visual growth charts.',
            details: [
                'WHO and CDC growth charts',
                'Percentile calculations',
                'Growth velocity tracking',
                'Anomaly detection'
            ]
        },
        {
            icon: Syringe,
            title: 'Immunization Tracking',
            description: 'Automated vaccine schedules, due date alerts, and compliance reporting.',
            details: [
                'Age-based vaccine schedules',
                'Due date reminders',
                'Vaccine inventory management',
                'State reporting compliance'
            ]
        },
        {
            icon: Baby,
            title: 'Developmental Screening',
            description:
                'Standardized developmental assessments with milestone tracking and early intervention alerts.',
            details: [
                'Age-appropriate screenings',
                'Milestone tracking',
                'Early intervention alerts',
                'Parent education materials'
            ]
        },
        {
            icon: Heart,
            title: 'Pediatric Dosing',
            description: 'Weight-based medication calculations and safety checks for pediatric prescriptions.',
            details: ['Weight-based dosing', 'Drug interaction checks', 'Age-appropriate formulations', 'Safety alerts']
        }
    ];

    const platformFeatures = [
        {
            icon: Shield,
            title: 'HIPAA Compliance',
            description: 'Full compliance with healthcare privacy regulations and data protection standards.'
        },
        {
            icon: Smartphone,
            title: 'Mobile Accessibility',
            description: 'Fully responsive platform accessible on any device, including tablets and smartphones.'
        },
        {
            icon: ClipboardCheck,
            title: 'Quality Reporting',
            description: 'Built-in quality measures and reporting for healthcare accreditation and improvement.'
        },
        {
            icon: Zap,
            title: 'Real-time Updates',
            description: 'Instant updates and notifications for appointment changes and important alerts.'
        }
    ];

    const pricingTiers = [
        {
            name: 'Basic',
            description: 'For small pediatric practices',
            price: '$99',
            period: '/month',
            features: [
                'Up to 500 patients',
                'Basic EHR functionality',
                'Appointment scheduling',
                'Email support',
                'Standard security'
            ],
            highlighted: false
        },
        {
            name: 'Professional',
            description: 'For growing pediatric clinics',
            price: '$199',
            period: '/month',
            features: [
                'Up to 2,000 patients',
                'Advanced EHR features',
                'Growth monitoring',
                'Immunization tracking',
                'Priority support',
                'HIPAA compliance'
            ],
            highlighted: true
        },
        {
            name: 'Enterprise',
            description: 'For large pediatric organizations',
            price: 'Custom',
            period: '',
            features: [
                'Unlimited patients',
                'All features included',
                'Custom integrations',
                'Dedicated support',
                'Training & onboarding',
                'Custom reporting'
            ],
            highlighted: false
        }
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, string> = {
            blue: 'from-blue-500 to-blue-600',
            purple: 'from-purple-500 to-purple-600',
            teal: 'from-teal-500 to-teal-600',
            emerald: 'from-emerald-500 to-emerald-600',
            amber: 'from-amber-500 to-amber-600',
            rose: 'from-rose-500 to-rose-600'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className='min-h-screen'>
            {/* Hero Section */}
            <section className='relative overflow-hidden bg-linear-to-b from-blue-50 to-white py-24'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-4xl text-center'>
                        <div className='mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-700'>
                            <Stethoscope className='h-4 w-4' />
                            Pediatric Healthcare Solutions
                        </div>
                        <h1 className='mb-6 font-bold text-4xl text-gray-900 md:text-5xl lg:text-6xl'>
                            Comprehensive <span className='text-blue-600'>Services</span>
                        </h1>
                        <p className='mx-auto mb-8 text-gray-600 text-lg md:text-xl'>
                            Everything you need to manage a modern pediatric practice efficiently and effectively
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Services */}
            <section className='py-16'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-6xl'>
                        <div className='mb-12 text-center'>
                            <h2 className='mb-4 font-bold text-3xl text-gray-900'>Core Services</h2>
                            <p className='mx-auto max-w-2xl text-gray-600'>
                                Essential tools designed specifically for pediatric healthcare management
                            </p>
                        </div>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                            {coreServices.map(service => (
                                <div
                                    className='group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl'
                                    key={generateId()}
                                >
                                    <div
                                        className={`absolute inset-0 bg-linear-to-br ${getColorClasses(service.color)} opacity-5`}
                                    />
                                    <div className='relative p-8'>
                                        <div className='mb-6'>
                                            <div
                                                className={`inline-flex rounded-2xl bg-linear-to-br ${getColorClasses(service.color)} p-4`}
                                            >
                                                <service.icon className='h-8 w-8 text-white' />
                                            </div>
                                        </div>
                                        <h3 className='mb-4 font-bold text-gray-900 text-xl'>{service.title}</h3>
                                        <p className='mb-6 text-gray-600'>{service.description}</p>
                                        <ul className='space-y-2'>
                                            {service.features.map(feature => (
                                                <li
                                                    className='flex items-center gap-2'
                                                    key={generateId()}
                                                >
                                                    <div className='h-1.5 w-1.5 rounded-full bg-blue-500' />
                                                    <span className='text-gray-700'>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pediatric Specialties */}
            <section className='bg-linear-to-br from-blue-50 to-teal-50 py-16'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-6xl'>
                        <div className='mb-12 text-center'>
                            <div className='inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm'>
                                <Baby className='h-4 w-4 text-blue-600' />
                                <span className='font-medium text-blue-600'>Pediatric Specialties</span>
                            </div>
                            <h2 className='mt-4 mb-4 font-bold text-3xl text-gray-900'>Built for Pediatric Care</h2>
                            <p className='mx-auto max-w-2xl text-gray-600'>
                                Specialized features designed for the unique needs of pediatric healthcare providers
                            </p>
                        </div>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                            {pediatricSpecialties.map(specialty => (
                                <div
                                    className='rounded-2xl bg-white p-8 shadow-lg'
                                    key={generateId()}
                                >
                                    <div className='mb-6 flex items-start gap-4'>
                                        <div className='rounded-xl bg-blue-100 p-3'>
                                            <specialty.icon className='h-8 w-8 text-blue-600' />
                                        </div>
                                        <div>
                                            <h3 className='font-bold text-gray-900 text-xl'>{specialty.title}</h3>
                                            <p className='mt-2 text-gray-600'>{specialty.description}</p>
                                        </div>
                                    </div>
                                    <ul className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                                        {specialty.details.map(detail => (
                                            <li
                                                className='flex items-center gap-2'
                                                key={generateId()}
                                            >
                                                <CheckCircle className='h-4 w-4 shrink-0 text-green-500' />
                                                <span className='text-gray-600 text-sm'>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Features */}
            <section className='py-16'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-6xl'>
                        <div className='mb-12 text-center'>
                            <h2 className='mb-4 font-bold text-3xl text-gray-900'>Platform Features</h2>
                            <p className='mx-auto max-w-2xl text-gray-600'>
                                Enterprise-grade features that ensure security, accessibility, and efficiency
                            </p>
                        </div>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                            {platformFeatures.map(feature => (
                                <div
                                    className='rounded-xl bg-white p-6 text-center shadow-sm'
                                    key={generateId()}
                                >
                                    <div className='mb-4 flex justify-center'>
                                        <div className='rounded-full bg-green-100 p-3'>
                                            <feature.icon className='h-8 w-8 text-green-600' />
                                        </div>
                                    </div>
                                    <h3 className='mb-3 font-semibold text-gray-900'>{feature.title}</h3>
                                    <p className='text-gray-600 text-sm'>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className='bg-gray-50 py-16'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-6xl'>
                        <div className='mb-12 text-center'>
                            <h2 className='mb-4 font-bold text-3xl text-gray-900'>Simple, Transparent Pricing</h2>
                            <p className='mx-auto max-w-2xl text-gray-600'>
                                Choose the plan that best fits your pediatric practice needs
                            </p>
                        </div>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                            {pricingTiers.map(tier => (
                                <div
                                    className={`rounded-2xl p-8 ${tier.highlighted ? 'border-2 border-blue-500 bg-white shadow-xl' : 'border border-gray-200 bg-white'}`}
                                    key={generateId()}
                                >
                                    {tier.highlighted && (
                                        <div className='mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 font-medium text-blue-600 text-sm'>
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className='mb-2 font-bold text-2xl text-gray-900'>{tier.name}</h3>
                                    <p className='mb-6 text-gray-600'>{tier.description}</p>
                                    <div className='mb-6'>
                                        <span className='font-bold text-4xl text-gray-900'>{tier.price}</span>
                                        <span className='text-gray-600'>{tier.period}</span>
                                    </div>
                                    <ul className='mb-8 space-y-3'>
                                        {tier.features.map(feature => (
                                            <li
                                                className='flex items-center gap-3'
                                                key={generateId()}
                                            >
                                                <div className='h-2 w-2 rounded-full bg-blue-500' />
                                                <span className='text-gray-700'>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        className={`block rounded-lg px-6 py-3 text-center font-medium ${tier.highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                                        href={tier.name === 'Enterprise' ? '/contact' : '/sign-up'}
                                    >
                                        {tier.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className='mt-12 text-center'>
                            <p className='text-gray-600'>
                                All plans include a 30-day free trial. No credit card required.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-16'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-4xl rounded-2xl bg-linear-to-r from-blue-600 to-teal-600 p-8 text-center'>
                        <h2 className='mb-4 font-bold text-3xl text-white'>Ready to Transform Your Practice?</h2>
                        <p className='mx-auto mb-8 max-w-2xl text-blue-100'>
                            Join hundreds of pediatric clinics already improving their efficiency and patient care
                        </p>
                        <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
                            <Link
                                className='inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-blue-600 hover:bg-blue-50'
                                href='/sign-up'
                            >
                                Start Free Trial
                            </Link>
                            <Link
                                className='inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 font-medium text-white hover:bg-white/10'
                                href='/contact'
                            >
                                Schedule Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
