import path from 'node:path';
import readline from 'node:readline';

import type { Issue } from './checkFile';

export function generateFixSuggestion(filePath: string, issue: Issue): string {
    const relativePath = path.relative(process.cwd(), filePath);

    const baseMessage = `
🛠️ FIX for ${relativePath} (line ${issue.line}):

${issue.context}

${issue.fix}
`;

    switch (issue.type) {
        case 'server-leak':
            if (issue.pattern.includes('@/lib/db') || issue.pattern.includes('@prisma/client')) {
                return (
                    baseMessage +
                    `
Option 1: Move database logic to server action:

// In src/actions/user.ts
'use server';
import { db } from '@/lib/db';

export async function getUserData() {
    return await db.user.findMany();
}

Option 2: Use API route:

// In src/app/api/users/route.ts
import { db } from '@/lib/db';

export async function GET() {
    const users = await db.user.findMany();
    return Response.json(users);
}
`
                );
            }

            if (issue.pattern.includes('next/headers') || issue.pattern.includes('next/cookies')) {
                return (
                    baseMessage +
                    `
Option 1: Use headers in server component parent:

// In parent server component:
import { headers } from 'next/headers';

export default async function ParentServerComponent() {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent');
    
    return <ClientComponent userAgent={userAgent} />;
}

Option 2: Use server action:

// In server action:
'use server';
import { headers } from 'next/headers';

export async function getUserAgent() {
    const headersList = await headers();
    return headersList.get('user-agent');
}
`
                );
            }

            if (issue.pattern.includes('process.env')) {
                return (
                    baseMessage +
                    `
Option 1: Pass env variables from server component:

// Server component
export default function ServerComponent() {
    return <ClientComponent apiKey={process.env.API_KEY} />;
}

Option 2: Use public env variables (prefix with NEXT_PUBLIC_):

// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com

// Client component
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
`
                );
            }

            return baseMessage;

        case 'danger-pattern':
            return `
⚠️ SECURITY ISSUE in ${relativePath} (line ${issue.line}):

${issue.context}

${issue.fix}

This pattern is a security risk and should be removed immediately.
`;

        case 'avoid-pattern':
            return `
💡 IMPROVEMENT for ${relativePath} (line ${issue.line}):

${issue.context}

${issue.fix}

Consider updating to modern JavaScript patterns.
`;

        case 'server-action':
            return `
🔧 SERVER ACTION ISSUE in ${relativePath} (line ${issue.line}):

${issue.context}

${issue.fix}

Move 'use server' directive to a separate file or ensure it's not in a client component.
`;

        default:
            return baseMessage;
    }
}

/**
 * Prompt user for confirmation
 */
export async function promptUser(question: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(`${question} (y/n): `, answer => {
            rl.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}
