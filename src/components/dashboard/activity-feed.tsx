'use client';

import type { LucideIcon } from 'lucide-react';
import { Activity, Baby, Calendar, FileText, HeartPulse, Pill, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ActivityItem {
    id: string;
    type: 'appointment' | 'medical' | 'prescription' | 'immunization' | 'growth' | 'patient';
    title: string;
    description?: string;
    timestamp: Date;
    user?: {
        id: string;
        name: string;
        avatar?: string;
        role?: string;
    };
    patient?: {
        id: string;
        name: string;
        age?: string;
    };
    action?: string;
    priority?: 'low' | 'medium' | 'high';
    link?: string;
}

interface ActivityFeedProps {
    items: ActivityItem[];
    emptyMessage?: string;
    className?: string;
    maxItems?: number;
    showPatientInfo?: boolean;
    compact?: boolean;
}

const typeIcons: Record<ActivityItem['type'], LucideIcon> = {
    appointment: Calendar,
    medical: FileText,
    prescription: Pill,
    immunization: HeartPulse,
    growth: Activity,
    patient: Baby
};

const typeColors: Record<ActivityItem['type'], string> = {
    appointment: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    medical: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    prescription: 'bg-green-500/10 text-green-600 dark:text-green-400',
    immunization: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    growth: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    patient: 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
};

const priorityColors: Record<Exclude<ActivityItem['priority'], undefined>, string> = {
    low: 'bg-green-500/10 text-green-600 dark:text-green-400',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    high: 'bg-red-500/10 text-red-600 dark:text-red-400'
};

export function ActivityFeed({
    items,
    emptyMessage = 'No recent activity',
    className,
    maxItems = 10,
    showPatientInfo = true,
    compact = false
}: ActivityFeedProps) {
    const router = useRouter();
    const displayedItems = maxItems ? items.slice(0, maxItems) : items;

    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const handleItemClick = (item: ActivityItem) => {
        if (item.link) {
            router.push(item.link);
        }
    };

    if (displayedItems.length === 0) {
        return (
            <div className={cn('py-8 text-center', className)}>
                <div className='mx-auto max-w-xs'>
                    <Activity className='mx-auto h-12 w-12 text-muted-foreground/50' />
                    <p className='mt-4 text-muted-foreground text-sm'>{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('space-y-3', compact && 'space-y-2', className)}>
            {displayedItems.map((item, index) => {
                const Icon = typeIcons[item.type];
                const isClickable = !!item.link;

                return (
                    <div
                        className={cn(
                            'group relative flex gap-3 rounded-lg border border-border bg-card p-4 transition-all',
                            !compact && 'hover:border-primary/50 hover:shadow-sm',
                            isClickable && 'cursor-pointer hover:bg-accent/50'
                        )}
                        key={item.id}
                        onClick={() => isClickable && handleItemClick(item)}
                        onKeyDown={e => {
                            if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
                                e.preventDefault();
                                handleItemClick(item);
                            }
                        }}
                        role={isClickable ? 'button' : undefined}
                        tabIndex={isClickable ? 0 : undefined} // focusable if clickable
                    >
                        {/* Timeline indicator for first item */}
                        {index === 0 && <div className='absolute -top-2 left-6 h-2 w-2 rounded-full bg-primary' />}

                        {/* Icon */}
                        <div className='relative shrink-0'>
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-full',
                                    typeColors[item.type]
                                )}
                            >
                                <Icon className='h-4 w-4' />
                            </div>
                            {item.priority && !compact && (
                                <div
                                    className={cn(
                                        'absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-background',
                                        priorityColors[item.priority]
                                    )}
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div className='min-w-0 flex-1'>
                            <div className='flex items-start justify-between'>
                                <div className='space-y-1'>
                                    <p className={cn('font-medium text-sm leading-tight', compact && 'text-xs')}>
                                        {item.title}
                                    </p>
                                    {item.description && !compact && (
                                        <p className='line-clamp-2 text-muted-foreground text-sm'>{item.description}</p>
                                    )}
                                </div>
                                {item.priority && compact && (
                                    <Badge
                                        className={cn('font-normal text-xs', priorityColors[item.priority])}
                                        variant='outline'
                                    >
                                        {item.priority}
                                    </Badge>
                                )}
                            </div>

                            {/* Metadata */}
                            <div className='mt-2 flex flex-wrap items-center gap-2'>
                                {/* User info */}
                                {item.user && (
                                    <div className='flex items-center gap-1.5'>
                                        <Avatar className='h-5 w-5'>
                                            <AvatarImage src={item.user.avatar} />
                                            <AvatarFallback className='text-[10px]'>
                                                {item.user.name
                                                    ?.split(' ')
                                                    .map(n => n[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className='text-muted-foreground text-xs'>{item.user.name}</span>
                                        {item.user.role && !compact && (
                                            <Badge
                                                className='text-[10px]'
                                                variant='outline'
                                            >
                                                {item.user.role}
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                {/* Patient info */}
                                {item.patient && showPatientInfo && (
                                    <>
                                        <span className='text-muted-foreground text-xs'>•</span>
                                        <div className='flex items-center gap-1.5'>
                                            <Baby className='h-3 w-3 text-muted-foreground' />
                                            <span className='text-muted-foreground text-xs'>
                                                {item.patient.name}
                                                {item.patient.age && ` • ${item.patient.age}`}
                                            </span>
                                        </div>
                                    </>
                                )}

                                {/* Time */}
                                <span className='text-muted-foreground text-xs'>• {getTimeAgo(item.timestamp)}</span>
                            </div>

                            {/* Action badge */}
                            {item.action && !compact && (
                                <Badge
                                    className='mt-2 font-normal text-xs'
                                    variant='secondary'
                                >
                                    {item.action}
                                </Badge>
                            )}
                        </div>

                        {/* Click indicator */}
                        {isClickable && !compact && (
                            <div className='opacity-0 transition-opacity group-hover:opacity-100'>
                                <Stethoscope className='h-4 w-4 text-muted-foreground' />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
