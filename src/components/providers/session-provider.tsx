'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth/client';
import type { Role } from '@/types/auth';

type SessionContextType = {
    // Enhanced methods
    signOut: () => Promise<void>;
    refetch: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | null>(null);

interface SessionProviderProps {
    children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
    const router = useRouter();

    const signOut = useCallback(async () => {
        try {
            await authClient.signOut();
            toast.success('Signed out successfully');
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Sign out error:', error);
            toast.error('Failed to sign out. Please try again.');
            throw error;
        }
    }, [router]);

    const refetch = useCallback(async () => {
        try {
            // Use Better Auth's built-in refetch instead of reload
            await authClient.getSession();
            toast.success('Session refreshed');
        } catch (error) {
            console.error('Session refetch error:', error);
            toast.error('Failed to refresh session');
        }
    }, []);

    const value = useMemo<SessionContextType>(
        () => ({
            signOut,
            refetch
        }),
        [signOut, refetch]
    );

    return <SessionContext.Provider value={value}> {children} </SessionContext.Provider>;
}

/**
 * Enhanced session hook that combines Better Auth's useSession
 * with additional role checks and methods
 */
export function useSession() {
    // Use Better Auth's reactive session hook directly
    const authSession = authClient.useSession();
    const context = useContext(SessionContext);

    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }

    const role = authSession.data?.user?.role?.toLowerCase() as Role | undefined;
    const user = authSession.data?.user || null;

    return {
        // Better Auth session data
        data: authSession.data,
        session: authSession.data || null,
        user,
        isPending: authSession.isPending,
        error: authSession.error,

        // Auth state
        isAuthenticated: !!user,
        role,

        // Role checks
        isAdmin: role === 'admin',
        isDoctor: role === 'doctor',
        isStaff: role === 'staff',
        isPatient: role === 'patient',

        // Methods from context
        signOut: context.signOut,
        refetch: authSession.refetch || context.refetch
    };
}

export function useUser() {
    const { user } = useSession();
    return user;
}

export function useAuth() {
    const { isAuthenticated, role, isAdmin, isDoctor, isStaff, isPatient } = useSession();

    return {
        isAuthenticated,
        role,
        isAdmin,
        isDoctor,
        isStaff,
        isPatient
    };
}

// Export types
export type { SessionContextType, Role };
