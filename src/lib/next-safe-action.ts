import 'server-only';

import { headers } from 'next/headers';
import { createSafeActionClient } from 'next-safe-action';

import { auth } from './auth';

export const actionClient = createSafeActionClient();
// Create a protected client for sensitive clinic data
export const authActionClient = actionClient.use(async ({ next }) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        throw new Error('Unauthorized: Please log in to continue.');
    }

    // Pass the user and role metadata to the action logic
    return next({
        ctx: {
            userId: session.user.id,
            role: session.user.role
        }
    });
});

export const adminClient = createSafeActionClient({
    handleServerError: error => {
        console.error('Admin action error:', error);
        return {
            success: false,
            message: 'Server error',
            error: true
        };
    }
});

export const protectedActionClient = createSafeActionClient().use(async ({ next }) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    return next({ ctx: { user: session.user } });
});

export const protectedWithClinicActionClient = protectedActionClient.use(async ({ next, ctx }) => {
    if (!ctx.user.clinic?.id) {
        throw new Error('Clinic not found');
    }
    return next({
        ctx: {
            user: {
                ...ctx.user,
                clinic: ctx.user.clinic
            }
        }
    });
});
