import { Beaker } from 'lucide-react';

import { getLabTests } from '@/actions/medical';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/utils';

interface LabTestsContainerProps {
    medicalId: string;
}

export const LabTestsContainer = async ({ medicalId }: LabTestsContainerProps) => {
    const labTests = await getLabTests(medicalId);

    if (labTests.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Lab Tests</CardTitle>
                    <CardDescription>No lab tests found</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col items-center justify-center py-8 text-center'>
                        <Beaker className='h-12 w-12 text-muted-foreground/50' />
                        <p className='mt-4 text-muted-foreground'>
                            No lab tests have been recorded for this medical record.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-lg'>Lab Tests ({labTests.length})</h3>
                <Badge variant='outline'>{labTests.filter(t => t.status === 'COMPLETED').length} Completed</Badge>
            </div>

            {labTests.map(test => (
                <Card key={test.id}>
                    <CardHeader>
                        <div className='flex items-start justify-between'>
                            <div>
                                <CardTitle className='flex items-center gap-2 text-base'>
                                    <Beaker className='h-4 w-4' />
                                    {test.service?.serviceName || 'Lab Test'}
                                </CardTitle>
                                <CardDescription>Test Date: {formatDateTime(test.testDate)}</CardDescription>
                            </div>
                            <Badge
                                variant={
                                    test.status === 'COMPLETED'
                                        ? 'default'
                                        : test.status === 'PENDING'
                                          ? 'secondary'
                                          : 'destructive'
                                }
                            >
                                {test.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <h4 className='font-medium text-sm'>Result</h4>
                            <p className='text-muted-foreground text-sm'>{test.result || 'No result available'}</p>
                        </div>

                        {test.notes && (
                            <div>
                                <h4 className='font-medium text-sm'>Notes</h4>
                                <p className='text-muted-foreground text-sm'>{test.notes}</p>
                            </div>
                        )}

                        <div className='border-t pt-2'>
                            <div className='flex items-center justify-between text-sm'>
                                <span className='text-muted-foreground'>Service ID:</span>
                                <span>{test.serviceId.slice(0, 8)}...</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
