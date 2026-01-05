// src/components/switch-input.tsx
'use client';

import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface DayOption {
    label: string;
    value: string;
}

export interface WorkDay {
    day: string;
    startTime?: string;
    closeTime?: string;
    enabled: boolean;
}

interface SwitchInputProps {
    data: DayOption[];
    setWorkSchedule: (schedule: WorkDay[]) => void;
    defaultSchedule?: WorkDay[];
}

export function SwitchInput({ data, setWorkSchedule, defaultSchedule = [] }: SwitchInputProps) {
    // Initialize with all days disabled
    const [days, setDays] = useState<WorkDay[]>(() => {
        return data.map(day => {
            const existing = defaultSchedule.find(d => d.day === day.value);
            return {
                day: day.value,
                startTime: existing?.startTime || '09:00',
                closeTime: existing?.closeTime || '17:00',
                enabled: existing?.enabled || false
            };
        });
    });

    // Update parent when days change
    useEffect(() => {
        const enabledDays = days.filter(day => day.enabled);
        setWorkSchedule(enabledDays);
    }, [days, setWorkSchedule]);

    const toggleDay = (index: number) => {
        setDays(prev => {
            const updated = [...prev];
            const current = updated[index];
            if (current) {
                updated[index] = {
                    ...current,
                    enabled: !current.enabled
                };
            }
            return updated;
        });
    };

    const updateTime = (index: number, field: 'startTime' | 'closeTime', value: string) => {
        setDays(prev => {
            const updated = [...prev];
            const current = updated[index];
            if (current) {
                updated[index] = {
                    ...current,
                    [field]: value
                };
            }
            return updated;
        });
    };

    const selectAllDays = () => {
        setDays(prev => prev.map(day => ({ ...day, enabled: true })));
    };

    const clearAllDays = () => {
        setDays(prev => prev.map(day => ({ ...day, enabled: false })));
    };

    const selectWeekdays = () => {
        setDays(prev =>
            prev.map(day => ({
                ...day,
                enabled: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.day)
            }))
        );
    };

    return (
        <div className='space-y-4'>
            {/* Control buttons */}
            <div className='flex flex-wrap gap-2'>
                <Button
                    onClick={selectAllDays}
                    size='sm'
                    type='button'
                    variant='outline'
                >
                    Select All
                </Button>
                <Button
                    onClick={clearAllDays}
                    size='sm'
                    type='button'
                    variant='outline'
                >
                    Clear All
                </Button>
                <Button
                    onClick={selectWeekdays}
                    size='sm'
                    type='button'
                    variant='outline'
                >
                    Weekdays Only
                </Button>
            </div>

            {/* Days selection */}
            <div className='space-y-3'>
                {data.map((day, index) => {
                    const workDay = days[index];

                    if (!workDay) return null;

                    return (
                        <div
                            className={`rounded-lg border p-4 transition-all ${
                                workDay.enabled ? 'border-primary bg-primary/5' : 'border-border bg-card'
                            }`}
                            key={day.value}
                        >
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    {/* Toggle button */}
                                    <button
                                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                                            workDay?.enabled ? 'bg-primary' : 'bg-muted'
                                        } focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
                                        onClick={() => toggleDay(index)}
                                        type='button'
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                                                workDay?.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                            }`}
                                        />
                                    </button>

                                    <Label
                                        className={`cursor-pointer font-medium ${
                                            workDay?.enabled ? 'text-primary' : 'text-muted-foreground'
                                        }`}
                                    >
                                        {day.label}
                                    </Label>
                                </div>

                                {workDay?.enabled && (
                                    <div className='flex items-center gap-2 text-primary text-sm'>
                                        <Check className='h-4 w-4' />
                                        <span>Active</span>
                                    </div>
                                )}
                            </div>

                            {/* Time inputs (only show when enabled) */}
                            {workDay?.enabled && (
                                <div className='mt-4 grid grid-cols-2 gap-4'>
                                    <div>
                                        <Label className='text-sm'>Start Time</Label>
                                        <input
                                            className='mt-1 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                            onChange={e => updateTime(index, 'startTime', e.target.value)}
                                            required
                                            type='time'
                                            value={workDay?.startTime || ''}
                                        />
                                    </div>
                                    <div>
                                        <Label className='text-sm'>Close Time</Label>
                                        <input
                                            className='mt-1 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                            onChange={e => updateTime(index, 'closeTime', e.target.value)}
                                            required
                                            type='time'
                                            value={workDay?.closeTime || ''}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            <div className='rounded-lg bg-muted p-4'>
                <h4 className='font-medium text-sm'>Schedule Summary</h4>
                <p className='mt-1 text-muted-foreground text-sm'>
                    {days.filter(d => d.enabled).length} of {days.length} days selected
                </p>
                {days.filter(d => d.enabled).length > 0 && (
                    <div className='mt-2 space-y-1'>
                        {days
                            .filter(day => day.enabled)
                            .map(day => (
                                <div
                                    className='flex items-center justify-between text-sm'
                                    key={day.day}
                                >
                                    <span className='capitalize'>{day.day}</span>
                                    <span className='text-muted-foreground'>
                                        {day.startTime} - {day.closeTime}
                                    </span>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Alternative: Simple checkbox version
export function SimpleSwitchInput({ data, setWorkSchedule, defaultSchedule = [] }: SwitchInputProps) {
    const [selectedDays, setSelectedDays] = useState<string[]>(defaultSchedule.map(day => day.day));

    useEffect(() => {
        const schedule = selectedDays.map(day => ({
            day,
            enabled: true
        }));
        setWorkSchedule(schedule);
    }, [selectedDays, setWorkSchedule]);

    const toggleDay = (dayValue: string) => {
        setSelectedDays(prev => (prev.includes(dayValue) ? prev.filter(d => d !== dayValue) : [...prev, dayValue]));
    };

    return (
        <div className='space-y-3'>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
                {data.map(day => {
                    const isSelected = selectedDays.includes(day.value);

                    return (
                        <button
                            className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-all ${
                                isSelected
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-accent'
                            }`}
                            key={day.value}
                            onClick={() => toggleDay(day.value)}
                            type='button'
                        >
                            <div className='mb-2 flex h-6 w-6 items-center justify-center'>
                                {isSelected && <Check className='h-4 w-4' />}
                            </div>
                            <span className='font-medium text-sm'>{day.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className='text-center'>
                <p className='text-muted-foreground text-sm'>
                    {selectedDays.length} of {data.length} days selected
                </p>
            </div>
        </div>
    );
}
