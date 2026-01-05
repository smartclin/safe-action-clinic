import { format } from 'date-fns';
import { BriefcaseBusiness } from 'lucide-react';
import { headers } from 'next/headers';

import { AppointmentActionOptions } from '@/components/appointment-actions';
import { AppointmentContainer } from '@/components/appointment-container';
import { AppointmentStatusIndicator } from '@/components/appointment-status-indicator';
import { Pagination } from '@/components/pagination';
import { ProfileImage } from '@/components/profile-image';
import SearchInput from '@/components/search-input';
import { Table } from '@/components/tables/table';
import { ViewAppointment } from '@/components/view-appointment';
import { auth } from '@/lib/auth'; // Your Better Auth instance
import type { AppointmentStatus, Gender } from '@/types';
import { checkRole, getRole } from '@/utils/roles';
import { DATA_LIMIT } from '@/utils/seetings';
import { getPatientAppointments } from '@/utils/services/appointment';

const columns = [
    {
        header: 'Info',
        key: 'name'
    },
    {
        header: 'Date',
        key: 'appointmentDate',
        className: 'hidden md:table-cell'
    },
    {
        header: 'Time',
        key: 'time',
        className: 'hidden md:table-cell'
    },
    {
        header: 'Doctor',
        key: 'doctor',
        className: 'hidden md:table-cell'
    },
    {
        header: 'Status',
        key: 'status',
        className: 'hidden xl:table-cell'
    },
    {
        header: 'Actions',
        key: 'action'
    }
];

interface DataProps {
    id: string;
    patientId: string | null;
    doctorId: string;
    appointmentDate: Date;
    time: string | null;
    status: AppointmentStatus | null;
    type: string;
    patient: {
        firstName: string;
        lastName: string;
        gender: Gender;
        colorCode: string | null;
        image: string | null;
    } | null;
    doctor: {
        name: string;
        specialty: string;
        img: string | null;
        colorCode: string | null;
    } | null;
}

const Appointments = async (props: {
    searchParams?: Promise<{
        [key: string]: string | undefined;
    }>;
}) => {
    const searchParams = await props.searchParams;
    const userRole = await getRole();

    // Get session using Better Auth server API
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const userId = session?.user?.id;
    const isPatient = await checkRole('patient');

    const page = (searchParams?.p || '1') as string;
    const searchQuery = searchParams?.q || '';
    const id = searchParams?.id || undefined;

    let queryId;

    if (userRole === 'admin' || (userRole === 'doctor' && id) || (userRole === 'staff' && id)) {
        queryId = id;
    } else if (userRole === 'doctor' || userRole === 'patient') {
        queryId = userId;
    } else if (userRole === 'staff') {
        queryId = undefined;
    }

    const { data, totalPages, totalRecord, currentPage } = await getPatientAppointments({
        page,
        search: searchQuery,
        id: queryId
    });

    if (!data) return null;

    const renderItem = (item: DataProps & { index: number }) => {
        const patientName = `${item.patient?.firstName} ${item.patient?.lastName}`;

        return (
            <tr
                className='border-gray-200 border-b text-sm even:bg-slate-50 hover:bg-slate-50'
                key={item?.id}
            >
                <td className='flex items-center gap-2 py-2 md:gap-4 xl:py-4'>
                    <ProfileImage
                        bgColor={item?.patient?.colorCode ?? ''}
                        name={patientName}
                        url={item?.patient?.image ?? ''}
                    />
                    <div>
                        <h3 className='font-semibold uppercase'>{patientName}</h3>
                        <span className='text-xs capitalize md:text-sm'>{item?.patient?.gender.toLowerCase()}</span>
                    </div>
                </td>

                <td className='hidden md:table-cell'>{format(item?.appointmentDate, 'yyyy-MM-dd')}</td>
                <td className='hidden md:table-cell'>{item.time}</td>

                <td className='hidden items-center py-2 md:table-cell'>
                    <div className='flex items-center gap-2 md:gap-4'>
                        <ProfileImage
                            bgColor={item?.doctor?.colorCode ?? ''}
                            name={item.doctor?.name ?? ''}
                            textClassName='text-black'
                            url={item.doctor?.img ?? ''}
                        />

                        <div>
                            <h3 className='font-semibold uppercase'>{item.doctor?.name}</h3>
                            <span className='text-xs capitalize md:text-sm'>{item.doctor?.specialty}</span>
                        </div>
                    </div>
                </td>

                <td className='hidden xl:table-cell'>
                    <AppointmentStatusIndicator status={item.status ?? 'CANCELLED'} />
                </td>
                <td>
                    <div className='flex items-center gap-2'>
                        <ViewAppointment id={item?.id.toString()} />
                        <AppointmentActionOptions
                            appointmentId={item.id}
                            doctorId={item.doctorId}
                            patientId={item.patientId}
                            status={item.status}
                            userId={userId ?? ''}
                        />
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className='rounded-xl bg-white p-2 md:p-4 2xl:p-6'>
            <div className='flex items-center justify-between'>
                <div className='hidden items-center gap-1 lg:flex'>
                    <BriefcaseBusiness
                        className='text-gray-500'
                        size={20}
                    />
                    <p className='font-semibold text-2xl'>{totalRecord ?? 0}</p>
                    <span className='text-gray-600 text-sm xl:text-base'>total appointments</span>
                </div>

                <div className='flex w-full items-center justify-between gap-2 lg:w-fit lg:justify-start'>
                    <SearchInput />

                    {isPatient && <AppointmentContainer id={userId ?? ''} />}
                </div>
            </div>

            <div className='mt-6'>
                <Table
                    columns={columns}
                    data={data}
                    renderRow={renderItem}
                />

                {data?.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        limit={DATA_LIMIT}
                        totalPages={totalPages}
                        totalRecords={totalRecord}
                    />
                )}
            </div>
        </div>
    );
};

export default Appointments;
