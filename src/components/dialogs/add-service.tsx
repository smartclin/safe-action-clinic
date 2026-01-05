'use client';

import { Baby, Plus, Stethoscope, Syringe } from 'lucide-react';
import { useState } from 'react';
import { Select } from 'react-day-picker';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Clinic } from '@/types';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface AddServiceProps {
    clinics: Clinic[];
    variant?: 'button' | 'icon';
}
const pediatricCategories = [
    { value: 'VACCINATION', label: 'Vaccination', icon: <Syringe className='h-4 w-4' /> },
    { value: 'CONSULTATION', label: 'Pediatric Consultation', icon: <Stethoscope className='h-4 w-4' /> },
    { value: 'LAB_TEST', label: 'Lab Test', icon: <Baby className='h-4 w-4' /> },
    { value: 'PROCEDURE', label: 'Procedure', icon: <Baby className='h-4 w-4' /> },
    { value: 'DIAGNOSIS', label: 'Diagnosis', icon: <Stethoscope className='h-4 w-4' /> },
    { value: 'PHARMACY', label: 'Pharmacy', icon: <Baby className='h-4 w-4' /> },
    { value: 'OTHER', label: 'Other', icon: <Baby className='h-4 w-4' /> }
];

export function AddService({ clinics, variant = 'button' }: AddServiceProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog
            onOpenChange={setOpen}
            open={open}
        >
            <DialogTrigger asChild>
                {variant === 'button' ? (
                    <Button className='gap-2'>
                        <Plus className='h-4 w-4' />
                        Add Pediatric Service
                    </Button>
                ) : (
                    <Button
                        size='icon'
                        variant='outline'
                    >
                        <Plus className='h-4 w-4' />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className='sm:max-w-[600px]'>
                <DialogHeader>
                    <DialogTitle>Add Pediatric Service</DialogTitle>
                    <DialogDescription>Add a new service specifically designed for pediatric care.</DialogDescription>
                </DialogHeader>

                <form className='space-y-6'>
                    <div className='grid gap-4'>
                        {/* Service Name */}
                        <div className='space-y-2'>
                            <Label htmlFor='serviceName'>Service Name *</Label>
                            <Input
                                id='serviceName'
                                placeholder='e.g., Child Vaccination, Growth Monitoring'
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className='space-y-2'>
                            <Label>Category *</Label>
                            <Select
                                defaultValue='VACCINATION'
                                name='category'
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select category' />
                                </SelectTrigger>
                                <SelectContent>
                                    {pediatricCategories.map(category => (
                                        <SelectItem
                                            key={category.value}
                                            value={category.value}
                                        >
                                            <div className='flex items-center gap-2'>
                                                {category.icon}
                                                {category.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price and Duration */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='price'>Price ($) *</Label>
                                <Input
                                    id='price'
                                    min='0'
                                    placeholder='0.00'
                                    required
                                    step='0.01'
                                    type='number'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='duration'>Duration (minutes)</Label>
                                <Input
                                    id='duration'
                                    min='5'
                                    placeholder='30'
                                    step='5'
                                    type='number'
                                />
                            </div>
                        </div>

                        {/* Clinic Selection */}
                        {clinics.length > 0 && (
                            <div className='space-y-2'>
                                <Label>Clinic</Label>
                                <Select name='clinicId'>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select clinic (optional)' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All Clinics</SelectItem>
                                        {clinics.map(clinic => (
                                            <SelectItem
                                                key={clinic.id}
                                                value={clinic.id}
                                            >
                                                {clinic.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Description */}
                        <div className='space-y-2'>
                            <Label htmlFor='description'>Description</Label>
                            <Textarea
                                id='description'
                                placeholder='Describe the service, including any pediatric-specific considerations...'
                                rows={3}
                            />
                        </div>

                        {/* Service Options */}
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between'>
                                <Label
                                    className='cursor-pointer'
                                    htmlFor='isAvailable'
                                >
                                    Available for booking
                                </Label>
                                <Switch
                                    defaultChecked
                                    id='isAvailable'
                                />
                            </div>

                            <div className='flex items-center justify-between'>
                                <Label
                                    className='cursor-pointer'
                                    htmlFor='requiresPrescription'
                                >
                                    Requires prescription
                                </Label>
                                <Switch id='requiresPrescription' />
                            </div>

                            <div className='flex items-center justify-between'>
                                <Label
                                    className='cursor-pointer'
                                    htmlFor='isPediatric'
                                >
                                    Pediatric-specific service
                                </Label>
                                <Switch
                                    defaultChecked
                                    id='isPediatric'
                                />
                            </div>
                        </div>

                        {/* Color and Icon Selection */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='color'>Color Code</Label>
                                <Input
                                    className='h-10 w-full cursor-pointer'
                                    defaultValue='#3b82f6'
                                    id='color'
                                    type='color'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='icon'>Icon</Label>
                                <Input
                                    id='icon'
                                    placeholder='Icon name or URL'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end gap-3'>
                        <Button
                            onClick={() => setOpen(false)}
                            variant='outline'
                        >
                            Cancel
                        </Button>
                        <Button type='submit'>Add Service</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
