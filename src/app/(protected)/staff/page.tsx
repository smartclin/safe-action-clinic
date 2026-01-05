import { Suspense } from 'react';

import { getStaffList } from '@/actions/admin';
import { getStaffStats } from '@/actions/staff';
import { StaffActions } from '@/app/(protected)/staff/actions';
import PageHeader from '@/components/page-header';
import { StaffList } from '@/components/staff/list';
import { StaffStats } from '@/components/staff/staff-stat';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
    return (
        <div className='space-y-6'>
            <PageHeader
                action={<StaffActions />}
                description='Manage clinic staff, doctors, and administrative personnel'
                title='Staff Management'
            />

            {/* Statistics */}
            <Suspense fallback={<StaffStatsSkeleton />}>
                <StaffStatsSection />
            </Suspense>

            {/* Staff List */}
            <Suspense fallback={<StaffListSkeleton />}>
                <StaffListSection />
            </Suspense>
        </div>
    );
}

async function StaffStatsSection() {
    const stats = await getStaffStats();
    return <StaffStats stats={stats} />;
}

async function StaffListSection() {
    const { staff, pagination } = await getStaffList({ page: 1, limit: 20 });
    return (
        <StaffList
            initialPagination={pagination}
            initialStaff={staff}
        />
    );
}

function StaffStatsSkeleton() {
    return (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i.valueOf()}>
                    <CardContent className='p-6'>
                        <div className='space-y-2'>
                            <Skeleton className='h-4 w-32' />
                            <Skeleton className='h-8 w-20' />
                            <Skeleton className='h-3 w-24' />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function StaffListSkeleton() {
    return (
        <Card>
            <CardContent className='p-6'>
                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <Skeleton className='h-8 w-48' />
                        <Skeleton className='h-9 w-32' />
                    </div>
                    <div className='space-y-3'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton
                                className='h-12 w-full'
                                key={i.valueOf()}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
