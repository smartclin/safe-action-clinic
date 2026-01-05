import { format } from 'date-fns';
import { ReceiptText } from 'lucide-react';

import { ActionDialog } from '@/components/action-dialog';
import { ViewAction } from '@/components/action-options';
import { Pagination } from '@/components/pagination';
import { ProfileImage } from '@/components/profile-image';
import SearchInput from '@/components/search-input';
import { Table } from '@/components/tables/table';
import { cn } from '@/lib/utils';
import type { Patient, Payment, SearchParamsProps } from '@/types';
import { checkRole } from '@/utils/roles';
import { DATA_LIMIT } from '@/utils/seetings';
import { getPaymentRecords } from '@/utils/services/payments';

// Define the correct type for your payment data
interface PaymentWithPatient extends Omit<Payment, 'patient'> {
    patient: Patient | null;
    // Add the missing property if it exists in your data
    payable?: number | string | null;
}

const columns = [
    {
        header: 'RNO',
        key: 'id' as const
    },
    {
        header: 'Patient',
        key: 'info' as const,
        className: ''
    },
    {
        header: 'Contact',
        key: 'phone' as const,
        className: 'hidden md:table-cell'
    },
    {
        header: 'Bill Date',
        key: 'billDate' as const,
        className: 'hidden md:table-cell'
    },
    {
        header: 'Total',
        key: 'totalAmount' as const,
        className: 'hidden xl:table-cell'
    },
    {
        header: 'Discount',
        key: 'discount' as const,
        className: 'hidden xl:table-cell'
    },
    {
        header: 'Payable',
        key: 'payable' as const,
        className: 'hidden xl:table-cell'
    },
    {
        header: 'Paid',
        key: 'amountPaid' as const,
        className: 'hidden xl:table-cell'
    },
    {
        header: 'Status',
        key: 'status' as const,
        className: 'hidden xl:table-cell'
    },
    {
        header: 'Actions',
        key: 'action' as const
    }
];

const BillingPage = async (props: SearchParamsProps) => {
    const searchParams = await props.searchParams;
    const page = (searchParams?.p || '1') as string;
    const searchQuery = (searchParams?.q || '') as string;

    const { data, totalPages, totalRecords, currentPage } = await getPaymentRecords({
        page,
        search: searchQuery
    });
    const isAdmin = await checkRole('ADMIN');

    if (!data) return null;

    const toNumber = (value: number | string | { toNumber: () => number } | null | undefined): number => {
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return value;
        if (typeof value === 'string') return Number(value) || 0;

        if (typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
            return value.toNumber();
        }

        return Number(value) || 0;
    };

    const calculatePayable = (item: PaymentWithPatient): number => {
        const total = toNumber(item?.totalAmount);
        const discount = toNumber(item?.discount);
        return total - discount;
    };

    const renderRow = (item: PaymentWithPatient) => {
        const name = `${item?.patient?.firstName || ''} ${item?.patient?.lastName || ''}`.trim();
        const patient = item?.patient;

        return (
            <tr
                className='border-gray-200 border-b text-sm even:bg-slate-50 hover:bg-slate-50'
                key={`${item?.id}-${patient?.id || item.id}`}
            >
                <td># {item?.receiptNumber || item?.id?.substring(0, 8)}</td>
                <td className='flex items-center gap-4 p-4'>
                    <ProfileImage
                        bgColor={patient?.colorCode || ''}
                        name={name}
                        textClassName='text-black'
                        url={patient?.image || ''}
                    />
                    <div>
                        <h3 className='uppercase'>{name || 'Unknown Patient'}</h3>
                        <span className='text-sm capitalize'>{patient?.gender?.toLowerCase() || 'N/A'}</span>
                    </div>
                </td>
                <td className='hidden md:table-cell'>{patient?.phone || 'N/A'}</td>
                <td className='hidden md:table-cell'>
                    {item?.billDate ? format(new Date(item.billDate), 'yyyy-MM-dd') : 'N/A'}
                </td>
                <td className='hidden xl:table-cell'>{toNumber(item?.totalAmount).toFixed(2)}</td>
                <td className='hidden xl:table-cell'>{toNumber(item?.discount).toFixed(2)}</td>
                <td className='hidden xl:table-cell'>
                    {/* Use payable from item if it exists, otherwise calculate it */}
                    {item?.payable ? toNumber(item.payable).toFixed(2) : calculatePayable(item).toFixed(2)}
                </td>
                <td className='hidden xl:table-cell'>{toNumber(item?.amountPaid).toFixed(2)}</td>
                <td className='hidden xl:table-cell'>
                    <span
                        className={cn(
                            'rounded-full px-2 py-1 font-medium text-xs',
                            item?.status === 'UNPAID'
                                ? 'bg-red-100 text-red-800'
                                : item?.status === 'PAID'
                                  ? 'bg-green-100 text-green-800'
                                  : item?.status === 'PARTIAL'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                        )}
                    >
                        {item?.status || 'UNKNOWN'}
                    </span>
                </td>

                <td>
                    <div className='flex items-center gap-2'>
                        <ViewAction href={`/appointments/${item?.appointmentId}?cat=bills`} />

                        {isAdmin && (
                            <ActionDialog
                                deleteType='payment'
                                id={item?.id}
                                type='delete'
                            />
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className='rounded-xl bg-white px-3 py-6 2xl:px-6'>
            <div className='flex items-center justify-between'>
                <div className='hidden items-center gap-1 lg:flex'>
                    <ReceiptText
                        className='text-gray-500'
                        size={20}
                    />

                    <p className='font-semibold text-2xl'>{totalRecords}</p>
                    <span className='text-gray-600 text-sm xl:text-base'>total records</span>
                </div>
                <div className='flex w-full items-center justify-between gap-2 lg:w-fit lg:justify-start'>
                    <SearchInput />
                </div>
            </div>

            <div className='mt-4'>
                <Table<PaymentWithPatient>
                    columns={columns}
                    data={data as PaymentWithPatient[]}
                    renderRow={renderRow}
                />

                <Pagination
                    currentPage={currentPage}
                    limit={DATA_LIMIT}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                />
            </div>
        </div>
    );
};

export default BillingPage;
