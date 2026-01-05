'use client';

import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
    key: keyof T | string;
    header: string;
    className?: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    emptyMessage?: string;
    className?: string;
    searchable?: boolean;
    selectable?: boolean;
    onRowClick?: (item: T) => void;
    actions?: React.ReactNode;
    pagination?: {
        page: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        pageSize?: number;
        totalItems?: number;
    };
}

export function DataTable<T extends { id: string | number }>({
    columns,
    data,
    emptyMessage = 'No data available',
    className,
    searchable = true,
    selectable = false,
    onRowClick,
    actions,
    pagination
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [currentPage, setCurrentPage] = useState(pagination?.page || 1);

    const getValue = (item: T, key: string): unknown => {
        return key.split('.').reduce<unknown>((obj, k) => {
            if (obj && typeof obj === 'object' && k in obj) {
                return (obj as Record<string, unknown>)[k];
            }
            return undefined;
        }, item);
    };

    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortColumn(null);
                setSortDirection(null);
            } else {
                setSortDirection('asc');
            }
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    const filteredData = data.filter(item => {
        if (!searchTerm) return true;

        return columns.some(column => {
            const value = getValue(item, String(column.key));
            return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn || !sortDirection) return 0;

        const aValue = getValue(a, sortColumn);
        const bValue = getValue(b, sortColumn);

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(data.map((_item, index) => String(index))));
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleSelectRow = (index: string, checked: boolean) => {
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(index);
        } else {
            newSelected.delete(index);
        }
        setSelectedRows(newSelected);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (pagination?.onPageChange) {
            pagination.onPageChange(page);
        }
    };

    const id = useId();

    return (
        <div className={cn('space-y-4', className)}>
            {/* Toolbar */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                {searchable && (
                    <div className='relative max-w-sm flex-1'>
                        <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <Input
                            className='pr-9 pl-9'
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder='Search...'
                            value={searchTerm}
                        />
                        {searchTerm && (
                            <Button
                                className='absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2'
                                onClick={() => setSearchTerm('')}
                                size='icon-sm'
                                variant='ghost'
                            >
                                <X className='h-3 w-3' />
                            </Button>
                        )}
                    </div>
                )}

                {actions && <div className='flex items-center gap-2'>{actions}</div>}
            </div>

            {/* Table */}
            <div className='overflow-hidden rounded-xl border border-border bg-card'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-border border-b bg-muted/50'>
                                {selectable && (
                                    <th className='w-12 px-4 py-3'>
                                        <input
                                            checked={selectedRows.size === data.length}
                                            className='h-4 w-4 rounded border-border'
                                            onChange={e => handleSelectAll(e.target.checked)}
                                            type='checkbox'
                                        />
                                    </th>
                                )}
                                {columns.map(column => (
                                    <th
                                        className={cn(
                                            'px-4 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider',
                                            column.className,
                                            column.sortable && 'cursor-pointer hover:bg-muted'
                                        )}
                                        key={String(column.key)}
                                        onClick={() => column.sortable && handleSort(String(column.key))}
                                        style={{ width: column.width }}
                                    >
                                        <div className='flex items-center gap-2'>
                                            {column.header}
                                            {column.sortable && sortColumn === String(column.key) && (
                                                <>
                                                    {sortDirection === 'asc' && <ChevronUp className='h-3 w-3' />}
                                                    {sortDirection === 'desc' && <ChevronDown className='h-3 w-3' />}
                                                </>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-border'>
                            {sortedData.length === 0 ? (
                                <tr>
                                    <td
                                        className='px-4 py-8 text-center text-muted-foreground text-sm'
                                        colSpan={columns.length + (selectable ? 1 : 0)}
                                    >
                                        <div className='flex flex-col items-center gap-2'>
                                            <Search className='h-8 w-8 text-muted-foreground/50' />
                                            <p>{emptyMessage}</p>
                                            {searchTerm && (
                                                <Button
                                                    className='mt-2'
                                                    onClick={() => setSearchTerm('')}
                                                    size='sm'
                                                    variant='ghost'
                                                >
                                                    Clear search
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((item, index) => (
                                    <tr
                                        className={cn(
                                            'transition-colors hover:bg-muted/30',
                                            onRowClick && 'cursor-pointer'
                                        )}
                                        key={`${id}-${item.id}`}
                                        onClick={() => onRowClick?.(item)}
                                    >
                                        {selectable && (
                                            <td className='px-4 py-3'>
                                                <input
                                                    checked={selectedRows.has(String(index))}
                                                    className='h-4 w-4 rounded border-border'
                                                    onChange={e => handleSelectRow(String(index), e.target.checked)}
                                                    onClick={e => e.stopPropagation()}
                                                    type='checkbox'
                                                />
                                            </td>
                                        )}
                                        {columns.map(column => (
                                            <td
                                                className={cn('px-4 py-3 text-sm', column.className)}
                                                key={String(column.key)}
                                            >
                                                {column.render ? (
                                                    column.render(item)
                                                ) : (
                                                    <div className='truncate'>
                                                        {String(getValue(item, String(column.key)) ?? '-')}
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className='flex items-center justify-between px-2'>
                    <div className='text-muted-foreground text-sm'>
                        Showing <span className='font-medium'>{pagination.page}</span> of{' '}
                        <span className='font-medium'>{pagination.totalPages}</span> pages
                        {pagination.totalItems && (
                            <>
                                {' '}
                                • <span className='font-medium'>{pagination.totalItems}</span> total items
                            </>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            size='sm'
                            variant='outline'
                        >
                            Previous
                        </Button>
                        <div className='flex items-center gap-1'>
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNumber;
                                if (pagination.totalPages <= 5) {
                                    pageNumber = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNumber = i + 1;
                                } else if (currentPage >= pagination.totalPages - 2) {
                                    pageNumber = pagination.totalPages - 4 + i;
                                } else {
                                    pageNumber = currentPage - 2 + i;
                                }

                                return (
                                    <Button
                                        className='h-8 w-8'
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        size='sm'
                                        variant={currentPage === pageNumber ? 'default' : 'ghost'}
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            disabled={currentPage >= pagination.totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            size='sm'
                            variant='outline'
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
