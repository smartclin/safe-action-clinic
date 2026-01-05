export * from './database';
export type { Staff, UserRole } from './staff';
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type EmptyProps<T extends React.ElementType> = Omit<React.ComponentProps<T>, keyof React.ComponentProps<T>>;

export interface SearchParams {
    [key: string]: string | string[] | undefined;
}

export interface SearchParamsProps {
    searchParams?: Promise<{ [key: string]: string | undefined }>;
}

/**
 * Prisma Query Options
 * Note: Prisma types are usually model-specific (e.g., Prisma.UserWhereInput).
 * Use 'any' or a generic if this needs to be universal across different models.
 */
export interface QueryBuilderOpts<T = unknown, O = unknown, D = unknown> {
    where?: T;
    orderBy?: O | O[]; // Prisma allows a single object or an array for ordering
    distinct?: D | D[]; // Prisma distinct takes the field enum or an array of them
    take?: number;
    skip?: number;
    cursor?: unknown; // Added for keyset pagination support
}
