'use client';

import { adminClient, customSessionClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from '@/lib/auth';
import { ac, adminRole, doctorRole, patientRole, staffRole } from '@/lib/auth/roles';

export const authClient = createAuthClient({
    fetchOptions: {
        onSuccess: ctx => {
            // ✅ Success case: log the operation or update client state
            console.log('✅ Auth request succeeded:', ctx.response.url);
        },
        onError: ctx => {
            console.error('❌ Auth error:', ctx.error);
            if (ctx.error.status === 401) {
                // Use Next.js router if possible, fallback to window.location
                window.location.href = '/login';
            }
        }
    },
    plugins: [
        inferAdditionalFields<typeof auth>(),
        customSessionClient<typeof auth>(),
        adminClient({
            ac,
            roles: { admin: adminRole, doctor: doctorRole, staff: staffRole, patient: patientRole }
        })
    ]
});

export const { useSession } = authClient;

export function useAuth() {
    const { data: session, isPending, error } = authClient.useSession();

    const status = isPending ? 'loading' : session ? 'authenticated' : 'unauthenticated';

    return {
        user: session?.user ?? null,
        session: session ?? null,
        isLoading: isPending,
        status,
        isAuthenticated: status === 'authenticated',
        error
    };
}

export const {
    signIn,
    signOut,
    signUp,
    updateUser,
    changePassword,
    changeEmail,
    deleteUser,
    revokeSession,
    resetPassword,
    linkSocial,
    listAccounts,
    listSessions,
    revokeOtherSessions,
    revokeSessions
} = authClient;
