'use client';

import { Clock, Heart, Quote, Shield, Smile, Star } from 'lucide-react';

const testimonials = [
    {
        id: '1',
        content:
            'Dr. Hazem and his team are absolutely wonderful! My daughter was anxious about her check-up, but the staff made her feel so comfortable. The app makes scheduling appointments a breeze.',
        author: 'Sarah Johnson',
        role: 'Mother of 4-year-old',
        avatar: 'SJ',
        rating: 5,
        childAge: '4 years'
    },
    {
        id: '2',
        content:
            'The Smart Clinic app saved us during an emergency. We got a video consultation within minutes, and the follow-up care was exceptional. Truly a lifesaver!',
        author: 'Marcus Rodriguez',
        role: 'Father of twins',
        avatar: 'MR',
        rating: 5,
        childAge: '2 years'
    },
    {
        id: '3',
        content:
            'As a first-time mom, I had so many questions. Dr. Hazem patiently answered every one through the app. The vaccination reminders are incredibly helpful!',
        author: 'Emily Watson',
        role: 'New mother',
        avatar: 'EW',
        rating: 5,
        childAge: '8 months'
    },
    {
        id: '4',
        content:
            "The digital health records feature is fantastic. We moved cities and all our children's medical history was right there. Seamless transition to new care.",
        author: 'David Kim',
        role: 'Father of three',
        avatar: 'DK',
        rating: 5,
        childAge: '7 years'
    },
    {
        id: '5',
        content:
            'My son actually looks forward to doctor visits now! The kid-friendly waiting area and gentle approach make all the difference. Highly recommend Smart Clinic.',
        author: 'Lisa Thompson',
        role: 'Mother of 6-year-old',
        avatar: 'LT',
        rating: 5,
        childAge: '6 years'
    },
    {
        id: '6',
        content:
            'The 24/7 chat support gave me peace of mind when my baby had fever at 2 AM. Quick, professional advice that helped us through the night.',
        author: 'James Mitchell',
        role: 'Father of 1-year-old',
        avatar: 'JM',
        rating: 5,
        childAge: '1 year'
    }
];

export function Testimonials() {
    return (
        <section
            className='relative bg-sky-50/50 py-24 sm:py-32 dark:bg-sky-950/20'
            id='testimonials'
        >
            {/* Background with child-friendly elements */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute top-1/4 right-0 h-96 w-96 rounded-full bg-sky-400/10 blur-[128px]' />
                <div className='absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-[128px]' />
                {/* Decorative elements */}
                <div className='absolute top-10 left-10 opacity-10'>
                    <Heart className='h-16 w-16 text-pink-400' />
                </div>
                <div className='absolute right-10 bottom-10 opacity-10'>
                    <Shield className='h-16 w-16 text-blue-400' />
                </div>
            </div>

            <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                {/* Section Header */}
                <div className='mx-auto mb-16 max-w-3xl text-center sm:mb-20'>
                    <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sky-700 dark:bg-sky-900 dark:text-sky-300'>
                        <Heart className='h-4 w-4' />
                        <span className='font-medium text-sm'>Trusted by Families</span>
                    </div>
                    <h2 className='font-bold text-3xl tracking-tight sm:text-4xl lg:text-5xl'>
                        Loved by{' '}
                        <span className='bg-linear-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent dark:from-sky-400 dark:to-emerald-400'>
                            Parents & Kids
                        </span>
                    </h2>
                    <p className='mt-4 text-gray-600 text-lg dark:text-gray-400'>
                        Join hundreds of families who trust Dr. Hazem and the Smart Clinic team with their children's
                        health.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            index={index}
                            key={testimonial.id}
                            testimonial={testimonial}
                        />
                    ))}
                </div>

                {/* Stats */}
                <div className='mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4'>
                    <Stat
                        color='from-pink-500 to-rose-500'
                        icon={<Heart className='h-6 w-6' />}
                        label='Happy Families'
                        value='1,000+'
                    />
                    <Stat
                        color='from-sky-500 to-blue-500'
                        icon={<Shield className='h-6 w-6' />}
                        label='Satisfaction Rate'
                        value='99%'
                    />
                    <Stat
                        color='from-emerald-500 to-green-500'
                        icon={<Clock className='h-6 w-6' />}
                        label='Avg. Wait Time'
                        value='15 min'
                    />
                    <Stat
                        color='from-amber-500 to-orange-500'
                        icon={<Smile className='h-6 w-6' />}
                        label='Support Available'
                        value='24/7'
                    />
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ testimonial, index }: { testimonial: (typeof testimonials)[0]; index: number }) {
    return (
        <div
            className='group relative rounded-2xl border border-sky-100 bg-white p-6 backdrop-blur-sm transition-all duration-300 hover:border-sky-200 hover:bg-white hover:shadow-lg hover:shadow-sky-100/50 dark:border-sky-900 dark:bg-slate-900 dark:hover:border-sky-800 dark:hover:shadow-sky-900/20'
            style={{
                animationDelay: `${index * 100}ms`
            }}
        >
            {/* Quote Icon */}
            <Quote className='absolute top-4 right-4 h-8 w-8 text-sky-100 dark:text-sky-900' />

            {/* Rating */}
            <div className='mb-4 flex items-center gap-0.5'>
                {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star
                        className='h-4 w-4 fill-amber-400 text-amber-400'
                        key={`${testimonial.id}-star-${starIndex}`}
                    />
                ))}
            </div>

            {/* Content */}
            <p className='mb-6 text-gray-600 text-sm leading-relaxed dark:text-gray-300'>
                &ldquo;{testimonial.content}&rdquo;
            </p>

            {/* Author */}
            <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-sky-100 to-emerald-100 font-semibold text-sky-700 text-sm dark:from-sky-900 dark:to-emerald-900 dark:text-sky-300'>
                    {testimonial.avatar}
                </div>
                <div>
                    <p className='font-medium text-sm'>{testimonial.author}</p>
                    <div className='flex items-center gap-2'>
                        <p className='text-gray-500 text-xs dark:text-gray-400'>{testimonial.role}</p>
                        <span className='text-gray-400 text-xs'>•</span>
                        <p className='font-medium text-sky-600 text-xs dark:text-sky-400'>{testimonial.childAge}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Stat({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
    return (
        <div className='text-center'>
            <div className='mb-2 inline-flex items-center justify-center rounded-lg bg-white p-3 shadow-sm dark:bg-slate-800'>
                <div className={`bg-linear-to-r ${color} bg-clip-text text-transparent`}>{icon}</div>
            </div>
            <p
                className={`bg-linear-to-r ${color} bg-clip-text font-bold text-3xl text-transparent tracking-tight sm:text-4xl`}
            >
                {value}
            </p>
            <p className='mt-1 text-gray-500 text-sm dark:text-gray-400'>{label}</p>
        </div>
    );
}
