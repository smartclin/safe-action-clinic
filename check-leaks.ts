#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

import { isServer } from '@tanstack/react-query';

const SCAN_DIRS = ['src/components', 'src/lib', 'src/app', 'src/hooks'];
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build'];

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

// Modules that should be avoided but have alternatives
const AVOID_PATTERNS = [
    { pattern: /import.*=.*require\(/, fix: 'use ES6 imports instead of require()' },
    { pattern: /module\.exports/, fix: 'use ES6 exports instead' }
];

// Add ignore patterns for certain files
const IGNORE_PATTERNS = [/\.test\.(ts|tsx)$/, /\.spec\.(ts|tsx)$/, /\.stories\.(ts|tsx)$/, /\/__tests__\//];

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

type IssueType = 'server-leak' | 'danger-pattern' | 'avoid-pattern' | 'server-action';

interface Issue {
    type: IssueType;
    pattern: string;
    fix: string;
    line: number;
    context: string;
}

/**
 * Recursively collect all .ts/.tsx files under a directory
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = [], depth = 0): string[] {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    if (depth > 10) return arrayOfFiles;

    const baseName = path.basename(dirPath);
    if (IGNORE_DIRS.includes(baseName)) return arrayOfFiles;

    try {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const fullPath = path.join(dirPath, file);

            try {
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    getAllFiles(fullPath, arrayOfFiles, depth + 1);
                } else if (
                    file.endsWith('.ts') ||
                    file.endsWith('.tsx') ||
                    file.endsWith('.js') ||
                    file.endsWith('.jsx')
                ) {
                    if (IGNORE_PATTERNS.some(pattern => pattern.test(fullPath))) {
                        continue;
                    }
                    arrayOfFiles.push(fullPath);
                }
            } catch (err) {
                console.warn(`⚠️ Could not access ${fullPath}: ${err}`);
            }
        }
    } catch (err) {
        console.warn(`⚠️ Could not read directory ${dirPath}: ${err}`);
    }

    return arrayOfFiles;
}

function isClientComponentContent(content: string): boolean {
    const lines = content.split('\n');
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
        if (lines[i]?.includes("'use client'") || lines[i]?.includes('"use client"')) return true;
    }
    return false;
}
function isServerComponentContent(content: string): boolean {
    const hasClientDirective = content.includes("'use client'") || content.includes('"use client"');
    if (hasClientDirective) return false;

    return content.includes("'use server'") || /export\s+(default\s+)?async\s+(function\s+)?\w*\s*\(/.test(content);
}

/**
 * Check if a file is a client component
 */
function isClientComponent(file: string): boolean {
    try {
        const content = fs.readFileSync(file, 'utf8');
        // Check for 'use client' directive
        const lines = content.split('\n');
        for (let i = 0; i < Math.min(lines.length, 10); i++) {
            if (lines[i]?.includes("'use client'") || lines[i]?.includes('"use client"')) {
                return true;
            }
        }
        return false;
    } catch (err) {
        console.warn(`⚠️ Could not read file ${file}: ${err}`);
        return false;
    }
}

/**
 * Check if a file is a server component
 */
function isServerComponent(file: string): boolean {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const hasClientDirective = isClientComponentContent(content);

        if (hasClientDirective) return false;

        // Check for server component indicators
        const hasServerDirective = isServerComponentContent(content);
        const hasAsyncComponent = /export\s+(default\s+)?async\s+(function\s+)?\w*\s*\(/.test(content);
        const hasAsyncInDefault = /export\s+default\s+async/.test(content);

        return hasServerDirective || hasAsyncComponent || hasAsyncInDefault;
    } catch (err) {
        console.warn(`⚠️ Could not read file ${file}: ${err}`);
        return false;
    }
}
function checkFileForIssues(content: string, _isServer: boolean, isClient: boolean, _file: string): Issue[] {
    const lines = content.split('\n');
    const issues: Issue[] = [];

    // Server leaks in client components
    if (isClient) {
        for (const serverPattern of SERVER_ONLY_PATTERNS) {
            const regex = serverPattern.pattern;
            let match: RegExpExecArray | null;
            while (true) {
                match = regex.exec(content);
                if (!match) break;
                const lineNumber = findLineNumber(lines, match[0]);
                issues.push({
                    type: 'server-leak',
                    pattern: serverPattern.name,
                    fix: serverPattern.fix,
                    line: lineNumber,
                    context: lines[lineNumber - 1]?.trim() || match[0]
                });
            }
        }

        // Server actions misuse
        for (const actionPattern of SERVER_ACTION_PATTERNS) {
            if (actionPattern.pattern.test(content)) {
                const lineNumber = findLineNumber(lines, "'use server'");
                issues.push({
                    type: 'server-action',
                    pattern: "'use server'",
                    fix: actionPattern.fix,
                    line: lineNumber,
                    context: lines[lineNumber - 1]?.trim() || "'use server'"
                });
            }
        }
    }

    // Danger patterns in any file
    for (const dangerPattern of DANGER_PATTERNS) {
        const regex = dangerPattern.pattern;
        let match: RegExpExecArray | null;
        while (true) {
            match = regex.exec(content);
            if (!match) break;
            const lineNumber = findLineNumber(lines, match[0]);
            issues.push({
                type: 'danger-pattern',
                pattern: dangerPattern.pattern.toString(),
                fix: dangerPattern.fix,
                line: lineNumber,
                context: lines[lineNumber - 1]?.trim() || match[0]
            });
        }
    }

    // Avoid patterns in any file
    for (const avoidPattern of AVOID_PATTERNS) {
        const regex = avoidPattern.pattern;
        let match: RegExpExecArray | null;
        while (true) {
            match = regex.exec(content);
            if (!match) break;
            const lineNumber = findLineNumber(lines, match[0]);
            issues.push({
                type: 'avoid-pattern',
                pattern: avoidPattern.pattern.toString(),
                fix: avoidPattern.fix,
                line: lineNumber,
                context: lines[lineNumber - 1]?.trim() || match[0]
            });
        }
    }

    return issues;
}

/**
 * Find the line number of a pattern
 */
function findLineNumber(lines: string[], pattern: string): number {
    for (let i = 0; i < lines.length; i++) {
        if (lines[i]?.includes(pattern)) {
            return i + 1;
        }
    }
    return 1;
}

/**
 * Generate a fix suggestion for a specific issue
 */
function generateFixSuggestion(filePath: string, issue: Issue): string {
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
async function promptUser(question: string): Promise<boolean> {
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

/**
 * Scan and suggest fixes
 */
async function scanAndFix(): Promise<void> {
    console.log('🔎 Scanning for Next.js Client ↔ Server issues...\n');

    const allIssues: Array<{
        file: string;
        issue: Issue;
    }> = [];

    // Collect all files
    const allFiles: string[] = [];
    for (const dir of SCAN_DIRS) {
        if (fs.existsSync(dir)) {
            allFiles.push(...getAllFiles(dir));
        } else {
            console.log(`⚠️ Directory not found: ${dir}`);
        }
    }

    console.log(`📁 Found ${allFiles.length} files to scan\n`);

    // Scan each file
    for (const file of allFiles) {
        const issues = checkFileForIssues(file, content, isClient, isServer);
        if (issues.length > 0) {
            for (const issue of issues) {
                allIssues.push({ file, issue });
            }
        }
    }

    // Group issues by type
    const issuesByType = {
        'server-leak': allIssues.filter(i => i.issue.type === 'server-leak'),
        'danger-pattern': allIssues.filter(i => i.issue.type === 'danger-pattern'),
        'avoid-pattern': allIssues.filter(i => i.issue.type === 'avoid-pattern'),
        'server-action': allIssues.filter(i => i.issue.type === 'server-action')
    };

    // Display results
    if (allIssues.length === 0) {
        console.log('✅ No issues detected! Your code follows Next.js best practices.\n');
        return;
    }

    // Show summary
    console.log('📊 ISSUE SUMMARY:');
    console.log(`   Server leaks: ${issuesByType['server-leak'].length}`);
    console.log(`   Security issues: ${issuesByType['danger-pattern'].length}`);
    console.log(`   Code improvements: ${issuesByType['avoid-pattern'].length}`);
    console.log(`   Server action issues: ${issuesByType['server-action'].length}`);
    console.log('');

    // Show detailed issues
    for (const type of Object.keys(issuesByType) as IssueType[]) {
        const issues = issuesByType[type];
        if (issues.length === 0) continue;

        console.log(`📝 ${type.toUpperCase().replace('-', ' ')}:`);
        for (const { file, issue } of issues) {
            const relativePath = path.relative(process.cwd(), file);
            console.log(`   ${relativePath}:${issue.line} - ${issue.pattern}`);
        }
        console.log('');
    }

    // Ask user if they want to see fixes
    const showFixes = process.argv.includes('--fix') || process.argv.includes('-f');

    if (showFixes) {
        console.log('\n🛠️ DETAILED FIX SUGGESTIONS:\n');
    } else if (process.stdin.isTTY && process.stdout.isTTY) {
        const shouldShowFixes = await promptUser('💡 Would you like to see detailed fix suggestions?');
        if (!shouldShowFixes) {
            console.log('\nSkipping detailed fixes.');
        } else {
            console.log('\n🛠️ DETAILED FIX SUGGESTIONS:\n');
        }
    }

    if (showFixes || (process.stdin.isTTY && process.stdout.isTTY)) {
        let displayedFixes = false;
        for (const type of Object.keys(issuesByType) as IssueType[]) {
            const issues = issuesByType[type];
            if (issues.length === 0) continue;

            displayedFixes = true;
            console.log(`=== ${type.toUpperCase().replace('-', ' ')} ===`);
            for (const { file, issue } of issues) {
                console.log(generateFixSuggestion(file, issue));
                console.log('─'.repeat(80));
            }
        }

        if (!displayedFixes) {
            console.log('No fixes to display.');
        }
    }

    // Exit with appropriate code
    const hasCriticalIssues = issuesByType['server-leak'].length > 0 || issuesByType['danger-pattern'].length > 0;

    if (hasCriticalIssues) {
        console.log('\n❌ Critical issues found. Fix these before proceeding.');
        process.exit(1);
    } else {
        console.log('\n⚠️  Issues found. Consider fixing them for better code quality.');
        process.exit(0);
    }
}

// Export utilities for use in CI/CD
export { getAllFiles, isClientComponent, isServerComponent, checkFileForIssues, generateFixSuggestion, scanAndFix };

// Run if called directly
if (require.main === module) {
    scanAndFix().catch(err => {
        console.error('❌ Error during scanning:', err);
        process.exit(1);
    });
}
