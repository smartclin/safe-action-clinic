'use client';

import { Activity, Clock, Stethoscope, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { StatsCard, StatsGrid } from '@/components/dashboard';

interface StaffStats {
    total: number;
    active: number;
    doctors: number;
    onDuty: number;
    averageTenure: string;
    turnoverRate: string;
}

interface StaffStatsProps {
    stats: StaffStats;
}

export function StaffStats({ stats }: StaffStatsProps) {
    const router = useRouter();

    return (
        <StatsGrid columns={4}>
            <StatsCard
                description='All clinic personnel'
                icon={Users}
                onClick={() => router.push('/staff?filter=all')}
                title='Total Staff'
                trend={{ value: 12, label: '+12% from last month' }}
                value={stats.total}
                variant='primary'
            />
            <StatsCard
                badge={`${stats.active} active`}
                description='Medical practitioners'
                icon={Stethoscope}
                onClick={() => router.push('/staff?role=DOCTOR&status=ACTIVE')}
                title='Active Doctors'
                value={stats.doctors}
                variant='success'
            />
            <StatsCard
                description='Currently working'
                icon={Activity}
                onClick={() => router.push('/staff?status=ON_DUTY')}
                title='On Duty'
                trend={{ value: -5, label: '5 less than yesterday' }}
                value={stats.onDuty}
                variant='warning'
            />
            <StatsCard
                description='Years with clinic'
                icon={Clock}
                onClick={() => router.push('/staff?sort=tenure')}
                title='Avg. Tenure'
                trend={{ value: 8, label: '+8% retention rate' }}
                value={stats.averageTenure}
                variant='default'
            />
        </StatsGrid>
    );
}
