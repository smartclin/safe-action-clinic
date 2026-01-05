'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Staff } from '@/types/staff';

interface EditStaffDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    staff: Staff;
    onSuccess?: (updatedStaff: Staff) => void; // add this
}

export function EditStaffDialog({ staff, open, onOpenChange }: EditStaffDialogProps) {
    return (
        <Dialog
            onOpenChange={onOpenChange}
            open={open}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {staff.name}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
