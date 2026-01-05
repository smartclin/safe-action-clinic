import { z } from 'zod';

import { appointmentStatusSchema } from '@/schema/enums.schema';
import { Prisma } from '@/types';

export const AppointmentSchema = z.object({
    doctorId: z.string().min(1, 'Select physician'),
    type: z.enum(['CHECKUP', 'FOLLOWUP', 'EMERGENCY', 'CONSULTATION']),
    appointmentDate: z.date().min(1, 'Select appointment date'),
    time: z.string().min(1, 'Select appointment time'),
    note: z.string().optional(),
    status: appointmentStatusSchema
});

export const AppointmentCreateSchema = AppointmentSchema.extend({
    patientId: z.string().min(1, 'Patient ID is required'),
    doctorId: z.string().min(1, 'Doctor ID is required'),
    appointmentDate: z.date(),
    time: z.string().min(1, 'Time is required'),
    type: z.enum(['CHECKUP', 'FOLLOWUP', 'EMERGENCY', 'CONSULTATION']),
    note: z.string().optional(),
    status: appointmentStatusSchema
});

export const DoctorSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
    phone: z.string().min(10, 'Enter phone number').max(10, 'Enter phone number'),
    email: z.email('Invalid email address.'),
    address: z
        .string()
        .min(5, 'Address must be at least 5 characters')
        .max(500, 'Address must be at most 500 characters'),
    specialty: z.string().min(2, 'specialty is required.'),
    licenseNumber: z.string().min(2, 'License number is required'),
    type: z.enum(['FULL', 'PART'], { message: 'Type is required.' }),
    department: z.string().min(2, 'Department is required.'),
    img: z.string().optional(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long!' })
        .optional()
        .or(z.literal(''))
});

export const workingDaySchema = z.object({
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    startTime: z.string(),
    closeTime: z.string()
});
export const WorkingDaysSchema = z.array(workingDaySchema).optional();

export const StaffSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
    role: z.enum(['STAFF'], { message: 'Role is required.' }),
    phone: z.string().min(10, 'Contact must be 10-digits').max(10, 'Contact must be 10-digits'),
    email: z.email('Invalid email address.'),
    address: z
        .string()
        .min(5, 'Address must be at least 5 characters')
        .max(500, 'Address must be at most 500 characters'),
    licenseNumber: z.string().optional(),
    department: z.string().optional(),
    img: z.string().optional(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long!' })
        .optional()
        .or(z.literal(''))
});

export const VitalSignsSchema = z.object({
    patientId: z.string(),
    medicalId: z.string().optional(),
    bodyTemperature: z.coerce.number({
        message: 'Enter recorded body temperature'
    }),
    heartRate: z.string({ message: 'Enter recorded heartbeat rate' }),
    systolic: z.coerce.number({
        message: 'Enter recorded systolic blood pressure'
    }),
    diastolic: z.coerce.number({
        message: 'Enter recorded diastolic blood pressure'
    }),
    respiratoryRate: z.coerce.number().optional(),
    oxygenSaturation: z.coerce.number().optional(),
    weight: z.coerce.number({ message: 'Enter recorded weight (Kg)' }),
    height: z.coerce.number({ message: 'Enter recorded height (Cm)' })
});

export const DiagnosisSchema = z.object({
    patientId: z.string(),
    appointmentId: z.string(),
    medicalId: z.string(),
    doctorId: z.string(),
    symptoms: z.string({ message: 'Symptoms required' }),
    diagnosis: z.string({ message: 'Diagnosis required' }),
    notes: z.string().optional(),
    prescribedMedications: z.string().optional(),
    followUpPlan: z.string().optional()
});

export const PaymentSchema = z.object({
    id: z.string(),
    // patientId: z.string(),
    // appointmentId: z.string(),
    billDate: z.date(),
    // paymentDate: z.string(),
    discount: z.string({ message: 'discount' }),
    totalAmount: z.string()
    // amountPaid: z.string(),
});

export const PatientBillSchema = z.object({
    billId: z.string(),
    serviceId: z.string(),
    serviceDate: z.string(),
    appointmentId: z.string(),
    quantity: z.string({ message: 'Quantity is required' }),
    unitCost: z.string({ message: 'Unit cost is required' }),
    totalCost: z.string({ message: 'Total cost is required' })
});

export const ServicesSchema = z.object({
    serviceName: z.string({ message: 'Service name is required' }),
    price: z.instanceof(Prisma.Decimal).refine(price => price.gte('0.01') && price.lt('1000000.00')),
    description: z.string({ message: 'Service description is required' })
});

export const DeleteDataSchema = z.object({
    id: z.string().min(1),
    deleteType: z.enum(['doctor', 'appointment', 'service', 'clinic', 'staff', 'patient', 'payment', 'bill'])
});

export const ReviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(3),
    clinicId: z.string(),
    patientId: z.string()
});

export const GrowthRecordSchema = z.object({
    patientId: z.string(),
    encounterId: z.string().optional(),
    medicalId: z.string(),

    gender: z.enum(['MALE', 'FEMALE']),
    ageDays: z.number().int().positive(),
    ageMonths: z.number().int().positive().optional(),

    weight: z.number().positive().optional(),
    height: z.number().positive().optional(),
    headCircumference: z.number().positive().optional(),

    notes: z.string().optional()
});
