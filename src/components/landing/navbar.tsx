'use client';

import { LayoutDashboard, Loader2, LogOut, Menu, X } from 'lucide-react';
import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { getRoleRedirect } from '@/lib/routes';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#about', label: 'About Us' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' }
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, isLoading, role, signOut } = useAuth();

    const dashboardUrl = getRoleRedirect(role);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
                isScrolled ? 'border-border/50 border-b bg-background/80 shadow-sm backdrop-blur-xl' : 'bg-transparent'
            )}
        >
            <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>
                    {/* Logo */}
                    <Link
                        className='group flex items-center gap-2'
                        href='/'
                    >
                        <div className='relative flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 shadow-lg shadow-primary/25 transition-transform group-hover:scale-105'>
                            <Image
                                alt='Smart Clinic logo'
                                className='object-contain'
                                height={32}
                                priority
                                src='/logo.svg'
                                width={32}
                            />
                        </div>
                        <span className='font-semibold text-lg tracking-tight'>Smart Clinic</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className='hidden md:flex md:items-center md:gap-8'>
                        {navLinks.map(link => (
                            <Link
                                className='font-medium text-muted-foreground text-sm transition-colors hover:text-foreground'
                                href={link.href as Route}
                                key={link.href}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className='hidden md:flex md:items-center md:gap-3'>
                        {isLoading ? (
                            <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                        ) : isAuthenticated ? (
                            <>
                                <Button
                                    asChild
                                    size='sm'
                                    variant='ghost'
                                >
                                    <Link
                                        className='flex items-center gap-2'
                                        href={dashboardUrl as Route}
                                    >
                                        <LayoutDashboard className='h-4 w-4' />
                                        Dashboard
                                    </Link>
                                </Button>
                                <Button
                                    className='flex items-center gap-2'
                                    onClick={signOut}
                                    size='sm'
                                    variant='outline'
                                >
                                    <LogOut className='h-4 w-4' />
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    className='bg-linear-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-600 hover:to-emerald-600'
                                    size='sm'
                                >
                                    <Link href='/login'>
                                        <LayoutDashboard className='mr-2 h-4 w-4' />
                                        Doctor Portal
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size='sm'
                                    variant='outline'
                                >
                                    <Link href='/register'>Patient Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        aria-label='Toggle menu'
                        className='inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden'
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        type='button'
                    >
                        {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={cn(
                        'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
                        isMobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
                    )}
                >
                    <div className='flex flex-col gap-2 pt-2'>
                        {navLinks.map(link => (
                            <Link
                                className='rounded-lg px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground'
                                href={link.href as Route}
                                key={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className='mt-2 flex flex-col gap-2 border-border border-t pt-4'>
                            {isLoading ? (
                                <div className='flex justify-center py-2'>
                                    <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                                </div>
                            ) : isAuthenticated ? (
                                <>
                                    <Button
                                        asChild
                                        className='w-full'
                                        size='sm'
                                        variant='outline'
                                    >
                                        <Link
                                            className='flex items-center justify-center gap-2'
                                            href={dashboardUrl as Route}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <LayoutDashboard className='h-4 w-4' />
                                            Dashboard
                                        </Link>
                                    </Button>
                                    <Button
                                        className='flex w-full items-center justify-center gap-2'
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            signOut();
                                        }}
                                        size='sm'
                                        variant='ghost'
                                    >
                                        <LogOut className='h-4 w-4' />
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        className='w-full bg-linear-to-r from-sky-500 to-emerald-500 text-white hover:from-sky-600 hover:to-emerald-600'
                                        size='sm'
                                    >
                                        <Link
                                            href={'/login' as Route}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <LayoutDashboard className='mr-2 h-4 w-4' />
                                            Doctor Portal
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className='w-full'
                                        size='sm'
                                        variant='outline'
                                    >
                                        <Link
                                            href='/register'
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Patient Sign Up
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
