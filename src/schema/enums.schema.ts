// schemas/enums.ts
import * as z from 'zod';

import {
    AppointmentStatus,
    DevelopmentStatus,
    DosageUnit,
    DrugRoute,
    FeedingType,
    Gender,
    ImmunizationStatus,
    JOBTYPE,
    MeasurementType,
    NotificationType,
    PaymentMethod,
    PaymentStatus,
    ReminderMethod,
    ReminderStatus,
    ServiceCategory,
    Status
} from '@/types';
import { UserRole } from '@/types/database';

// UserRole
export const roleSchema = z.enum(UserRole);
export type RoleSchema = z.infer<typeof roleSchema>;

// Status
export const statusSchema = z.enum(Status);
export type StatusSchema = z.infer<typeof statusSchema>;

// Job Type
export const jobTypeSchema = z.enum(JOBTYPE);
export type JOBTYPESchema = z.infer<typeof jobTypeSchema>;

// Gender
export const genderSchema = z.enum(Gender);
export type GenderSchema = z.infer<typeof genderSchema>;

// Appointment Status
export const appointmentStatusSchema = z.enum(AppointmentStatus);
export type AppointmentStatusSchema = z.infer<typeof appointmentStatusSchema>;

// Payment Method
export const paymentMethodSchema = z.enum(PaymentMethod);
export type PaymentMethodSchema = z.infer<typeof paymentMethodSchema>;

// Payment Status
export const paymentStatusSchema = z.enum(PaymentStatus);
export type PaymentStatusSchema = z.infer<typeof paymentStatusSchema>;

// Service Category
export const serviceCategorySchema = z.enum(ServiceCategory);
export type ServiceCategorySchema = z.infer<typeof serviceCategorySchema>;

// Measurement Type
export const measurementTypeSchema = z.enum(MeasurementType);
export type MeasurementTypeSchema = z.infer<typeof measurementTypeSchema>;

// Reminder Method
export const reminderMethodSchema = z.enum(ReminderMethod);
export type ReminderMethodSchema = z.infer<typeof reminderMethodSchema>;

// Reminder Status
export const reminderStatusSchema = z.enum(ReminderStatus);
export type ReminderStatusSchema = z.infer<typeof reminderStatusSchema>;

// Notification Type
export const notificationTypeSchema = z.enum(NotificationType);
export type NotificationTypeSchema = z.infer<typeof notificationTypeSchema>;

// Feeding Type
export const feedingTypeSchema = z.enum(FeedingType);
export type FeedingTypeSchema = z.infer<typeof feedingTypeSchema>;

// Development Status
export const developmentStatusSchema = z.enum(DevelopmentStatus);
export type DevelopmentStatusSchema = z.infer<typeof developmentStatusSchema>;

// Immunization Status
export const immunizationStatusSchema = z.enum(ImmunizationStatus);
export type ImmunizationStatusSchema = z.infer<typeof immunizationStatusSchema>;

// Dosage Unit
export const dosageUnitSchema = z.enum(DosageUnit);
export type DosageUnitSchema = z.infer<typeof dosageUnitSchema>;

// Drug Route
export const drugRouteSchema = z.enum(DrugRoute);
export type DrugRouteSchema = z.infer<typeof drugRouteSchema>;

// Utility function to create enum arrays for select inputs
export const enumToOptions = <T extends Record<string, string>>(enumObj: T) => {
    return Object.entries(enumObj).map(([key, value]) => ({
        label: key.toLowerCase().replace(/_/g, ' '),
        value
    }));
};

// Example labels for display purposes
export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'Pending',
    [AppointmentStatus.NO_SHOW]: 'No Show',
    [AppointmentStatus.SCHEDULED]: 'Scheduled',
    [AppointmentStatus.CANCELLED]: 'Cancelled',
    [AppointmentStatus.COMPLETED]: 'Completed'
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
    [PaymentStatus.UNPAID]: 'Unpaid',
    [PaymentStatus.PARTIAL]: 'Partially Paid',
    [PaymentStatus.PAID]: 'Paid',
    [PaymentStatus.REFUNDED]: 'Refunded'
};
