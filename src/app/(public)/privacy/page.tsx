// app/privacy/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy | Pediatric Clinic Management',
    description: 'Privacy policy for our pediatric clinic management system'
};

export default function PrivacyPolicyPage() {
    return (
        <div className='container mx-auto max-w-4xl px-4 py-12'>
            <div className='mb-8'>
                <h1 className='mb-4 font-bold text-3xl text-gray-900'>Privacy Policy</h1>
                <p className='text-gray-600'>
                    Last updated:{' '}
                    {new Date().toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </p>
            </div>

            <div className='space-y-8 text-gray-700'>
                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>1. Introduction</h2>
                    <p>
                        Welcome to Pediatric Clinic Management. We are committed to protecting the privacy and security
                        of your personal information and your patients&apos; protected health information (PHI). This
                        Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
                        use our platform.
                    </p>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>2. Information We Collect</h2>
                    <div className='space-y-4'>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>2.1 Personal Information</h3>
                            <ul className='list-disc space-y-2 pl-6'>
                                <li>Full name, date of birth, contact information</li>
                                <li>Professional credentials and license numbers</li>
                                <li>Clinic information and practice details</li>
                                <li>Billing and payment information</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>2.2 Patient Health Information</h3>
                            <ul className='list-disc space-y-2 pl-6'>
                                <li>Medical history and treatment records</li>
                                <li>Immunization records</li>
                                <li>Growth and development data</li>
                                <li>Appointment schedules and clinical notes</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='mb-2 font-medium text-gray-800 text-xl'>2.3 Technical Information</h3>
                            <ul className='list-disc space-y-2 pl-6'>
                                <li>IP addresses and device information</li>
                                <li>Browser type and version</li>
                                <li>Usage data and analytics</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>3. How We Use Your Information</h2>
                    <ul className='list-disc space-y-2 pl-6'>
                        <li>To provide and maintain our pediatric clinic management services</li>
                        <li>To process transactions and manage billing</li>
                        <li>To facilitate appointment scheduling and patient management</li>
                        <li>To maintain accurate medical records</li>
                        <li>To send important updates and notifications</li>
                        <li>To improve our services and user experience</li>
                        <li>To comply with legal and regulatory requirements</li>
                    </ul>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>4. Data Security</h2>
                    <p>We implement industry-standard security measures to protect your information, including:</p>
                    <ul className='mt-2 list-disc space-y-2 pl-6'>
                        <li>End-to-end encryption for all data transmission</li>
                        <li>Secure data storage with regular backups</li>
                        <li>Access controls and authentication protocols</li>
                        <li>Regular security audits and vulnerability assessments</li>
                        <li>HIPAA-compliant data handling procedures</li>
                    </ul>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>5. Data Sharing and Disclosure</h2>
                    <p>
                        We do not sell or rent your personal information. We may share information only in the following
                        circumstances:
                    </p>
                    <ul className='mt-2 list-disc space-y-2 pl-6'>
                        <li>With your explicit consent</li>
                        <li>To comply with legal obligations</li>
                        <li>To facilitate healthcare operations</li>
                        <li>
                            With service providers who assist in platform operation (under strict confidentiality
                            agreements)
                        </li>
                        <li>In case of business transfer or merger</li>
                    </ul>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>6. Your Rights</h2>
                    <p>Depending on your jurisdiction, you may have rights including:</p>
                    <ul className='mt-2 list-disc space-y-2 pl-6'>
                        <li>Right to access your personal information</li>
                        <li>Right to correct inaccurate information</li>
                        <li>Right to request deletion of your data</li>
                        <li>Right to restrict processing of your data</li>
                        <li>Right to data portability</li>
                        <li>Right to object to processing</li>
                    </ul>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>7. Children&apos;s Privacy</h2>
                    <p>
                        Our platform is designed for healthcare professionals managing pediatric patients. We do not
                        knowingly collect personal information from children under 13 directly. All patient data is
                        collected and managed by authorized healthcare providers in accordance with HIPAA regulations.
                    </p>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>8. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy periodically. We will notify you of any changes by posting the
                        new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                    </p>
                </section>

                <section>
                    <h2 className='mb-4 font-semibold text-2xl text-gray-800'>9. Contact Us</h2>
                    <p>If you have questions about this Privacy Policy, please contact us:</p>
                    <div className='mt-2 space-y-1'>
                        <p>Email: privacy@pediatricclinic.com</p>
                        <p>Phone: (555) 123-4567</p>
                        <p>Address: 123 Healthcare Ave, Medical City, MC 12345</p>
                    </div>
                </section>

                <div className='border-t pt-8'>
                    <p className='text-gray-600'>
                        This Privacy Policy is compliant with HIPAA, GDPR, and other applicable privacy regulations.
                    </p>
                </div>
            </div>

            <div className='mt-12 border-gray-200 border-t pt-8'>
                <Link
                    className='inline-flex items-center font-medium text-blue-600 hover:text-blue-800'
                    href='/'
                >
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
