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
    trustedOrigins: [
        'http://localhost:3000', // keep old port for consistency
        'http://localhost:3001' // add your current dev port
    ],

    emailAndPassword: {
        enabled: true
    },
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
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
                defaultValue: 'patient',
                input: false // Don't allow setting via signup
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
        deleteUser: {
            enabled: true,
            beforeDelete: async user => {
                if (user.email.includes('admin')) {
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
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,

        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // 5 minutes - reduces database calls
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
        enabled: true, // Enable rate limiting (disabled by default in development)
        window: 60, // time window in seconds
        max: 100, // Increased default for general API calls
        customRules: {
            // Allow frequent session checks (needed for client-side auth)
            '/get-session': {
                window: 60,
                max: 20 // Allow 20 session checks per minute (for navigation)
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
                    // Validate and normalize email
                    const email = user.email?.trim().toLowerCase();
                    if (!(email && EMAIL_REGEX.test(email))) {
                        throw new APIError('BAD_REQUEST', {
                            message: 'Invalid email format'
                        });
                    }

                    // Normalize name
                    const name = user.name?.trim() || 'Unnamed User';

                    return {
                        data: {
                            ...user,
                            email,
                            name,
                            role: 'patient', // Default role
                            isAdminUser: false // Default admin status
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
            // TODO: colocar cache
            const [userData, clinics] = await Promise.all([
                prisma.user.findFirst({
                    where: { id: user.id },
                    select: {
                        role: true
                    }
                }),
                await prisma.clinic.findMany({
                    where: {
                        users: {
                            some: { id: user.id }
                        }
                    },
                    select: {
                        id: true,
                        name: true
                    }
                })
            ]);
            // TODO: Ao adaptar para o usuário ter múltiplas clínicas, deve-se mudar esse código
            const clinic = clinics?.[0];
            return {
                user: {
                    ...user,
                    role: userData?.role,
                    clinic: clinic?.id
                        ? {
                              id: clinic?.id,
                              name: clinic?.name
                          }
                        : undefined
                },
                session
            };
        }),
        nextCookies()
    ]
});
