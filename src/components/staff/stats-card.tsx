'use client';

import type { LucideIcon } from 'lucide-react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        label: string;
    };
    className?: string;
    color?: 'blue' | 'emerald' | 'purple' | 'amber' | 'red' | 'indigo';
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    color = 'blue', // Default color
    className
}: StatsCardProps) {
    // Map colors to Tailwind classes
    const colorMap = {
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
    };

    return (
        <div
            className={cn(
                'rounded-xl border border-border bg-card p-6 transition-all hover:shadow-black/5 hover:shadow-md dark:hover:shadow-black/20',
                className
            )}
        >
            <div className='flex items-start justify-between'>
                <div className='space-y-1'>
                    <p className='font-medium text-muted-foreground text-sm'>{title}</p>
                    <p className='font-bold text-2xl tracking-tight'>{value}</p>
                </div>
                {Icon && (
                    <div
                        className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                            colorMap[color] // Dynamically apply colors
                        )}
                    >
                        <Icon className='h-5 w-5' />
                    </div>
                )}
            </div>

            {(description || trend) && (
                <div className='mt-4 flex items-center gap-2'>
                    {trend && (
                        <span
                            className={cn(
                                'flex items-center gap-0.5 font-medium text-xs',
                                trend.value > 0 && 'text-emerald-600 dark:text-emerald-400',
                                trend.value < 0 && 'text-red-600 dark:text-red-400',
                                trend.value === 0 && 'text-muted-foreground'
                            )}
                        >
                            {trend.value > 0 && <TrendingUp className='h-3 w-3' />}
                            {trend.value < 0 && <TrendingDown className='h-3 w-3' />}
                            {trend.value === 0 && <Minus className='h-3 w-3' />}
                            {Math.abs(trend.value)}%
                        </span>
                    )}
                    <span className='text-muted-foreground text-xs'>{trend?.label || description}</span>
                </div>
            )}
        </div>
    );
}

interface StatsGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
}

export function StatsGrid({ children, columns = 4 }: StatsGridProps) {
    return (
        <div
            className={cn(
                'grid gap-4',
                columns === 2 && 'grid-cols-1 sm:grid-cols-2',
                columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            )}
        >
            {children}
        </div>
    );
}
