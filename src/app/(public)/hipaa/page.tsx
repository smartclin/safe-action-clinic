// app/hipaa/page.tsx

import { CheckCircle, FileText, Shield } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { FaqSection } from './faq-section';
import { hipaaFeatures, hipaaRequirements } from './hipaa-data';

export const metadata: Metadata = {
    title: 'HIPAA Compliance | Pediatric Clinic Management',
    description: 'Information about our HIPAA compliance and security measures'
};

export default function HIPAACompliancePage() {
    return (
        <div className='container mx-auto max-w-6xl px-4 py-12'>
            <div className='mb-12 text-center'>
                <div className='mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100'>
                    <Shield className='h-8 w-8 text-blue-600' />
                </div>
                <h1 className='mb-4 font-bold text-4xl text-gray-900'>HIPAA Compliance</h1>
                <p className='mx-auto max-w-3xl text-gray-600 text-xl'>
                    Our commitment to protecting patient health information and maintaining HIPAA compliance
                </p>
            </div>

            <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
                <div className='space-y-8'>
                    <section>
                        <h2 className='mb-4 font-semibold text-2xl text-gray-800'>Our HIPAA Commitment</h2>
                        <p className='mb-4 text-gray-700'>
                            Pediatric Clinic Management is designed from the ground up to be HIPAA-compliant. We
                            understand the critical importance of protecting patient health information (PHI) and have
                            implemented comprehensive security measures to ensure compliance with the Health Insurance
                            Portability and Accountability Act.
                        </p>
                        <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                            <p className='font-medium text-blue-800'>
                                <strong>Important:</strong> While we provide HIPAA-compliant infrastructure and tools,
                                ultimate HIPAA compliance responsibility rests with healthcare providers as covered
                                entities.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className='mb-6 font-semibold text-2xl text-gray-800'>Security Features</h2>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {hipaaFeatures.map(feature => (
                                <div
                                    className='rounded-lg border border-gray-200 p-4'
                                    key={feature.title}
                                >
                                    <div className='flex items-start space-x-3'>
                                        <feature.icon className='h-6 w-6 text-blue-600' />
                                        <div>
                                            <h3 className='font-medium text-gray-800'>{feature.title}</h3>
                                            <p className='text-gray-600 text-sm'>{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className='space-y-8'>
                    <section>
                        <h2 className='mb-4 font-semibold text-2xl text-gray-800'>HIPAA Requirements We Address</h2>
                        <div className='space-y-3'>
                            {hipaaRequirements.map(requirement => (
                                <div
                                    className='flex items-center space-x-3'
                                    key={requirement}
                                >
                                    <CheckCircle className='h-5 w-5 shrink-0 text-green-500' />
                                    <span className='text-gray-700'>{requirement}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
                        <h2 className='mb-4 font-semibold text-2xl text-gray-800'>Business Associate Agreement</h2>
                        <p className='mb-4 text-gray-700'>
                            We provide a comprehensive Business Associate Agreement (BAA) to all healthcare provider
                            customers. This agreement:
                        </p>
                        <ul className='mb-4 list-disc space-y-2 pl-6 text-gray-700'>
                            <li>Outlines permitted uses and disclosures of PHI</li>
                            <li>Specifies security safeguards and breach notification procedures</li>
                            <li>Details data retention and destruction policies</li>
                        </ul>
                        <div className='mt-4'>
                            <Link
                                className='inline-flex items-center font-medium text-blue-600 hover:text-blue-800'
                                href='#'
                            >
                                <FileText className='mr-2 h-4 w-4' />
                                View Sample BAA
                            </Link>
                        </div>
                    </section>

                    <section>
                        <h2 className='mb-4 font-semibold text-2xl text-gray-800'>Compliance Documentation</h2>
                        <div className='space-y-3'>
                            <div className='flex items-center justify-between border-gray-200 border-b py-2'>
                                <span className='text-gray-700'>Security Risk Assessment</span>
                                <span className='rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-sm'>
                                    Completed
                                </span>
                            </div>
                            <div className='flex items-center justify-between border-gray-200 border-b py-2'>
                                <span className='text-gray-700'>Penetration Testing</span>
                                <span className='rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-sm'>
                                    Quarterly
                                </span>
                            </div>
                            <div className='flex items-center justify-between border-gray-200 border-b py-2'>
                                <span className='text-gray-700'>Employee Training</span>
                                <span className='rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-sm'>
                                    Annual
                                </span>
                            </div>
                            <div className='flex items-center justify-between border-gray-200 border-b py-2'>
                                <span className='text-gray-700'>Third-Party Audits</span>
                                <span className='rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-sm'>
                                    Annual
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <FaqSection />

            <div className='mt-12 border-gray-200 border-t pt-8'>
                <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                    <div>
                        <h3 className='mb-2 font-medium text-gray-900'>Need more information?</h3>
                        <p className='text-gray-600'>Contact our compliance team for specific questions.</p>
                    </div>
                    <div className='flex flex-col gap-3 sm:flex-row'>
                        <Link
                            className='rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700'
                            href='/contact'
                        >
                            Contact Compliance Team
                        </Link>
                        <Link
                            className='rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50'
                            href='/'
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
