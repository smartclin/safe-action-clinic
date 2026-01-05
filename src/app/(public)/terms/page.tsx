// app/terms/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms of Service | Pediatric Clinic Management',
    description: 'Terms and conditions for using our pediatric clinic management system'
};

export default function TermsOfServicePage() {
    return (
        <div className='container mx-auto max-w-4xl px-4 py-12'>
            <div className='mb-8'>
                <h1 className='mb-4 font-bold text-3xl text-gray-900'>Terms of Service</h1>
                <p className='text-gray-600'>
                    Effective date:{' '}
                    {new Date().toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </p>
            </div>

            <div className='space-y-8 text-gray-700'>
                <section className='rounded-lg border border-blue-100 bg-blue-50 p-6'>
                    <h2 className='mb-2 font-semibold text-blue-800 text-xl'>Important Notice</h2>
                    <p className='text-blue-700'>
                        This is a legally binding agreement. By accessing or using our platform, you agree to be bound
                        by these Terms of Service. If you do not agree with these terms, please do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>1. Acceptance of Terms</h2>
                    <p>
                        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Pediatric Clinic
                        Management platform (&quot;Platform&quot;), operated by [Company Name] (&quot;we,&quot;
                        &quot;us,&quot; or &quot;our&quot;). By accessing or using the Platform, you agree to be bound
                        by these Terms and our Privacy Policy.
                    </p>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>
                        2. Healthcare Provider Responsibilities
                    </h2>
                    <div className='space-y-4'>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>2.1 License Verification</h3>
                            <p>
                                You represent and warrant that you are a licensed healthcare provider authorized to
                                practice in your jurisdiction. You must maintain current and active licensure throughout
                                your use of the Platform.
                            </p>
                        </div>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>2.2 HIPAA Compliance</h3>
                            <p>As a covered entity or business associate under HIPAA, you are responsible for:</p>
                            <ul className='mt-2 list-disc space-y-2 pl-6'>
                                <li>Maintaining appropriate security measures for accessing the Platform</li>
                                <li>Ensuring patient data is entered and managed in compliance with HIPAA</li>
                                <li>Obtaining necessary patient consents and authorizations</li>
                                <li>Reporting any security incidents or data breaches</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>2.3 Clinical Responsibility</h3>
                            <p>
                                The Platform is a tool to assist with clinic management. You retain full clinical
                                responsibility for all patient care decisions and treatment plans.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>3. Account Registration and Security</h2>
                    <ul className='list-disc space-y-2 pl-6'>
                        <li>You must provide accurate and complete registration information</li>
                        <li>You are responsible for maintaining the confidentiality of your login credentials</li>
                        <li>You must notify us immediately of any unauthorized access to your account</li>
                        <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
                    </ul>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>4. Subscription and Payment</h2>
                    <div className='space-y-4'>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>4.1 Subscription Plans</h3>
                            <p>
                                We offer various subscription plans with different features and limitations. Details of
                                current plans are available on our pricing page.
                            </p>
                        </div>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>4.2 Billing</h3>
                            <ul className='list-disc space-y-2 pl-6'>
                                <li>Subscriptions are billed on a monthly or annual basis</li>
                                <li>All fees are non-refundable unless otherwise stated</li>
                                <li>We may change subscription fees with 30 days&apos; notice</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>4.3 Free Trial</h3>
                            <p>
                                We may offer a free trial period. At the end of the trial, you will be automatically
                                charged unless you cancel before the trial ends.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>5. Intellectual Property</h2>
                    <ul className='list-disc space-y-2 pl-6'>
                        <li>The Platform and its original content, features, and functionality are owned by us</li>
                        <li>You retain ownership of all patient data you enter into the Platform</li>
                        <li>You grant us a license to use anonymized, aggregated data for platform improvement</li>
                        <li>Our trademarks and logos may not be used without prior written permission</li>
                    </ul>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>6. Data Management and Ownership</h2>
                    <div className='space-y-4'>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>6.1 Patient Data Ownership</h3>
                            <p>
                                You own all patient health information (PHI) that you enter into the Platform. We act as
                                a custodian of this data under the terms of our Business Associate Agreement.
                            </p>
                        </div>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>6.2 Data Export</h3>
                            <p>
                                You may export your patient data at any time through the Platform&apos;s export
                                features. Upon termination, you will have 30 days to export your data.
                            </p>
                        </div>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>6.3 Data Retention</h3>
                            <p>
                                We will retain patient data as required by applicable healthcare regulations. Upon
                                account termination, we will securely delete or anonymize your data according to our
                                data retention policy.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>7. Limitations of Liability</h2>
                    <div className='space-y-2'>
                        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:</p>
                        <ul className='list-disc space-y-2 pl-6'>
                            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                            <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                            <li>Damages resulting from unauthorized access to or use of our servers</li>
                            <li>
                                Any errors or omissions in any content or for any loss incurred as a result of use of
                                any content
                            </li>
                        </ul>
                        <p className='mt-4'>
                            Our total liability for any claims under these Terms shall not exceed the amount you paid us
                            in the last 12 months.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>8. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any
                        reason, including breach of these Terms. Upon termination, your right to use the Platform will
                        immediately cease.
                    </p>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>9. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of [Your
                        State/Country], without regard to its conflict of law provisions.
                    </p>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>10. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify or replace these Terms at any time. We will provide notice of
                        material changes via email or through the Platform. Continued use after changes constitutes
                        acceptance.
                    </p>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>11. Contact Information</h2>
                    <div className='space-y-1'>
                        <p>For questions about these Terms, contact:</p>
                        <p>Email: legal@pediatricclinic.com</p>
                        <p>Phone: (555) 123-4567</p>
                        <p>Address: 123 Healthcare Ave, Medical City, MC 12345</p>
                    </div>
                </section>
            </div>

            <div className='mt-12 flex items-center justify-between border-gray-200 border-t pt-8'>
                <Link
                    className='inline-flex items-center font-medium text-blue-600 hover:text-blue-800'
                    href='/'
                >
                    ← Back to Home
                </Link>
                <div className='text-gray-500 text-sm'>Version 2.1</div>
            </div>
        </div>
    );
}
