import { adminClient, customSessionClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from '@/lib/auth';
import { ac, adminRole, doctorRole, patientRole, staffRole } from '@/lib/auth/roles';

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    fetchOptions: {
        onSuccess: ctx => {
            // Handle successful responses globally
            const authToken = ctx.response.headers.get('set-auth-token');
            if (authToken) {
                // Store token if using bearer authentication
                localStorage.setItem('bearer_token', authToken);
            }
        },
        onError: ctx => {
            // Handle errors globally
            console.error('Auth error:', ctx.error);

            // Redirect to login on authentication errors
            if (ctx.error.status === 401) {
                window.location.href = '/login';
            }
        }
    },
    plugins: [
        customSessionClient<typeof auth>(),
        adminClient({
            ac,
            roles: {
                admin: adminRole,
                doctor: doctorRole,
                staff: staffRole,
                patient: patientRole
            }
        }),
        inferAdditionalFields<typeof auth>()
    ]
});

export const { useSession } = authClient;
// Custom useAuth hook for better developer experience
export function useAuth() {
    const { data: session, isPending, error } = useSession();

    // Derive status based on pending state and session existence
    const status = isPending ? 'loading' : session ? 'authenticated' : 'unauthenticated';

    return {
        user: session?.user ?? null,
        session: session ?? null,
        isLoading: isPending,
        status, // Added this line
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
