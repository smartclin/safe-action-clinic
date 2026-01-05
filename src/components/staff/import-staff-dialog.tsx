'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ImportStaffDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ImportStaffDialog({ open, onOpenChange }: ImportStaffDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleImport = async () => {
        if (!file) {
            toast.message('No file selected', {
                description: 'Please choose a file to import.'
            });
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Replace with your API endpoint
            const res = await fetch('/api/staff/import', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Failed to import staff data.');

            toast.message('Staff imported successfully!');
            setFile(null);
            onOpenChange(false);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            toast.message(message, {
                description: 'Import failed.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            onOpenChange={onOpenChange}
            open={open}
        >
            <DialogContent className='sm:max-w-[400px]'>
                <DialogHeader>
                    <DialogTitle>Import Staff</DialogTitle>
                    <DialogDescription>Upload a CSV file to import staff members into the system.</DialogDescription>
                </DialogHeader>

                <div className='mt-4 flex flex-col gap-4'>
                    <Input
                        accept='.csv'
                        onChange={handleFileChange}
                        type='file'
                    />
                    {file && <p className='text-muted-foreground text-sm'>Selected file: {file.name}</p>}
                </div>

                <DialogFooter>
                    <Button
                        disabled={loading}
                        onClick={() => onOpenChange(false)}
                        variant='outline'
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={loading}
                        onClick={handleImport}
                    >
                        {loading ? 'Importing...' : 'Import'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
