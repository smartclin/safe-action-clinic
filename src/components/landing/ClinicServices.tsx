'use client';

const services = [
    {
        name: 'Pediatric Consultations',
        description: 'Comprehensive medical care for children from newborns to adolescents.',
        icon: (
            <svg
                className='h-10 w-10'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <title>Pediatric Consultations Icon</title>
                <path d='M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
            </svg>
        ),
        category: 'Medical'
    },
    {
        name: 'Vaccination & Immunization',
        description: 'Safe and effective vaccines to protect your child’s health.',
        icon: (
            <svg
                className='h-10 w-10'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <title>Vaccination & Immunization Icon</title>
                <path d='M20 2H4c-1.1 0-2 .9-2 2v16l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' />
            </svg>
        ),
        category: 'Preventive'
    },
    {
        name: 'Growth & Development Tracking',
        description: 'Regular monitoring to ensure your child is growing healthy and strong.',
        icon: (
            <svg
                className='h-10 w-10'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <title>Growth & Development Tracking Icon</title>
                <path d='M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-6h2v6zm0-8h-2V6h2v2z' />
            </svg>
        ),
        category: 'Monitoring'
    },
    {
        name: 'Nutrition & Lactation Support',
        description: 'Expert guidance on feeding, breastfeeding, and healthy diets for children.',
        icon: (
            <svg
                className='h-10 w-10'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <title>Nutrition & Lactation Support Icon</title>
                <path d='M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z' />
            </svg>
        ),
        category: 'Support'
    },
    {
        name: 'Pediatric Emergency Care',
        description: '24/7 urgent care service to handle any medical emergency.',
        icon: (
            <svg
                className='h-10 w-10'
                fill='currentColor'
                viewBox='0 0 24 24'
            >
                <title>Pediatric Emergency Care Icon</title>
                <path d='M12 2l4 4-4 4-4-4 4-4zm0 8v12m-6-6h12' />
            </svg>
        ),
        category: 'Emergency'
    }
];

export function ClinicServices() {
    return (
        <section
            className='relative bg-background py-24 sm:py-32'
            id='clinic-services'
        >
            {/* Background dots */}
            <div className='absolute inset-0 overflow-hidden'>
                <div
                    className='absolute inset-0 opacity-[0.015] dark:opacity-[0.02]'
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                {/* Section Header */}
                <div className='mx-auto mb-16 max-w-3xl text-center sm:mb-20'>
                    <h2 className='font-bold text-3xl tracking-tight sm:text-4xl lg:text-5xl'>
                        Our{' '}
                        <span className='bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400'>
                            Pediatric Services
                        </span>
                    </h2>
                    <p className='mt-4 text-lg text-muted-foreground'>
                        Comprehensive, compassionate, and specialized care for children at every stage of growth.
                    </p>
                </div>

                {/* Services Grid */}
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {services.map((service, index) => (
                        <ServiceCard
                            index={index}
                            key={service.name}
                            service={service}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ service, index }: { service: (typeof services)[0]; index: number }) {
    return (
        <div
            className='group relative flex flex-col items-center rounded-2xl border border-border bg-card/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-card hover:shadow-lg hover:shadow-primary/5'
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Category Badge */}
            <span className='absolute top-3 right-3 font-medium text-[10px] text-muted-foreground/60 uppercase tracking-wider'>
                {service.category}
            </span>

            {/* Icon */}
            <div className='mb-4 text-foreground/80 transition-transform group-hover:scale-110 group-hover:text-foreground'>
                {service.icon}
            </div>

            {/* Name */}
            <h3 className='mb-1 font-semibold text-sm'>{service.name}</h3>

            {/* Description */}
            <p className='text-muted-foreground text-xs leading-relaxed'>{service.description}</p>
        </div>
    );
}
