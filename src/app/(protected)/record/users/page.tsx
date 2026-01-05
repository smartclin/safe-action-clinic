import { BriefcaseBusiness } from 'lucide-react';

import { getUserList } from '@/actions/user';
import { Table } from '@/components/tables/table';

const columns = [
    {
        header: 'user ID',
        key: 'id',
        className: 'hidden lg:table-cell'
    },
    {
        header: 'Name',
        key: 'name'
    },
    {
        header: 'Email',
        key: 'email',
        className: 'hidden md:table-cell'
    },
    {
        header: 'Role',
        key: 'role'
    },
    {
        header: 'Status',
        key: 'status'
    },
    {
        header: 'Last Login',
        key: 'last_login',
        className: 'hidden xl:table-cell'
    }
];

interface UserProps {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string | null;
}
const UserPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { users, pagination } = await getUserList({
        page: Number(searchParams.page) || 1,
        limit: Number(searchParams.limit) || 20,
        search: searchParams.search || '',
        role: searchParams.role || 'patient'
    });

    if (!users) return null;

    const renderRow = (item: UserProps) => (
        <tr
            className='border-gray-200 border-b text-base even:bg-slate-50 hover:bg-slate-50'
            key={item.id}
        >
            <td className='hidden items-center lg:table-cell'>{item?.id}</td>
            <td className='table-cell py-2 xl:py-4'>{item?.name}</td>
            <td className='table-cell'>{item?.email}</td>
            <td className='table-cell capitalize'>{item?.role}</td>
            <td className='hidden capitalize md:table-cell'>Active</td>
        </tr>
    );
    return (
        <div className='rounded-xl bg-white p-2 md:p-4 2xl:p-6'>
            <div className='flex items-center justify-between'>
                <div className='hidden items-center gap-1 lg:flex'>
                    <BriefcaseBusiness
                        className='text-gray-500'
                        size={20}
                    />

                    <p className='font-semibold text-2xl'>{pagination.total}</p>
                    <span className='text-gray-600 text-sm xl:text-base'>total users</span>
                </div>
            </div>

            <div>
                <Table
                    columns={columns}
                    data={users}
                    renderRow={renderRow}
                />
            </div>
        </div>
    );
};

export default UserPage;
