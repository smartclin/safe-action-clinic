// src/components/dashboard/stats-grid.tsx
import type { ReactNode } from 'react';

interface StatsGridProps {
    children: ReactNode;
    columns?: number;
}

export function StatsGrid({ children, columns = 4 }: StatsGridProps) {
    const gridCols =
        {
            1: 'grid-cols-1',
            2: 'grid-cols-2',
            3: 'grid-cols-3',
            4: 'grid-cols-4',
            5: 'grid-cols-5',
            6: 'grid-cols-6'
        }[columns] || 'grid-cols-4';

    return <div className={`grid gap-4 ${gridCols}`}>{children}</div>;
}
