import { Book, Code2, GitPullRequest, Palette, Rocket, Terminal, User, Users } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

import { RoleCard } from './role-card';
import { type RoleOption, UserRole } from './types';

const ChooseRole: React.FC = () => {
    const roles: RoleOption[] = [
        {
            id: UserRole.PATIENT,
            title: 'Developer Account',
            description: 'Start building with the starter kit. Access the dashboard, components, and documentation.',
            href: '/register',
            visualIcon: (
                <User
                    size={32}
                    strokeWidth={2}
                />
            ),
            primaryColor: 'from-blue-500 to-cyan-500',
            buttonText: 'Create Developer Account',
            features: [
                { icon: <Rocket />, text: 'Access to starter kit dashboard' },
                { icon: <Palette />, text: 'Browse UI components & templates' },
                { icon: <Terminal />, text: 'CLI tools and generators' },
                { icon: <Book />, text: 'Full documentation access' }
            ]
        },
        {
            id: UserRole.PROVIDER,
            title: 'Contributor Account',
            description: 'Join the team to contribute code, review PRs, and help build the next version.',
            href: '/register-provider',
            visualIcon: (
                <Code2
                    size={32}
                    strokeWidth={2}
                />
            ),
            primaryColor: 'from-teal-500 to-emerald-500',
            buttonText: 'Become a Contributor',
            features: [
                { icon: <GitPullRequest />, text: 'Submit pull requests' },
                { icon: <Code2 />, text: 'Contribute components' },
                { icon: <Users />, text: 'Join team discussions' },
                { icon: <Book />, text: 'Access internal docs' }
            ]
        }
    ];

    return (
        <div className='flex min-h-screen flex-col bg-slate-50 font-sans transition-colors duration-300 selection:bg-brand-100 selection:text-brand-900 dark:bg-[#0B0F19]'>
            <main className='relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8'>
                {/* Background Decor */}
                <div className='absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-100/40 opacity-50 blur-3xl dark:bg-cyan-900/20' />

                <div className='w-full max-w-5xl space-y-12'>
                    <div className='mx-auto max-w-2xl space-y-4 text-center'>
                        <h1 className='font-bold text-4xl text-slate-900 tracking-tight md:text-4xl dark:text-white'>
                            Choose your <span className='text-brand-600 dark:text-cyan-400'>Account Type</span>
                        </h1>
                        <p className='mx-auto max-w-xl text-lg text-slate-600 leading-relaxed dark:text-slate-400'>
                            A production-ready Next.js starter kit with authentication, database, and beautiful UI
                            components.
                        </p>
                    </div>

                    <div className='mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:gap-8'>
                        {roles.map(role => (
                            <RoleCard
                                key={role.id}
                                role={role}
                            />
                        ))}
                    </div>

                    <p className='mt-8 text-center text-slate-400 text-sm dark:text-slate-500'>
                        Already have an account?{' '}
                        <Link
                            className='font-medium text-brand-600 hover:underline dark:text-cyan-400'
                            href='/login'
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </main>

            <footer className='py-6 text-center text-slate-400 text-sm dark:text-slate-600'>
                © {new Date().getFullYear()} StarterKit. MIT License.
            </footer>
        </div>
    );
};

export default ChooseRole;
