import { Activity, Baby, Microscope, Pill, Stethoscope, Syringe } from 'lucide-react';

import { DeleteService, EditService } from '@/components/dialogs/edit-service';
import { ServiceStatusBadge } from '@/components/ervice-status-badge';
import { Table } from '@/components/tables/table';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import type { Clinic, Service } from '@/types';
import { checkRole } from '@/utils/roles';
import { getClinics, getServices } from '@/utils/services/admin';

import { AddService } from '../dialogs/add-service';

// Service category icons mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    CONSULTATION: <Stethoscope className='h-4 w-4' />,
    VACCINATION: <Syringe className='h-4 w-4' />,
    LAB_TEST: <Microscope className='h-4 w-4' />,
    PHARMACY: <Pill className='h-4 w-4' />,
    PROCEDURE: <Activity className='h-4 w-4' />,
    DIAGNOSIS: <Stethoscope className='h-4 w-4' />,
    OTHER: <Baby className='h-4 w-4' />
};

const CATEGORY_COLORS: Record<string, string> = {
    CONSULTATION: 'bg-blue-100 text-blue-800',
    VACCINATION: 'bg-green-100 text-green-800',
    LAB_TEST: 'bg-purple-100 text-purple-800',
    PHARMACY: 'bg-orange-100 text-orange-800',
    PROCEDURE: 'bg-red-100 text-red-800',
    DIAGNOSIS: 'bg-indigo-100 text-indigo-800',
    OTHER: 'bg-gray-100 text-gray-800'
};

const columns = [
    {
        header: 'Service Name',
        key: 'serviceName' as const,
        className: ''
    },
    {
        header: 'Category',
        key: 'category' as const,
        className: 'hidden lg:table-cell'
    },
    {
        header: 'Price',
        key: 'price' as const,
        className: 'hidden md:table-cell'
    },
    {
        header: 'Duration',
        key: 'duration' as const,
        className: 'hidden xl:table-cell'
    },
    {
        header: 'Clinic',
        key: 'clinic' as const,
        className: 'hidden 2xl:table-cell'
    },
    {
        header: 'Status',
        key: 'isAvailable' as const,
        className: 'hidden lg:table-cell'
    },
    {
        header: 'Actions',
        key: 'actions' as const,
        className: 'w-24'
    }
];

export const ServiceSettings = async () => {
    const { data: services } = await getServices();
    const { data: clinics } = await getClinics();
    const isAdmin = await checkRole('ADMIN');
    const isClinicAdmin = await checkRole('ADMIN');

    const renderRow = (item: Service & { clinic?: Clinic }) => {
        const category = item.category || 'OTHER';
        const icon = CATEGORY_ICONS[category] || <Baby className='h-4 w-4' />;
        const colorClass = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-800';

        return (
            <tr
                className='border-gray-200 border-b text-sm even:bg-slate-50 hover:bg-slate-50'
                key={item.id}
            >
                {/* Service Name with Category Icon */}
                <td className='py-4 pl-4'>
                    <div className='flex items-center gap-3'>
                        <div className={`rounded-full p-2 ${colorClass}`}>{icon}</div>
                        <div>
                            <div className='font-medium'>{item.serviceName}</div>
                            <div className='text-gray-500 text-xs md:hidden'>
                                {formatCurrency(item.price || 0)} • {item.duration || 30} mins
                            </div>
                        </div>
                    </div>
                </td>

                {/* Category */}
                <td className='hidden lg:table-cell'>
                    <Badge
                        className={`gap-1 ${colorClass} border-0`}
                        variant='outline'
                    >
                        {icon}
                        {category.replace('_', ' ')}
                    </Badge>
                </td>

                {/* Duration */}
                <td className='hidden xl:table-cell'>
                    <div className='flex items-center gap-2'>
                        <div className='font-medium'>{item.duration || 30} min</div>
                        {item.duration && item.duration > 60 && (
                            <Badge
                                className='text-xs'
                                variant='outline'
                            >
                                Extended
                            </Badge>
                        )}
                    </div>
                </td>

                {/* Clinic */}
                <td className='hidden 2xl:table-cell'>
                    {item.clinic ? (
                        <div className='max-w-[200px]'>
                            <div className='truncate font-medium'>{item.clinic.name}</div>
                            <div className='truncate text-gray-500 text-xs'>{item.clinic.email}</div>
                        </div>
                    ) : (
                        <span className='text-gray-400'>All Clinics</span>
                    )}
                </td>

                {/* Status */}
                <td className='hidden lg:table-cell'>
                    <ServiceStatusBadge
                        category={category}
                        isAvailable={item.isAvailable ?? true}
                    />
                </td>

                {/* Actions */}
                <td>
                    {isClinicAdmin && (
                        <div className='flex items-center gap-2'>
                            <EditService
                                clinics={clinics || []}
                                service={item}
                            />
                            {isAdmin && (
                                <DeleteService
                                    serviceId={item.id}
                                    serviceName={item.serviceName}
                                />
                            )}
                        </div>
                    )}
                </td>
            </tr>
        );
    };

    // Filter services by pediatric relevance
    const pediatricServices =
        services?.filter(
            service => service.category && ['VACCINATION', 'CONSULTATION', 'LAB_TEST'].includes(service.category)
        ) || [];

    // Calculate statistics
    const stats = {
        total: services?.length || 0,
        pediatric: pediatricServices.length,
        averagePrice:
            services?.reduce((acc, service) => acc + (Number(service.price) || 0), 0) / (services?.length || 1),
        activeServices: services?.filter(s => s.isAvailable !== false).length || 0
    };

    return (
        <>
            <CardHeader className='flex flex-row items-center justify-between'>
                <div>
                    <CardTitle className='capitalize'>Pediatric Services</CardTitle>
                    <CardDescription>
                        Manage pediatric-specific services including vaccinations, consultations, and lab tests.
                        {stats.pediatric > 0 && (
                            <span className='ml-2 text-green-600'>{stats.pediatric} pediatric services available</span>
                        )}
                    </CardDescription>

                    {/* Quick Stats */}
                    <div className='mt-4 flex flex-wrap gap-4'>
                        <div className='rounded-lg bg-blue-50 px-3 py-2'>
                            <div className='text-blue-600 text-sm'>Total Services</div>
                            <div className='font-bold text-2xl text-blue-700'>{stats.total}</div>
                        </div>
                        <div className='rounded-lg bg-green-50 px-3 py-2'>
                            <div className='text-green-600 text-sm'>Pediatric Focus</div>
                            <div className='font-bold text-2xl text-green-700'>{stats.pediatric}</div>
                        </div>
                        <div className='rounded-lg bg-purple-50 px-3 py-2'>
                            <div className='text-purple-600 text-sm'>Avg. Price</div>
                            <div className='font-bold text-2xl text-purple-700'>
                                {formatCurrency(stats.averagePrice)}
                            </div>
                        </div>
                        <div className='rounded-lg bg-amber-50 px-3 py-2'>
                            <div className='text-amber-600 text-sm'>Active</div>
                            <div className='font-bold text-2xl text-amber-700'>{stats.activeServices}</div>
                        </div>
                    </div>
                </div>

                {isClinicAdmin && <AddService clinics={clinics || []} />}
            </CardHeader>

            <CardContent>
                <div className='mb-4 flex items-center justify-between'>
                    <div className='text-gray-600 text-sm'>
                        Showing {services?.length || 0} services
                        {stats.pediatric > 0 && (
                            <span className='ml-2'>
                                • <span className='font-semibold text-green-600'>{stats.pediatric}</span>{' '}
                                pediatric-specific
                            </span>
                        )}
                    </div>

                    {/* Quick Filter Buttons */}
                    <div className='flex gap-2'>
                        <button
                            className='rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-xs hover:bg-blue-200'
                            type='button'
                        >
                            All Services
                        </button>
                        <button
                            className='rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 text-xs hover:bg-green-200'
                            type='button'
                        >
                            Vaccinations
                        </button>
                        <button
                            className='rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-700 text-xs hover:bg-purple-200'
                            type='button'
                        >
                            Lab Tests
                        </button>
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={services || []}
                    emptyState={
                        <div className='py-12 text-center'>
                            <Baby className='mx-auto h-12 w-12 text-gray-400' />
                            <h3 className='mt-2 font-semibold text-gray-900 text-sm'>No pediatric services</h3>
                            <p className='mt-1 text-gray-500 text-sm'>
                                Get started by adding pediatric-specific services like vaccinations and child
                                consultations.
                            </p>
                            {isClinicAdmin && (
                                <div className='mt-6'>
                                    <AddService
                                        clinics={clinics || []}
                                        variant='button'
                                    />
                                </div>
                            )}
                        </div>
                    }
                    renderRow={renderRow}
                />

                {/* Pediatric Service Recommendations */}
                {pediatricServices.length === 0 && services && services.length > 0 && (
                    <div className='mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4'>
                        <div className='flex items-start gap-3'>
                            <Baby className='h-5 w-5 text-amber-600' />
                            <div>
                                <h4 className='font-medium text-amber-900'>Add Pediatric-Specific Services</h4>
                                <p className='mt-1 text-amber-800 text-sm'>
                                    Consider adding pediatric-focused services like child vaccinations, growth
                                    monitoring, developmental assessments, and pediatric lab tests to better serve your
                                    young patients.
                                </p>
                                <div className='mt-3 grid grid-cols-2 gap-2 text-sm'>
                                    <div className='rounded bg-white px-3 py-2'>• Child Vaccinations</div>
                                    <div className='rounded bg-white px-3 py-2'>• Growth Chart Analysis</div>
                                    <div className='rounded bg-white px-3 py-2'>• Developmental Screening</div>
                                    <div className='rounded bg-white px-3 py-2'>• Pediatric Blood Tests</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </>
    );
};
