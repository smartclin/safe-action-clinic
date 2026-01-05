'use client';

import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface ViewActionProps {
    href: string;
    label?: string;
}

export const ViewAction = ({ href, label = 'View' }: ViewActionProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(href);
    };

    return (
        <Button
            className='text-xs'
            onClick={handleClick}
            size='sm'
            variant='ghost'
        >
            <Eye className='mr-1 h-3 w-3' />
            {label}
        </Button>
    );
};
