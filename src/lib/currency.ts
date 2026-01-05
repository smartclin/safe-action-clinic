import type { Prisma } from '@/generated/client';

/**
 * Safely convert Prisma.Decimal / string / number to number
 */
export function toNumber(value: Prisma.Decimal | number | string | null | undefined): number {
    if (value == null) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return Number(value);
    return value.toNumber();
}

/**
 * Format currency using Intl.NumberFormat
 *
 * Defaults:
 *  - locale: en-EG
 *  - currency: EGP
 */
export function formatCurrency(
    value: Prisma.Decimal | number | string | null | undefined,
    options?: {
        locale?: string;
        currency?: string;
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
    }
): string {
    const amount = toNumber(value);

    const { locale = 'en-EG', currency = 'EGP', minimumFractionDigits = 2, maximumFractionDigits = 2 } = options ?? {};

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits
    }).format(amount);
}
