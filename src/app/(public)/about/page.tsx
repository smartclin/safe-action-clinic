// app/about/page.tsx
'use client';

import { CheckCircle, Heart, Target, Users } from 'lucide-react';
import Link from 'next/link';

import { generateId } from '@/lib/id';

export default function AboutPage() {
    const team = [
        {
            name: 'Dr. Sarah Johnson',
            role: 'Chief Medical Officer',
            bio: 'Board-certified pediatrician with 15+ years of clinical experience',
            image: '/team/sarah.jpg',
            specialty: 'Pediatric Medicine'
        },
        {
            name: 'Michael Chen',
            role: 'Lead Developer',
            bio: 'Healthcare tech specialist with expertise in medical software development',
            image: '/team/michael.jpg',
            specialty: 'Health Informatics'
        },
        {
            name: 'Dr. Maria Rodriguez',
            role: 'Clinical Advisor',
            bio: 'Pediatric specialist focused on growth and development monitoring',
            image: '/team/maria.jpg',
            specialty: 'Child Development'
        },
        {
            name: 'Alex Thompson',
            role: 'Product Manager',
            bio: 'Healthcare IT expert with focus on user experience in medical settings',
            image: '/team/alex.jpg',
            specialty: 'Healthcare Technology'
        }
    ];

    const values = [
        {
            icon: Heart,
            title: 'Patient-Centered Care',
            description: 'Every feature is designed with the pediatric patient and their family in mind'
        },
        {
            icon: Target,
            title: 'Clinical Excellence',
            description: 'Built by healthcare professionals for healthcare professionals'
        },
        {
            icon: Users,
            title: 'Collaboration',
            description: 'Facilitating better communication between providers, patients, and families'
        },
        {
            icon: CheckCircle,
            title: 'Innovation',
            description: 'Continuous improvement through technology and best practices'
        }
    ];

    return (
        <div className='min-h-screen'>
            {/* Hero Section */}
            <section className='relative overflow-hidden bg-linear-to-b from-blue-50 to-white py-24'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-4xl text-center'>
                        <h1 className='mb-6 font-bold text-4xl text-gray-900 md:text-5xl lg:text-6xl'>
                            About <span className='text-blue-600'>PediatricCare</span>
                        </h1>
                        <p className='mx-auto mb-8 text-gray-600 text-lg md:text-xl'>
                            Revolutionizing pediatric healthcare management through innovative technology solutions
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className='py-16'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-6xl'>
                        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
                            <div>
                                <h2 className='mb-6 font-bold text-3xl text-gray-900'>Our Mission</h2>
                                <p className='mb-6 text-gray-600'>
                                    To empower pediatric healthcare providers with comprehensive, intuitive tools that
                                    enhance patient care, streamline clinic operations, and improve health outcomes for
                                    children everywhere.
                                </p>
                                <p className='mb-8 text-gray-600'>
                                    Founded in 2020 by a team of pediatricians and healthcare technologists,
                                    PediatricCare was born from a simple observation: pediatric practices needed better
                                    tools specifically designed for their unique workflows and patient populations.
                                </p>
                                <div className='space-y-4'>
                                    <div className='flex items-start gap-3'>
                                        <CheckCircle className='mt-1 h-5 w-5 shrink-0 text-green-500' />
                                        <div>
                                            <h3 className='font-semibold text-gray-900'>Specialized for Pediatrics</h3>
                                            <p className='text-gray-600'>
                                                Features tailored specifically for child healthcare
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-start gap-3'>
                                        <CheckCircle className='mt-1 h-5 w-5 shrink-0 text-green-500' />
                                        <div>
                                            <h3 className='font-semibold text-gray-900'>HIPAA Compliant</h3>
                                            <p className='text-gray-600'>
                                                Enterprise-grade security for patient data protection
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-start gap-3'>
                                        <CheckCircle className='mt-1 h-5 w-5 shrink-0 text-green-500' />
                                        <div>
                                            <h3 className='font-semibold text-gray-900'>Evidence-Based</h3>
                                            <p className='text-gray-600'>
                                                Built on clinical guidelines and best practices
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='relative'>
                                <div className='rounded-2xl bg-linear-to-br from-blue-100 to-teal-100 p-8'>
                                    <div className='mb-6'>
                                        <div className='inline-flex rounded-lg bg-white p-3'>
                                            <Target className='h-8 w-8 text-blue-600' />
                                        </div>
                                    </div>
                                    <h3 className='mb-4 font-bold text-2xl text-gray-900'>Our Vision</h3>
                                    <p className='text-gray-700'>
                                        We envision a future where every pediatric provider has access to tools that
                                        make excellent care delivery effortless, where data informs better decisions,
                                        and where technology enhances rather than hinders the patient-provider
                                        relationship.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className='bg-gray-50 py-16'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-6xl text-center'>
                        <h2 className='mb-12 font-bold text-3xl text-gray-900'>Our Core Values</h2>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                            {values.map(value => (
                                <div
                                    className='text-center'
                                    key={value.title}
                                >
                                    <div className='mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600'>
                                        <value.icon className='h-8 w-8' />
                                    </div>
                                    <h3 className='mb-2 font-bold text-lg'>{value.title}</h3>
                                    <p className='text-gray-600'>{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className='py-16'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-4xl text-center'>
                        <h2 className='mb-12 font-bold text-3xl text-gray-900'>Our Team</h2>
                        <p className='mx-auto mb-12 max-w-2xl text-gray-600'>
                            A dedicated team of healthcare professionals, technologists, and innovators working together
                            to transform pediatric care delivery.
                        </p>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                            {team.map(member => (
                                <div
                                    className='rounded-xl bg-white p-6 shadow-sm'
                                    key={generateId()}
                                >
                                    <div className='mb-4'>
                                        <div className='relative mx-auto h-32 w-32 overflow-hidden rounded-full bg-linear-to-br from-blue-100 to-teal-100'>
                                            {/* Placeholder for team member image */}
                                            <div className='flex h-full w-full items-center justify-center'>
                                                <Users className='h-16 w-16 text-blue-600' />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className='mb-1 font-bold text-gray-900'>{member.name}</h3>
                                    <p className='mb-2 text-blue-600'>{member.role}</p>
                                    <p className='mb-3 text-gray-600 text-sm'>{member.specialty}</p>
                                    <p className='text-gray-500 text-xs'>{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className='bg-linear-to-r from-blue-600 to-teal-600 py-16'>
                <div className='container mx-auto px-4'>
                    <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
                        <div className='text-center'>
                            <div className='font-bold text-4xl text-white'>150+</div>
                            <div className='mt-2 text-blue-100'>Clinics Served</div>
                        </div>
                        <div className='text-center'>
                            <div className='font-bold text-4xl text-white'>75K+</div>
                            <div className='mt-2 text-blue-100'>Patients Managed</div>
                        </div>
                        <div className='text-center'>
                            <div className='font-bold text-4xl text-white'>99.9%</div>
                            <div className='mt-2 text-blue-100'>Uptime</div>
                        </div>
                        <div className='text-center'>
                            <div className='font-bold text-4xl text-white'>24/7</div>
                            <div className='mt-2 text-blue-100'>Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-16'>
                <div className='container mx-auto px-4'>
                    <div className='mx-auto max-w-4xl rounded-2xl bg-linear-to-r from-blue-50 to-teal-50 p-8 text-center'>
                        <h2 className='mb-4 font-bold text-3xl text-gray-900'>Ready to Join Us?</h2>
                        <p className='mx-auto mb-8 max-w-2xl text-gray-600'>
                            Join hundreds of pediatric practices already transforming their care delivery with
                            PediatricCare.
                        </p>
                        <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
                            <Link
                                className='inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700'
                                href='/sign-up'
                            >
                                Start Free Trial
                            </Link>
                            <Link
                                className='inline-flex items-center justify-center rounded-lg border border-blue-600 px-6 py-3 font-medium text-blue-600 hover:bg-blue-50'
                                href='/contact'
                            >
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
