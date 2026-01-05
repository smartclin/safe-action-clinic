// Server actions that should be wrapped properly
const SERVER_ACTION_PATTERNS = [
    {
        pattern: /['"]use server['"]/,
        check: 'server action defined in client component?',
        fix: "move server action to separate file or ensure it's in a server component"
    }
];

// Danger patterns that should never appear in client
const DANGER_PATTERNS = [
    { pattern: /eval\(/, fix: 'remove eval() - security risk' },
    { pattern: /Function\(['"]/, fix: 'avoid Function constructor' },
    { pattern: /localStorage\./, fix: 'use client-side storage only in useEffect with proper checks' },
    { pattern: /sessionStorage\./, fix: 'use client-side storage only in useEffect with proper checks' }
];

// Modules that should be avoided but have alternatives
const AVOID_PATTERNS = [
    { pattern: /import.*=.*require\(/, fix: 'use ES6 imports instead of require()' },
    { pattern: /module\.exports/, fix: 'use ES6 exports instead' }
];

// Server-only modules and patterns
const SERVER_ONLY_PATTERNS = [
    // Database and ORM
    {
        pattern: /from ['"]@prisma\/client['"]/,
        name: '@prisma/client',
        fix: 'use PrismaClient only in server components or server actions'
    },
    {
        pattern: /from ['"]pg['"]/,
        name: 'pg',
        fix: 'use database connections only in server components or server actions'
    },
    {
        pattern: /from ['"]mysql2['"]/,
        name: 'mysql2',
        fix: 'use database connections only in server components or server actions'
    },
    {
        pattern: /from ['"]@\/lib\/db['"]/,
        name: '@/lib/db',
        fix: 'move database logic to server components or server actions'
    },

    // Next.js server-only APIs
    {
        pattern: /from ['"]next\/headers['"]/,
        name: 'next/headers',
        fix: 'use headers() only in server components or server actions'
    },
    {
        pattern: /from ['"]next\/cookies['"]/,
        name: 'next/cookies',
        fix: 'use cookies() only in server components or server actions'
    },
    {
        pattern: /from ['"]next\/server['"]/,
        name: 'next/server',
        fix: 'use server-only APIs in route handlers or server components'
    },

    // Node.js built-ins (server-only)
    {
        pattern: /from ['"]node:fs['"]|from ['"]fs['"]/,
        name: 'fs',
        fix: 'use filesystem operations only in server components or server actions'
    },
    {
        pattern: /from ['"]node:fs\/promises['"]|from ['"]fs\/promises['"]/,
        name: 'fs/promises',
        fix: 'use filesystem operations only in server components or server actions'
    },
    {
        pattern: /from ['"]node:child_process['"]|from ['"]child_process['"]/,
        name: 'child_process',
        fix: 'use process operations only in server components or server actions'
    },
    {
        pattern: /from ['"]node:net['"]|from ['"]net['"]/,
        name: 'net',
        fix: 'use networking APIs only in server components'
    },
    { pattern: /from ['"]node:tls['"]|from ['"]tls['"]/, name: 'tls', fix: 'use TLS APIs only in server components' },
    { pattern: /from ['"]node:dns['"]|from ['"]dns['"]/, name: 'dns', fix: 'use DNS APIs only in server components' },
    { pattern: /from ['"]node:os['"]|from ['"]os['"]/, name: 'os', fix: 'use OS APIs only in server components' },
    {
        pattern: /from ['"]node:crypto['"]|from ['"]crypto['"]/,
        name: 'crypto',
        fix: 'use crypto APIs only in server components'
    },

    // Environment variables access
    {
        pattern: /process\.env\.([A-Z_][A-Z0-9_]*)/,
        name: 'process.env',
        fix: 'use env variables through server actions or server components'
    },

    // Specific library patterns
    { pattern: /from ['"]bcrypt['"]/, name: 'bcrypt', fix: 'use bcrypt only in server components or server actions' },
    {
        pattern: /from ['"]jsonwebtoken['"]/,
        name: 'jsonwebtoken',
        fix: 'use JWT only in server components or server actions'
    },
    {
        pattern: /from ['"]sharp['"]/,
        name: 'sharp',
        fix: 'use image processing only in server components or server actions'
    },

    // Custom server-only modules
    {
        pattern: /from ['"]@\/lib\/auth\/server['"]/,
        name: '@/lib/auth/server',
        fix: 'use auth server utilities only in server components'
    },
    {
        pattern: /from ['"]@\/lib\/storage['"]/,
        name: '@/lib/storage',
        fix: 'use file storage only in server components'
    },
    { pattern: /from ['"]@\/lib\/email['"]/, name: '@/lib/email', fix: 'use email sending only in server components' }
];
export type IssueType = 'server-leak' | 'danger-pattern' | 'avoid-pattern' | 'server-action';

export interface Issue {
    type: IssueType;
    /** Short identifier for what was matched (module name, pattern, etc.). */
    pattern: string;
    /** Human-readable fix suggestion summary. */
    fix: string;
    /** 1-based line number. */
    line: number;
    /** Source-code context for the match (typically the full line). */
    context: string;
}

function pushIssue(
    issues: Issue[],
    partial: Omit<Issue, 'context'> & { contextLine: string | undefined; fallbackContext: string }
): void {
    issues.push({
        type: partial.type,
        pattern: partial.pattern,
        fix: partial.fix,
        line: partial.line,
        context: (partial.contextLine ?? partial.fallbackContext).trim()
    });
}

export function checkFileForIssues(content: string, isClient: boolean, isServer: boolean): Issue[] {
    const lines = content.split('\n');
    const issues: Issue[] = [];

    // === Server leaks in client components ===
    if (isClient) {
        for (const serverPattern of SERVER_ONLY_PATTERNS) {
            const regex = serverPattern.pattern;

            lines.forEach((line, index) => {
                // Reset lastIndex in case the regex is global.
                regex.lastIndex = 0;
                const match = line.match(regex);
                if (!match) return;

                pushIssue(issues, {
                    type: 'server-leak',
                    pattern: serverPattern.name,
                    fix: serverPattern.fix,
                    line: index + 1,
                    contextLine: line,
                    fallbackContext: match[0]
                });
            });
        }

        // Server actions misuse inside client components.
        for (const actionPattern of SERVER_ACTION_PATTERNS) {
            const regex = actionPattern.pattern;

            lines.forEach((line, index) => {
                regex.lastIndex = 0;
                if (!regex.test(line)) return;

                pushIssue(issues, {
                    type: 'server-action',
                    pattern: "'use server'",
                    fix: actionPattern.fix,
                    line: index + 1,
                    contextLine: line,
                    fallbackContext: "'use server'"
                });
            });
        }
    }

    // === Server-only misusage detection (optional warning) ===
    if (isServer) {
        // Warn if client-only storage APIs appear in server code.
        const clientOnlyPatterns = [
            { raw: 'localStorage', regex: /localStorage/ },
            { raw: 'sessionStorage', regex: /sessionStorage/ }
        ] as const;

        for (const { raw, regex } of clientOnlyPatterns) {
            lines.forEach((line, index) => {
                regex.lastIndex = 0;
                if (!regex.test(line)) return;

                pushIssue(issues, {
                    type: 'avoid-pattern',
                    pattern: raw,
                    fix: `Do not use client-only APIs (${raw}) in server code`,
                    line: index + 1,
                    contextLine: line,
                    fallbackContext: raw
                });
            });
        }
    }

    // === Danger patterns in any file ===
    for (const dangerPattern of DANGER_PATTERNS) {
        const regex = dangerPattern.pattern;

        lines.forEach((line, index) => {
            regex.lastIndex = 0;
            const match = line.match(regex);
            if (!match) return;

            pushIssue(issues, {
                type: 'danger-pattern',
                pattern: dangerPattern.pattern.toString(),
                fix: dangerPattern.fix,
                line: index + 1,
                contextLine: line,
                fallbackContext: match[0]
            });
        });
    }

    // === Avoid patterns in any file ===
    for (const avoidPattern of AVOID_PATTERNS) {
        const regex = avoidPattern.pattern;

        lines.forEach((line, index) => {
            regex.lastIndex = 0;
            const match = line.match(regex);
            if (!match) return;

            pushIssue(issues, {
                type: 'avoid-pattern',
                pattern: avoidPattern.pattern.toString(),
                fix: avoidPattern.fix,
                line: index + 1,
                contextLine: line,
                fallbackContext: match[0]
            });
        });
    }

    return issues;
}
