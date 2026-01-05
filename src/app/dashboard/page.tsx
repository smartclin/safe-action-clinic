import { ClinicServices, CTA, Features, Hero, Testimonials } from '@/components/landing';

export default function Home() {
    return (
        <>
            <Hero />
            <Features />
            <ClinicServices />
            <Testimonials />
            <CTA />
        </>
    );
}
