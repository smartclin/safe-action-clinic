import { NewPatient } from '@/components/new-patient';
import { getUser } from '@/lib/auth/server';
import { getPatientById } from '@/utils/services/patient';

const Registration = async () => {
    const user = await getUser();
    const userId = user?.id;

    const { data } = await getPatientById(userId ?? '');

    return (
        <div className='flex h-full w-full justify-center'>
            <div className='relative w-full max-w-6xl pb-10'>
                <NewPatient
                    data={data || undefined}
                    type={!data ? 'create' : 'update'}
                />
            </div>
        </div>
    );
};

export default Registration;
