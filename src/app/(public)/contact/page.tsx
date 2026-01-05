// app/contact/page.tsx
'use client';

import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { useId, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// export const metadata: Metadata = {
//   title: 'Contact Us | Pediatric Clinic Management',
//   description: 'Get in touch with our team for support, sales, or general inquiries',
// };

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        clinicName: '',
        role: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            details: ['support@pediatricclinic.com', 'sales@pediatricclinic.com'],
            description: 'We typically respond within 24 hours'
        },
        {
            icon: Phone,
            title: 'Phone',
            details: ['(555) 123-4567', '(555) 987-6543'],
            description: 'Mon-Fri 9am-5pm EST'
        },
        {
            icon: MapPin,
            title: 'Office',
            details: ['123 Healthcare Ave', 'Medical City, MC 12345'],
            description: 'By appointment only'
        },
        {
            icon: Clock,
            title: 'Support Hours',
            details: ['24/7 Emergency Support', 'Business Hours: 9am-5pm EST'],
            description: 'For technical emergencies'
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success('Message sent successfully!', {
                description: "We'll get back to you within 24 hours."
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                clinicName: '',
                role: ''
            });
        } catch (_error) {
            toast.error('Failed to send message', {
                description: 'Please try again or contact us directly.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const ID = useId();
    return (
        <div className='container mx-auto max-w-6xl px-4 py-12'>
            <div className='mb-12 text-center'>
                <h1 className='mb-4 font-bold text-4xl text-gray-900'>Contact Us</h1>
                <p className='mx-auto max-w-3xl text-gray-600 text-xl'>
                    Get in touch with our team for support, sales inquiries, or to learn more about our pediatric clinic
                    management platform
                </p>
            </div>

            <div className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
                {/* Contact Information */}
                <div className='space-y-8'>
                    <div>
                        <h2 className='mb-6 font-semibold text-2xl text-gray-800'>Get in Touch</h2>
                        <p className='mb-6 text-gray-700'>
                            Whether you&apos;re an existing customer needing support or a healthcare provider interested
                            in our platform, we&apos;re here to help.
                        </p>
                    </div>

                    <div className='space-y-6'>
                        {contactInfo.map(info => (
                            <div
                                className='flex items-start space-x-4'
                                key={ID}
                            >
                                <div className='shrink-0'>
                                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                                        <info.icon className='h-6 w-6 text-blue-600' />
                                    </div>
                                </div>
                                <div>
                                    <h3 className='mb-1 font-medium text-gray-900'>{info.title}</h3>
                                    {info.details.map(detail => (
                                        <p
                                            className='text-gray-700'
                                            key={ID}
                                        >
                                            {detail}
                                        </p>
                                    ))}
                                    <p className='mt-1 text-gray-500 text-sm'>{info.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='rounded-lg border border-blue-200 bg-blue-50 p-6'>
                        <div className='mb-3 flex items-center space-x-3'>
                            <MessageSquare className='h-5 w-5 text-blue-600' />
                            <h3 className='font-medium text-blue-800'>Emergency Support</h3>
                        </div>
                        <p className='text-blue-700 text-sm'>
                            For critical system issues affecting patient care, call our emergency support line available
                            24/7.
                        </p>
                        <p className='mt-2 font-medium text-blue-800'>Emergency: (555) 911-9111</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className='lg:col-span-2'>
                    <div className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm'>
                        <div className='mb-6 flex items-center space-x-3'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
                                <Send className='h-5 w-5 text-blue-600' />
                            </div>
                            <div>
                                <h2 className='font-semibold text-2xl text-gray-800'>Send us a Message</h2>
                                <p className='text-gray-600'>
                                    Fill out the form below and we&apos;ll get back to you promptly
                                </p>
                            </div>
                        </div>

                        <form
                            className='space-y-6'
                            onSubmit={handleSubmit}
                        >
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label
                                        className='required'
                                        htmlFor='name'
                                    >
                                        Full Name
                                    </Label>
                                    <Input
                                        id='name'
                                        name='name'
                                        onChange={handleChange}
                                        placeholder='John Smith'
                                        required
                                        value={formData.name}
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label
                                        className='required'
                                        htmlFor='email'
                                    >
                                        Email Address
                                    </Label>
                                    <Input
                                        id='email'
                                        name='email'
                                        onChange={handleChange}
                                        placeholder='john@example.com'
                                        required
                                        type='email'
                                        value={formData.email}
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='phone'>Phone Number</Label>
                                    <Input
                                        id='phone'
                                        name='phone'
                                        onChange={handleChange}
                                        placeholder='(555) 123-4567'
                                        type='tel'
                                        value={formData.phone}
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='role'>Your Role</Label>
                                    <select
                                        className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        id='role'
                                        name='role'
                                        onChange={handleChange}
                                        value={formData.role}
                                    >
                                        <option value=''>Select your role</option>
                                        <option value='pediatrician'>Pediatrician</option>
                                        <option value='nurse'>Nurse/NP</option>
                                        <option value='administrator'>Clinic Administrator</option>
                                        <option value='owner'>Practice Owner</option>
                                        <option value='other'>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='clinicName'>Smart Clinic</Label> {/* Add this line */}
                                <Input
                                    id='clinicName'
                                    name='clinicName'
                                    onChange={handleChange}
                                    placeholder='Smart Clinic'
                                    value={formData.clinicName}
                                />{' '}
                                {/* Add this line */}
                            </div>

                            <div className='space-y-2'>
                                <Label
                                    className='required'
                                    htmlFor='subject'
                                >
                                    Subject
                                </Label>
                                <Input
                                    id='subject'
                                    name='subject'
                                    onChange={handleChange}
                                    placeholder='Subject of your message'
                                    required
                                    value={formData.subject}
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label
                                    className='required'
                                    htmlFor='message'
                                >
                                    Message
                                </Label>
                                <Textarea
                                    id='message'
                                    name='message'
                                    onChange={handleChange}
                                    placeholder='Write your message here...'
                                    required
                                    rows={5}
                                    value={formData.message}
                                />
                            </div>

                            <Button
                                disabled={isSubmitting}
                                type='submit'
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
