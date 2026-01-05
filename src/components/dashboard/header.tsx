'use client';

import { Bell, Calendar, Menu, Search, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks';

interface HeaderProps {
    title: string;
    description?: string;
    onMenuClick?: () => void;
    showSearch?: boolean;
    clinicName?: string;
}

export function Header({ title, description, onMenuClick, showSearch = true, clinicName }: HeaderProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const getInitials = (name?: string | null) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className='sticky top-0 z-40 flex h-16 items-center gap-4 border-border border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 sm:px-6'>
            {/* Mobile Menu Button */}
            {onMenuClick && (
                <Button
                    className='lg:hidden'
                    onClick={onMenuClick}
                    size='icon-sm'
                    variant='ghost'
                >
                    <Menu className='h-5 w-5' />
                </Button>
            )}

            {/* Title with Clinic Context */}
            <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                    <Stethoscope className='hidden h-5 w-5 text-primary sm:block' />
                    <div className='min-w-0'>
                        <h1 className='truncate font-semibold text-base tracking-tight sm:text-lg'>{title}</h1>
                        {description && (
                            <p className='truncate text-muted-foreground text-xs sm:text-sm'>{description}</p>
                        )}
                        {clinicName && (
                            <Badge
                                className='mt-1 font-normal text-xs'
                                variant='outline'
                            >
                                {clinicName}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Search */}
            {showSearch && (
                <form
                    className='relative hidden w-48 md:flex lg:w-64'
                    onSubmit={handleSearch}
                >
                    <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        className='h-9 bg-muted/50 pr-9 pl-9'
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder='Search patients, doctors...'
                        type='search'
                        value={searchQuery}
                    />
                    <Button
                        className='absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2'
                        size='icon-sm'
                        type='submit'
                        variant='ghost'
                    >
                        <Search className='h-3.5 w-3.5' />
                    </Button>
                </form>
            )}

            {/* Quick Actions */}
            <div className='flex items-center gap-2'>
                <Button
                    onClick={() => router.push('/appointments')}
                    size='icon-sm'
                    title='Appointments'
                    variant='ghost'
                >
                    <Calendar className='h-5 w-5' />
                </Button>

                {/* Notifications */}
                <div className='relative'>
                    <Button
                        className='relative'
                        onClick={() => router.push('/notifications')}
                        size='icon-sm'
                        variant='ghost'
                    >
                        <Bell className='h-5 w-5' />
                        <span className='absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive font-bold text-[10px] text-destructive-foreground'>
                            3
                        </span>
                    </Button>
                </div>

                {/* User Profile */}
                <div className='flex items-center gap-3'>
                    <div className='hidden text-right lg:block'>
                        <p className='max-w-[160px] truncate font-medium text-sm'>{user?.name || 'User'}</p>
                        <p className='max-w-[160px] truncate text-muted-foreground text-xs'>{user?.role}</p>
                    </div>
                    <Avatar className='h-9 w-9 ring-2 ring-border'>
                        <AvatarImage
                            alt={user?.name || 'User'}
                            src={user?.image || ''}
                        />
                        <AvatarFallback className='bg-linear-to-br from-primary/20 to-violet-500/20 font-semibold'>
                            {getInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
