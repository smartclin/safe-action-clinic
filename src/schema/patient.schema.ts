// lib/schemas/patient.ts

import { z } from 'zod';

import { genderSchema, roleSchema, statusSchema } from '@/schema/enums.schema';
import {
    dateSchema,
    emailSchema,
    hexColorSchema,
    idSchema,
    optionalIdSchema,
    pastDateSchema
} from '@/schema/types.schema';

export const BloodGroupEnum = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
export const MaterialStatusEnum = z.enum(['married', 'single', 'divorced', 'widowed', 'separated']);
// --- Base Patient Schema ---
export const patientCreateSchema = z.object({
    id: optionalIdSchema,
    clinicId: idSchema,
    phone: z.string().optional(),
    email: emailSchema,
    bloodGroup: BloodGroupEnum.optional(),
    address: z.string().optional(),
    emergencyContactNumber: z.string().optional(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    userId: idSchema,
    dateOfBirth: pastDateSchema,
    gender: genderSchema.default('MALE'),
    materialStatus: MaterialStatusEnum.optional(),
    nutritionalStatus: z.string().optional(),
    emergencyContactName: z.string().optional(),
    relation: z.string().optional(),
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
    medicalHistory: z.string().optional(),
    image: z.url().optional(),
    colorCode: hexColorSchema.optional(),
    role: roleSchema.optional(),
    isActive: z.boolean().default(true),
    status: statusSchema.optional(),
    deletedAt: z.date().optional().nullable(),
    createdAt: dateSchema.optional(),
    updatedAt: dateSchema.optional()
});
export const patientCreateInputSchema = patientCreateSchema.omit({
    clinicId: true,
    userId: true,
    createdAt: true,
    updatedAt: true
});
export const patientUpdateSchema = patientCreateSchema.partial().extend({
    id: idSchema
});

export const patientSelectSchema = patientCreateSchema.extend({
    id: idSchema,
    createdAt: dateSchema,
    updatedAt: dateSchema
});

export type PatientCreate = z.infer<typeof patientCreateSchema>;
export type PatientUpdate = z.infer<typeof patientUpdateSchema>;
export type PatientSelect = z.infer<typeof patientSelectSchema>;
export type PatientValues = z.infer<typeof patientCreateSchema>;

// Search/filter schema
export const patientSearchSchema = z.object({
    clinicId: idSchema.optional(),
    search: z.string().optional(),
    isActive: z.boolean().optional(),
    gender: genderSchema.optional(),
    ageMin: z.coerce.number().min(0).max(120).optional(),
    ageMax: z.coerce.number().min(0).max(120).optional(),
    hasAllergies: z.boolean().optional(),
    hasChronicConditions: z.boolean().optional(),
    status: statusSchema.optional(),
    sortBy: z.enum(['firstName', 'lastName', 'dateOfBirth', 'createdAt', 'updatedAt']).default('lastName'),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
});

// Patient stats schema
export const patientStatsSchema = z.object({
    clinicId: idSchema.optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    gender: genderSchema.optional(),
    status: statusSchema.optional()
});

// Bulk operations schema
export const bulkUpdatePatientsSchema = z.object({
    patientIds: z.array(idSchema),
    data: patientUpdateSchema.pick({
        status: true,
        isActive: true,
        colorCode: true,
        nutritionalStatus: true
    })
});

export const bulkDeletePatientsSchema = z.object({
    patientIds: z.array(idSchema),
    hardDelete: z.boolean().default(false)
});

// Export types
export type PatientInsert = z.infer<typeof patientCreateSchema>;
export type PatientSearchParams = z.infer<typeof patientSearchSchema>;
export type PatientStatsParams = z.infer<typeof patientStatsSchema>;
export type BulkUpdatePatientsInput = z.infer<typeof bulkUpdatePatientsSchema>;
export type BulkDeletePatientsInput = z.infer<typeof bulkDeletePatientsSchema>;

// Patient form schema (without auto-generated fields)
// export const patientFormSchema = patientCreateSchema.omit({
// 	id: true,
// 	userId: true,
// 	clinicId: true,
// 	createdAt: true,
// 	updatedAt: true,
// 	deletedAt: true,
// 	role: true,
// });

// Patient quick create schema (for basic registration)
export const patientQuickCreateSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: emailSchema,
    phone: z.string().optional(),
    dateOfBirth: pastDateSchema,
    gender: genderSchema.default('MALE'),
    clinicId: idSchema
});

export const PatientSearchSchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    minAge: z.coerce.number().min(0).optional(),
    maxAge: z.coerce.number().min(0).optional()
});

export const patientFormSchema = z.object({
    // Personal Information
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15).optional().or(z.literal('')),
    dateOfBirth: z.date({
        error: 'Date of birth is required'
    }),
    gender: genderSchema,
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'separated']).optional(),
    nutritionalStatus: z.string().optional(),
    address: z.string().optional(),

    // Emergency Contact
    emergencyContactName: z.string().optional(),
    emergencyContactNumber: z.string().optional(),
    relation: z.enum(['mother', 'father', 'husband', 'wife', 'other']).optional(),

    // Medical Information
    bloodGroup: z.string().optional(),
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
    medicalHistory: z.string().optional(),

    // Insurance Information
    insuranceNumber: z.string().optional(),
    insuranceProvider: z.string().optional(),

    // Consent (for new patients only)
    privacyConsent: z.boolean().optional(),
    serviceConsent: z.boolean().optional(),
    medicalConsent: z.boolean().optional()
});

// For API response types
export type PatientFormData = z.infer<typeof patientFormSchema>;
