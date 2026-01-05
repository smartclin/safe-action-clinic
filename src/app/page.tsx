// app/page.tsx - FIXED
import { Footer, Navbar } from '@/components/landing';
import { AnimatedBackground, LandingPageContent } from '@/components/layout-skeleton';

/**
 * Public landing page - no auth redirects needed here
 * Auth protection is handled by middleware and route groups
 */
export default async function Home() {
    return (
        <div className='relative min-h-screen overflow-hidden'>
            <AnimatedBackground />

            <div className='relative z-10'>
                <Navbar />
                <main>
                    <LandingPageContent />
                </main>
                <Footer />
            </div>
        </div>
    );
}
