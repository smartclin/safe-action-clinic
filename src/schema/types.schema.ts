import z from 'zod';

// ============ BASE SCHEMAS ============
export const idSchema = z.cuid();
export const optionalIdSchema = z.cuid().optional();
export const emailSchema = z.email();
export const dateSchema = z.date();
export const futureDateSchema = dateSchema.refine(date => date > new Date(), {
    message: 'Date must be in the future'
});
export const pastDateSchema = dateSchema.refine(date => date <= new Date(), {
    message: 'Date must be in the past'
});
export const timeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
export const hexColorSchema = z.string().regex(/^#([0-9A-F]{3}){1,2}$/i);
export const decimalSchema = z.number().or(z.string().transform(val => Number.parseFloat(val)));
