import { APIError, betterAuth, generateId } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin, customSession } from 'better-auth/plugins';

import prisma from '../db';
import { ac, adminRole, doctorRole, patientRole, staffRole } from './roles';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql' // or "mysql", "postgresql", ...etc
    }),
    experimental: { joins: true },
    trustedOrigins: ['http://localhost:3000', 'http://localhost:5000'],

    emailAndPassword: {
        enabled: true
    },
    baseURL: process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL,
    advanced: {
        database: {
            generateId: () => generateId(),
            defaultFindManyLimit: 100
        },
        useSecureCookies: process.env.NODE_ENV === 'production',
        cookiePrefix: 'auth'
    },
    logger: {
        level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
        disabled: false
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: 'DOCTOR',
                input: false
            },
            phone: {
                type: 'string',
                required: false,
                input: true
            },
            isAdmin: {
                type: 'boolean',
                required: false,
                defaultValue: false,
                input: false
            }
        },
        updateUser: { enabled: true },
        deleteUser: {
            enabled: true,
            beforeDelete: async user => {
                // Query database for additional fields
                const fullUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true, isAdmin: true }
                });

                if (fullUser?.role?.toLowerCase() === 'admin' || fullUser?.isAdmin) {
                    throw new APIError('BAD_REQUEST', {
                        message: "Admin accounts can't be deleted"
                    });
                }
            }
        },
        changeEmail: {
            enabled: true
        }
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // 5 minutes
        }
    },
    account: {
        encryptOAuthTokens: true,
        accountLinking: {
            enabled: true
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },
    rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
        storage: 'memory', // Increased default for general API calls
        customRules: {
            // Allow frequent session checks (needed for client-side auth)
            '/get-session': {
                window: 60,
                max: 60
            },
            // Rate limit for sign-in to prevent brute force and credential stuffing attacks
            '/sign-in/email': {
                window: 300, // 5 minutes
                max: 5 // max 5 login attempts per 5 minutes
            },
            // Rate limit for user and provider signup to prevent spam and abuse
            '/sign-up/email': {
                window: 300, // 5 minutes
                max: 5 // max 5 signup attempts per 5 minutes
            },
            // Stricter rate limit for forgot password to prevent email enumeration and spam
            '/forget-password': {
                window: 300, // 5 minutes
                max: 3 // max 3 requests per 5 minutes
            },
            // Also limit reset password attempts
            '/reset-password': {
                window: 300, // 5 minutes
                max: 5 // max 5 attempts per 5 minutes
            }
        }
    },
    databaseHooks: {
        user: {
            create: {
                // Fix 2: Correct the return type for database hooks
                before: async user => {
                    const email = user.email?.trim().toLowerCase();
                    if (!(email && EMAIL_REGEX.test(email))) {
                        throw new APIError('BAD_REQUEST', {
                            message: 'Invalid email format'
                        });
                    }

                    const name = user.name?.trim() || 'Unnamed User';

                    return {
                        data: {
                            ...user,
                            email,
                            name,
                            role: 'PATIENT', // Default to PATIENT for new registrations (use uppercase for DB enum compatibility)
                            isAdmin: false
                        }
                    };
                },
                // Fix 4: Remove unused context parameter
                after: async user => {
                    try {
                        const hasClinic = await prisma.clinic.findFirst({
                            where: {
                                users: {
                                    some: { id: user.id }
                                }
                            },
                            select: { id: true }
                        });

                        if (!hasClinic) {
                            const defaultClinic = await prisma.clinic.findFirst({
                                select: { id: true }
                            });

                            if (defaultClinic) {
                                await prisma.user.update({
                                    where: { id: user.id },
                                    data: {
                                        clinics: {
                                            connect: { id: defaultClinic.id }
                                        }
                                    }
                                });
                            }
                        }
                    } catch (error) {
                        console.error(`Post-create error for ${user.email}:`, error);
                    }
                }
            }
        }
    },

    plugins: [
        admin({
            ac,
            roles: {
                admin: adminRole,
                doctor: doctorRole,
                staff: staffRole,
                patient: patientRole
            }
        }),
        customSession(async ({ user, session }) => {
            const dbUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: {
                    role: true,
                    clinics: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            const primaryClinic = dbUser?.clinics[0];

            return {
                ...session,
                user: {
                    ...user,
                    // Normalize role to lowercase for consistency
                    role: dbUser?.role?.toLowerCase() ?? 'patient',
                    clinic: primaryClinic
                        ? {
                              id: primaryClinic.id,
                              name: primaryClinic.name
                          }
                        : undefined
                }
            };
        }),

        nextCookies()
    ]
});
