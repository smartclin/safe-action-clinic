// src/components/dashboard/stats-card.tsx
import type { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        label: string;
    };
}

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='font-medium text-sm'>{title}</CardTitle>
                <Icon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
                <div className='font-bold text-2xl'>{value}</div>
                {trend && (
                    <p className='text-muted-foreground text-xs'>
                        <span className={trend.value > 0 ? 'text-green-600' : 'text-red-600'}>
                            {trend.value > 0 ? '+' : ''}
                            {trend.value}%
                        </span>{' '}
                        {trend.label}
                    </p>
                )}
                {description && <p className='mt-1 text-muted-foreground text-xs'>{description}</p>}
            </CardContent>
        </Card>
    );
}
