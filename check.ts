#!/usr/bin/env bun

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { checkFileForIssues, type Issue, type IssueType } from './scanner/checkFile';
import { generateFixSuggestion, promptUser } from './scanner/suggest';

// Default directories commonly used in Next.js apps. Can be overridden via CLI.
const DEFAULT_SCAN_DIRS = [
    'src/app',
    'src/pages',
    'src/components',
    'src/lib',
    'src/hooks',
    'app',
    'pages',
    'components',
    'lib',
    'hooks'
];

// Directories we never scan.
const IGNORE_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'coverage', '.turbo', '.vercel']);

// File-level ignore patterns (tests, stories, generated files, etc.).
const IGNORE_PATTERNS: RegExp[] = [
    /\.(test|spec)\.(t|j)sx?$/i,
    /\.stories\.(t|j)sx?$/i,
    /\.stories\.mdx$/i,
    /\/__tests__\//,
    /\/__mocks__\//,
    /\.d\.ts$/i
];

const MAX_SCAN_DEPTH = 25;

export interface ScannedIssue {
    file: string;
    issue: Issue;
}

export interface ScanOptions {
    /** Override scan roots. Defaults to common Next.js source directories. */
    scanDirs?: string[];
}

/** Should this file be ignored based on its path? */
function shouldIgnoreFile(filePath: string): boolean {
    return IGNORE_PATTERNS.some(pattern => pattern.test(filePath));
}

/** Recursively collect all .ts/.tsx/.js/.jsx files under a directory. */
export function getAllFiles(dirPath: string, arrayOfFiles: string[] = [], depth = 0): string[] {
    if (!fs.existsSync(dirPath) || depth > MAX_SCAN_DEPTH) return arrayOfFiles;

    const baseName = path.basename(dirPath);
    if (IGNORE_DIRS.has(baseName)) return arrayOfFiles;

    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            try {
                if (entry.isDirectory()) {
                    getAllFiles(fullPath, arrayOfFiles, depth + 1);
                } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name) && !shouldIgnoreFile(fullPath)) {
                    arrayOfFiles.push(fullPath);
                }
            } catch (err) {
                console.warn(`⚠️ Could not access ${fullPath}: ${String(err)}`);
            }
        }
    } catch (err) {
        console.warn(`⚠️ Could not read directory ${dirPath}: ${String(err)}`);
    }

    return arrayOfFiles;
}

function hasUseDirective(directive: 'use client' | 'use server', content: string): boolean {
    const lines = content.split('\n').slice(0, 20); // Only the prologue matters for directives
    const singleQuoted = `'${directive}'`;
    const doubleQuoted = `"${directive}"`;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue;

        const normalized = line.endsWith(';') ? line.slice(0, -1) : line;
        if (normalized === singleQuoted || normalized === doubleQuoted) {
            return true;
        }

        // If we hit a non-directive statement, we can stop.
        if (!/^['"]use [a-zA-Z]+['"];?$/.test(line)) break;
    }

    return false;
}

/** Detect client component by checking top lines for a valid 'use client' directive. */
export function isClientComponentContent(content: string): boolean {
    if (hasUseDirective('use client', content)) return true;

    // Fallback: look for 'use client' very early in the file even if misplaced.
    return content
        .split('\n')
        .slice(0, 10)
        .some(line => line.includes("'use client'") || line.includes('"use client"'));
}

/**
 * Detect server component / server file heuristically:
 * - Not a client component
 * - Has a top-level 'use server' directive
 * - OR exports async functions or uses known server-only imports.
 */
export function isServerComponentContent(content: string): boolean {
    if (isClientComponentContent(content)) return false;

    if (hasUseDirective('use server', content)) return true;

    const serverHeuristics = [
        /export\s+(default\s+)?async\s+function\b/.test(content),
        /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\b/.test(content),
        /from ['"]next\/server['"]/.test(content),
        /from ['"]next\/headers['"]/.test(content),
        /from ['"]next\/cookies['"]/.test(content),
        /from ['"]@prisma\/client['"]/.test(content)
    ];

    return serverHeuristics.some(Boolean);
}

/** Determine whether a file is a client component based on its content. */
export function isClientComponent(file: string): boolean {
    try {
        const content = fs.readFileSync(file, 'utf8');
        return isClientComponentContent(content);
    } catch (err) {
        console.warn(`⚠️ Could not read file ${file}: ${String(err)}`);
        return false;
    }
}

function resolveScanDirs(options?: ScanOptions): string[] {
    const provided = options?.scanDirs?.length ? options.scanDirs : undefined;
    const candidates = provided ?? DEFAULT_SCAN_DIRS;

    const existing = candidates.filter(dir => fs.existsSync(dir));
    if (existing.length) return existing;

    // Fallback: scan the current working directory if nothing matched.
    return ['.'];
}

async function scanAndFix(options?: ScanOptions): Promise<void> {
    console.log('🔎 Scanning for Next.js Client ↔ Server issues...\n');

    const scanDirs = resolveScanDirs(options);
    const allIssues: ScannedIssue[] = [];

    const allFiles: string[] = scanDirs.flatMap(dir => getAllFiles(dir));

    console.log(`📁 Found ${allFiles.length} files to scan (roots: ${scanDirs.join(', ')})\n`);

    for (const file of allFiles) {
        let content: string;
        try {
            content = fs.readFileSync(file, 'utf8');
        } catch (err) {
            console.warn(`⚠️ Could not read file ${file}: ${String(err)}`);
            continue;
        }

        const isClient = isClientComponentContent(content);
        const isServer = isServerComponentContent(content);

        const issues = checkFileForIssues(content, isClient, isServer);
        for (const issue of issues) {
            allIssues.push({ file, issue });
        }
    }

    const issuesByType: Record<IssueType, ScannedIssue[]> = {
        'server-leak': allIssues.filter(i => i.issue.type === 'server-leak'),
        'danger-pattern': allIssues.filter(i => i.issue.type === 'danger-pattern'),
        'avoid-pattern': allIssues.filter(i => i.issue.type === 'avoid-pattern'),
        'server-action': allIssues.filter(i => i.issue.type === 'server-action')
    };

    if (!allIssues.length) {
        console.log('✅ No issues detected! Your code follows Next.js best practices.\n');
        return;
    }

    console.log('📊 ISSUE SUMMARY:');
    console.log(`   Server leaks:      ${issuesByType['server-leak'].length}`);
    console.log(`   Security issues:   ${issuesByType['danger-pattern'].length}`);
    console.log(`   Code improvements: ${issuesByType['avoid-pattern'].length}`);
    console.log(`   Server action issues: ${issuesByType['server-action'].length}\n`);

    // Determine whether to show detailed fixes.
    const args = process.argv.slice(2);
    let explicitFixFlag: boolean | null = null;
    if (args.includes('--fix') || args.includes('-f')) {
        explicitFixFlag = true;
    } else if (args.includes('--no-fix')) {
        explicitFixFlag = false;
    }

    let showFixes = explicitFixFlag ?? false;
    if (explicitFixFlag === null && process.stdin.isTTY && process.stdout.isTTY) {
        showFixes = await promptUser('💡 Would you like to see detailed fix suggestions?');
    }

    if (showFixes) {
        console.log('\n🛠️ DETAILED FIX SUGGESTIONS:\n');
        for (const type of Object.keys(issuesByType) as IssueType[]) {
            const issues = issuesByType[type];
            if (!issues.length) continue;

            console.log(`=== ${type.toUpperCase().replace('-', ' ')} ===`);
            for (const { file, issue } of issues) {
                console.log(generateFixSuggestion(file, issue));
                console.log('─'.repeat(80));
            }
        }
    }

    const hasCriticalIssues = issuesByType['server-leak'].length > 0 || issuesByType['danger-pattern'].length > 0;

    if (hasCriticalIssues) {
        console.log('\n❌ Critical issues found. Fix these before proceeding.');
        process.exitCode = 1;
    } else {
        console.log('\n⚠️  Issues found. Consider fixing them for better code quality.');
        process.exitCode = 0;
    }
}

// --- Exports for CI/CD ---
export { checkFileForIssues, generateFixSuggestion, scanAndFix };

// --- Bun / Node-compatible direct run ---
const isDirectRun = (() => {
    try {
        if (typeof process === 'undefined' || !process.argv?.[1]) return false;
        const entryUrl = pathToFileURL(path.resolve(process.argv[1])).href;
        return import.meta.url === entryUrl;
    } catch {
        return false;
    }
})();

if (isDirectRun) {
    scanAndFix().catch(err => {
        console.error('❌ Error during scanning:', err);
        process.exit(1);
    });
}
