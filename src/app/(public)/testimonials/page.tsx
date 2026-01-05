'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';

import { StarRating } from './star-rating';

type Testimonial = {
    id: string;
    name: string;
    role: string;
    image: string;
    rating: number;
    quote: string;
};

const testimonials: Testimonial[] = [
    {
        id: 'sarah-m',
        name: 'Sarah M.',
        role: 'Mother of a 2-year-old',
        image: '/images/testimonials/parent3.webp',
        rating: 5,
        quote: 'The doctors at Smart Pediatrics Clinic are incredibly patient and knowledgeable. They took the time to explain everything clearly and made my child feel completely safe.'
    },
    {
        id: 'ahmed-k',
        name: 'Ahmed K.',
        role: 'Father of twins',
        image: '/testimonials/parent1.webp',
        rating: 5,
        quote: 'From vaccinations to growth follow-ups, the care has been exceptional. The clinic is well-organized, and appointments always run smoothly.'
    },
    {
        id: 'lina-r',
        name: 'Lina R.',
        role: 'Mother of a newborn',
        image: '/images/testimonials/parent2.webp',
        rating: 5,
        quote: 'As a first-time parent, I had many concerns. The team was reassuring, compassionate, and extremely professional. I wouldn’t trust my baby with anyone else.'
    }
];

export default function TestimonialsPage() {
    return (
        <main className='bg-background'>
            {/* Hero */}
            <section className='border-b bg-muted/30'>
                <div className='container mx-auto max-w-7xl px-6 py-20 text-center'>
                    <motion.h1
                        animate={{ opacity: 1, y: 0 }}
                        className='font-bold text-4xl tracking-tight sm:text-5xl'
                        initial={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.4 }}
                    >
                        What Parents Say About Us
                    </motion.h1>

                    <p className='mx-auto mt-6 max-w-2xl text-muted-foreground'>
                        Trusted by families in Hurghada for compassionate, evidence-based pediatric care. Your child’s
                        health and comfort are always our priority.
                    </p>
                </div>
            </section>

            {/* Testimonials */}
            <section className='container mx-auto max-w-7xl px-6 py-20'>
                <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                    {testimonials.map((testimonial, index) => (
                        <motion.article
                            className='relative rounded-2xl border bg-card p-8 shadow-sm'
                            initial={{ opacity: 0, y: 20 }}
                            key={testimonial.id}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileInView={{ opacity: 1, y: 0 }}
                        >
                            <Quote className='absolute top-6 right-6 h-6 w-6 text-muted-foreground/30' />

                            {/* Rating */}
                            <div className='mb-4'>
                                <StarRating
                                    id={testimonial.id}
                                    rating={testimonial.rating}
                                />
                            </div>

                            {/* Quote */}
                            <p className='mb-6 text-muted-foreground leading-relaxed'>“{testimonial.quote}”</p>

                            {/* Author */}
                            <div className='flex items-center gap-4'>
                                <div className='relative h-12 w-12 overflow-hidden rounded-full bg-muted'>
                                    <Image
                                        alt={testimonial.name}
                                        className='object-cover'
                                        fill
                                        src={testimonial.image}
                                    />
                                </div>

                                <div>
                                    <p className='font-semibold'>{testimonial.name}</p>
                                    <p className='text-muted-foreground text-sm'>{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className='border-t bg-muted/40'>
                <div className='container mx-auto max-w-7xl px-6 py-16 text-center'>
                    <h2 className='font-semibold text-2xl'>Join Hundreds of Happy Families</h2>
                    <p className='mx-auto mt-4 max-w-xl text-muted-foreground'>
                        Schedule your child’s appointment today and experience pediatric care built on trust, empathy,
                        and clinical excellence.
                    </p>
                </div>
            </section>
        </main>
    );
}
