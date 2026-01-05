'use client';

import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon | React.ReactNode;
    trend?: {
        value: number;
        label: string;
    };
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    onClick?: () => void;
    href?: string;
    badge?: string;
    className?: string;
}

export function StatsCard({
    title,
    value,
    description,
    icon,
    trend,
    variant = 'default',
    onClick,
    href,
    badge,
    className
}: StatsCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (href) {
            router.push(href);
        } else if (onClick) {
            onClick();
        }
    };

    const variantStyles = {
        default: 'bg-card border-border hover:border-primary/50',
        primary: 'bg-primary/5 border-primary/20 hover:border-primary/40',
        success: 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40',
        warning: 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
        danger: 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
    };

    const iconColors = {
        default: 'text-primary',
        primary: 'text-primary',
        success: 'text-emerald-600 dark:text-emerald-400',
        warning: 'text-amber-600 dark:text-amber-400',
        danger: 'text-red-600 dark:text-red-400'
    };

    return (
        <div
            className={cn(
                'group relative rounded-xl border bg-linear-to-br from-card to-card/50 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg',
                variantStyles[variant],
                (onClick || href) && 'cursor-pointer',
                className
            )}
            onClick={handleClick}
            onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ' ') && handleClick) {
                    e.preventDefault();
                    handleClick();
                }
            }}
            role={onClick || href ? 'button' : undefined}
            tabIndex={onClick || href ? 0 : undefined} // make it focusable
        >
            {/* Badge */}
            {badge && (
                <Badge
                    className={cn(
                        'absolute -top-2 -right-2 font-medium text-xs',
                        variant === 'primary' && 'border-primary/30 bg-primary/10 text-primary',
                        variant === 'success' &&
                            'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                        variant === 'warning' &&
                            'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                        variant === 'danger' && 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                    )}
                    variant={variant === 'default' ? 'secondary' : 'outline'}
                >
                    {badge}
                </Badge>
            )}

            <div className='flex items-start justify-between'>
                <div className='space-y-2'>
                    <p className='font-medium text-muted-foreground text-sm'>{title}</p>
                    <p className='font-bold text-2xl tracking-tight sm:text-3xl'>{value}</p>
                </div>
                {icon && (
                    <div
                        className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-white/20 to-transparent',
                            iconColors[variant]
                        )}
                    />
                )}
            </div>

            {(description || trend) && (
                <div className='mt-4 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        {trend && (
                            <div
                                className={cn(
                                    'flex items-center gap-1 rounded-full px-2 py-1 font-medium text-xs',
                                    trend.value > 0 && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                                    trend.value < 0 && 'bg-red-500/10 text-red-600 dark:text-red-400',
                                    trend.value === 0 && 'bg-muted text-muted-foreground'
                                )}
                            >
                                {trend.value > 0 && <ArrowUpRight className='h-3 w-3' />}
                                {trend.value < 0 && <ArrowDownRight className='h-3 w-3' />}
                                {trend.value === 0 && <Minus className='h-3 w-3' />}
                                <span>{Math.abs(trend.value)}%</span>
                            </div>
                        )}
                        <span className='text-muted-foreground text-xs'>{trend?.label || description}</span>
                    </div>

                    {/* Click indicator */}
                    {(onClick || href) && (
                        <div className='opacity-0 transition-opacity group-hover:opacity-100'>
                            <ArrowUpRight className='h-4 w-4 text-muted-foreground' />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

interface StatsGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4 | 5;
    gap?: 'sm' | 'md' | 'lg';
}

export function StatsGrid({ children, columns = 4, gap = 'md' }: StatsGridProps) {
    const gapStyles = {
        sm: 'gap-3',
        md: 'gap-4',
        lg: 'gap-6'
    };

    return (
        <div
            className={cn(
                'grid',
                columns === 2 && 'grid-cols-1 sm:grid-cols-2',
                columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
                columns === 5 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
                gapStyles[gap]
            )}
        >
            {children}
        </div>
    );
}
