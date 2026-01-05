import { format } from 'date-fns';
import { headers } from 'next/headers';
import Link from 'next/link';

import { MedicalHistoryContainer } from '@/components/medical-history-container';
import { PatientRatingContainer } from '@/components/patient-rating-container';
import { ProfileImage } from '@/components/profile-image';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getPatientFullDataById } from '@/utils/services/patient';

interface ParamsProps {
    params: Promise<{ patientId: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PatientProfile = async (props: ParamsProps) => {
    const searchParams = await props.searchParams;
    const params = await props.params;

    let id = params.patientId;
    const patientId = params.patientId;
    const cat = searchParams?.cat || 'medical-history';

    if (patientId === 'self') {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        const userId = session?.user?.id;
        id = userId ?? '';
    } else id = patientId;

    const { data } = await getPatientFullDataById(id);

    const SmallCard = ({ label, value }: { label: string; value: string }) => (
        <div className='w-full md:w-1/3'>
            <span className='text-gray-500 text-sm'>{label}</span>
            <p className='text-sm capitalize md:text-base'>{value}</p>
        </div>
    );

    return (
        <div className='flex h-full flex-col gap-6 rounded-xl bg-gray-100/60 px-3 py-6 lg:flex-row 2xl:p-6'>
            <div className='w-full xl:w-3/4'>
                <div className='flex w-full flex-col gap-4 lg:flex-row'>
                    <Card className='flex w-full flex-col items-center rounded-xl border-none bg-white p-4 lg:w-[30%]'>
                        <ProfileImage
                            bgColor={data?.colorCode ?? ''}
                            className='h-20 w-20 md:flex'
                            name={`${data?.firstName} ${data?.lastName}`}
                            textClassName='text-3xl'
                            url={data?.image ?? ''}
                        />
                        <h1 className='mt-2 font-semibold text-2xl'>{`${data?.firstName} ${data?.lastName}`}</h1>
                        <span className='text-gray-500 text-sm'>{data?.email}</span>

                        <div className='mt-4 flex w-full items-center justify-center gap-2'>
                            <div className='w-1/2 space-y-1 text-center'>
                                <p className='font-medium text-xl'>{data?.totalAppointments}</p>
                                <span className='text-gray-500 text-xs'>Appointments</span>
                            </div>
                        </div>
                    </Card>

                    <Card className='w-full space-y-6 rounded-xl border-none bg-white p-6 lg:w-[70%]'>
                        <div className='flex flex-col gap-y-4 md:flex-row md:flex-wrap md:items-center md:gap-x-0 xl:justify-between'>
                            <SmallCard
                                label={'Gender'}
                                value={data?.gender?.toLowerCase() ?? ''}
                            />
                            <SmallCard
                                label='Date of Birth'
                                value={format(data?.dateOfBirth ?? '', 'yyyy-MM-dd')}
                            />
                            <SmallCard
                                label={'Phone Number'}
                                value={data?.phone ?? ''}
                            />
                        </div>

                        <div className='flex flex-col gap-y-4 md:flex-row md:flex-wrap md:items-center md:gap-x-0 xl:justify-between'>
                            <SmallCard
                                label='Marital Status'
                                value={data?.maritalStatus ?? ''}
                            />
                            <SmallCard
                                label='Blood Group'
                                value={data?.bloodGroup ?? ''}
                            />
                            <SmallCard
                                label='Address'
                                value={data?.address ?? ''}
                            />
                        </div>

                        <div className='flex flex-col gap-y-4 md:flex-row md:flex-wrap md:items-center md:gap-x-0 xl:justify-between'>
                            <SmallCard
                                label='Contact Person'
                                value={data?.emergencyContactName ?? ''}
                            />
                            <SmallCard
                                label='Emergency Contact'
                                value={data?.emergencyContactNumber ?? ''}
                            />
                            <SmallCard
                                label='Last Visit'
                                value={data?.lastVisit ? format(data?.lastVisit, 'yyyy-MM-dd') : 'No last visit'}
                            />
                        </div>
                    </Card>
                </div>

                <div className='mt-10'>
                    {cat === 'medical-history' && <MedicalHistoryContainer patientId={id} />}

                    {/* {cat === "payments" && <Payments patientId={id!} />} */}
                </div>
            </div>

            <div className='w-full xl:w-1/3'>
                <div className='mb-8 rounded-md bg-white p-4'>
                    <h1 className='font-semibold text-xl'>Quick Links</h1>

                    <div className='mt-4 flex flex-wrap gap-4 text-gray-500 text-xs'>
                        <Link
                            className='rounded-md bg-yellow-50 p-3 hover:underline'
                            href={`/record/appointments?id=${id}`}
                        >
                            Patient&apos;s Appointments
                        </Link>
                        <Link
                            className='rounded-md bg-purple-50 p-3 hover:underline'
                            href='?cat=medical-history'
                        >
                            Medical Records
                        </Link>
                        <Link
                            className='rounded-md bg-violet-100 p-3'
                            href={'?cat=payments'}
                        >
                            Medical Bills
                        </Link>
                        <Link
                            className='rounded-md bg-pink-50 p-3'
                            href={'/'}
                        >
                            Dashboard
                        </Link>

                        <Link
                            className='rounded-md bg-rose-100 p-3'
                            href={'#'}
                        >
                            Lab Test & Result
                        </Link>
                        {patientId === 'self' && (
                            <Link
                                className='rounded-md bg-black/10 p-3'
                                href={'/patient/registration'}
                            >
                                Edit Information
                            </Link>
                        )}
                    </div>
                </div>

                <PatientRatingContainer patientId={id ?? ''} />
            </div>
        </div>
    );
};

export default PatientProfile;
