// components/service-status-badge.tsx
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface ServiceStatusBadgeProps {
    isAvailable?: boolean;
    category?: string;
}

export function ServiceStatusBadge({ isAvailable, category }: ServiceStatusBadgeProps) {
    if (isAvailable === false) {
        return (
            <div className='inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 font-medium text-red-800 text-xs'>
                <XCircle className='h-3 w-3' />
                Unavailable
            </div>
        );
    }

    if (category === 'VACCINATION') {
        return (
            <div className='inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-xs'>
                <CheckCircle className='h-3 w-3' />
                Available
            </div>
        );
    }

    return (
        <div className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-xs'>
            <Clock className='h-3 w-3' />
            By Appointment
        </div>
    );
}
