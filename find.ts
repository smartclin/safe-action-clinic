#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const SCAN_DIRS = ['src/components', 'src/lib', 'src/app', 'src/hooks'];
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build'];

// Server-only modules and patterns
const SERVER_ONLY_PATTERNS: Array<{
    pattern: RegExp;
    name: string;
    fix: string;
    moduleNames?: string[];
}> = [
    // Database and ORM
    {
        pattern: /from ['"]@prisma\/client['"]/,
        name: '@prisma/client',
        fix: 'use PrismaClient only in server components or server actions',
        moduleNames: ['@prisma/client']
    },
    {
        pattern: /from ['"]pg['"]/,
        name: 'pg',
        fix: 'use database connections only in server components or server actions',
        moduleNames: ['pg']
    },
    {
        pattern: /from ['"]mysql2['"]/,
        name: 'mysql2',
        fix: 'use database connections only in server components or server actions',
        moduleNames: ['mysql2']
    },
    {
        pattern: /from ['"]@\/lib\/db['"]/,
        name: '@/lib/db',
        fix: 'move database logic to server components or server actions',
        moduleNames: []
    },

    // Next.js server-only APIs
    {
        pattern: /from ['"]next\/headers['"]/,
        name: 'next/headers',
        fix: 'use headers() only in server components or server actions',
        moduleNames: ['next/headers']
    },
    {
        pattern: /from ['"]next\/cookies['"]/,
        name: 'next/cookies',
        fix: 'use cookies() only in server components or server actions',
        moduleNames: ['next/cookies']
    },
    {
        pattern: /from ['"]next\/server['"]/,
        name: 'next/server',
        fix: 'use server-only APIs in route handlers or server components',
        moduleNames: ['next/server']
    },

    // Node.js built-ins (server-only)
    {
        pattern: /from ['"]node:fs['"]|from ['"]fs['"]/,
        name: 'fs',
        fix: 'use filesystem operations only in server components or server actions',
        moduleNames: ['fs', 'node:fs']
    },
    {
        pattern: /from ['"]node:fs\/promises['"]|from ['"]fs\/promises['"]/,
        name: 'fs/promises',
        fix: 'use filesystem operations only in server components or server actions',
        moduleNames: ['fs/promises', 'node:fs/promises']
    },
    {
        pattern: /from ['"]node:child_process['"]|from ['"]child_process['"]/,
        name: 'child_process',
        fix: 'use process operations only in server components or server actions',
        moduleNames: ['child_process', 'node:child_process']
    },
    {
        pattern: /from ['"]node:net['"]|from ['"]net['"]/,
        name: 'net',
        fix: 'use networking APIs only in server components',
        moduleNames: ['net', 'node:net']
    },
    {
        pattern: /from ['"]node:tls['"]|from ['"]tls['"]/,
        name: 'tls',
        fix: 'use TLS APIs only in server components',
        moduleNames: ['tls', 'node:tls']
    },
    {
        pattern: /from ['"]node:dns['"]|from ['"]dns['"]/,
        name: 'dns',
        fix: 'use DNS APIs only in server components',
        moduleNames: ['dns', 'node:dns']
    },
    {
        pattern: /from ['"]node:os['"]|from ['"]os['"]/,
        name: 'os',
        fix: 'use OS APIs only in server components',
        moduleNames: ['os', 'node:os']
    },
    {
        pattern: /from ['"]node:crypto['"]|from ['"]crypto['"]/,
        name: 'crypto',
        fix: 'use crypto APIs only in server components',
        moduleNames: ['crypto', 'node:crypto']
    },

    // Environment variables access
    {
        pattern: /process\.env\.([A-Z_][A-Z0-9_]*)/,
        name: 'process.env',
        fix: 'use env variables through server actions or server components',
        moduleNames: []
    },

    // Specific library patterns
    {
        pattern: /from ['"]bcrypt['"]/,
        name: 'bcrypt',
        fix: 'use bcrypt only in server components or server actions',
        moduleNames: ['bcrypt']
    },
    {
        pattern: /from ['"]jsonwebtoken['"]/,
        name: 'jsonwebtoken',
        fix: 'use JWT only in server components or server actions',
        moduleNames: ['jsonwebtoken']
    },
    {
        pattern: /from ['"]sharp['"]/,
        name: 'sharp',
        fix: 'use image processing only in server components or server actions',
        moduleNames: ['sharp']
    },

    // Custom server-only modules
    {
        pattern: /from ['"]@\/lib\/auth\/server['"]/,
        name: '@/lib/auth/server',
        fix: 'use auth server utilities only in server components',
        moduleNames: []
    },
    {
        pattern: /from ['"]@\/lib\/storage['"]/,
        name: '@/lib/storage',
        fix: 'use file storage only in server components',
        moduleNames: []
    },
    {
        pattern: /from ['"]@\/lib\/email['"]/,
        name: '@/lib/email',
        fix: 'use email sending only in server components',
        moduleNames: []
    }
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

type IssueType = 'server-leak' | 'danger-pattern' | 'avoid-pattern' | 'server-action' | 'indirect-server-leak';

interface Issue {
    type: IssueType;
    pattern: string;
    fix: string;
    line: number;
    context: string;
    importChain?: string[];
}

interface ImportGraphNode {
    filePath: string;
    isClient: boolean;
    imports: string[];
    importedBy: string[];
    issues: Issue[];
}

class ImportGraph {
    private nodes: Map<string, ImportGraphNode> = new Map();

    addFile(filePath: string, isClient: boolean, imports: string[], issues: Issue[] = []): void {
        this.nodes.set(filePath, {
            filePath,
            isClient,
            imports,
            importedBy: [],
            issues
        });
    }

    buildRelationships(projectRoot: string): void {
        // Clear existing importedBy relationships
        for (const node of this.nodes.values()) {
            node.importedBy = [];
        }

        // Build import relationships
        for (const [sourcePath, sourceNode] of this.nodes) {
            for (const importPath of sourceNode.imports) {
                const resolvedPath = this.resolveImportPath(sourcePath, importPath, projectRoot);
                if (resolvedPath && this.nodes.has(resolvedPath)) {
                    const targetNode = this.nodes.get(resolvedPath);
                    if (targetNode && !targetNode.importedBy.includes(sourcePath)) {
                        targetNode.importedBy.push(sourcePath);
                    }
                }
            }
        }
    }

    private resolveImportPath(sourcePath: string, importPath: string, projectRoot: string): string | null {
        try {
            // Handle relative imports
            if (importPath.startsWith('.')) {
                const dir = path.dirname(sourcePath);
                const resolved = path.resolve(dir, importPath);

                // Try with extensions
                for (const ext of [
                    '.ts',
                    '.tsx',
                    '.js',
                    '.jsx',
                    '/index.ts',
                    '/index.tsx',
                    '/index.js',
                    '/index.jsx'
                ]) {
                    const withExt = resolved + ext;
                    if (fs.existsSync(withExt)) return withExt;
                    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
                        const indexFile = path.join(resolved, `index${ext}`);
                        if (fs.existsSync(indexFile)) return indexFile;
                    }
                }

                // Check if it's a directory
                if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
                    return resolved;
                }

                return resolved;
            }

            // Handle absolute imports (starting with @/)
            if (importPath.startsWith('@/')) {
                const relativePath = importPath.replace('@/', '');
                const resolved = path.resolve(projectRoot, relativePath);

                for (const ext of [
                    '.ts',
                    '.tsx',
                    '.js',
                    '.jsx',
                    '/index.ts',
                    '/index.tsx',
                    '/index.js',
                    '/index.jsx'
                ]) {
                    const withExt = resolved + ext;
                    if (fs.existsSync(withExt)) return withExt;
                }

                return resolved;
            }

            // Skip node_modules for now (external dependencies)
            return null;
        } catch {
            return null;
        }
    }

    findIndirectServerLeaks(): Array<{
        clientFile: string;
        serverFile: string;
        importChain: string[];
        serverModules: string[];
    }> {
        const leaks: Array<{
            clientFile: string;
            serverFile: string;
            importChain: string[];
            serverModules: string[];
        }> = [];

        // Find all client files
        const clientFiles = Array.from(this.nodes.values()).filter(node => node.isClient);

        for (const clientFile of clientFiles) {
            // Skip if client file already has direct server leaks
            if (clientFile.issues.some(issue => issue.type === 'server-leak')) {
                continue;
            }

            // Find all reachable files from this client file
            const visited = new Set<string>();
            const toVisit = [clientFile.filePath];
            const importChainMap = new Map<string, string[]>([[clientFile.filePath, []]]);

            while (toVisit.length > 0) {
                const currentPath = toVisit.pop();
                if (!currentPath || visited.has(currentPath)) continue;
                visited.add(currentPath);

                const currentNode = this.nodes.get(currentPath);
                if (!currentNode) continue;

                for (const importPath of currentNode.imports) {
                    const resolvedPath = this.resolveImportPath(currentPath, importPath, path.dirname(currentPath));
                    if (!resolvedPath || !this.nodes.has(resolvedPath) || visited.has(resolvedPath)) {
                        continue;
                    }

                    const importedNode = this.nodes.get(resolvedPath);
                    if (!importedNode) continue;

                    // Build import chain
                    const currentChain = importChainMap.get(currentPath) || [];
                    const newChain = [...currentChain, resolvedPath];
                    importChainMap.set(resolvedPath, newChain);

                    // Check if imported file has server-only modules but isn't marked as client
                    if (!importedNode.isClient && importedNode.issues.some(issue => issue.type === 'server-leak')) {
                        const serverModules = importedNode.issues
                            .filter(issue => issue.type === 'server-leak')
                            .map(issue => issue.pattern);

                        leaks.push({
                            clientFile: clientFile.filePath,
                            serverFile: resolvedPath,
                            importChain: newChain,
                            serverModules
                        });
                    }

                    // Continue traversal
                    toVisit.push(resolvedPath);
                }
            }
        }

        return leaks;
    }

    getNode(filePath: string): ImportGraphNode | undefined {
        return this.nodes.get(filePath);
    }

    getAllNodes(): ImportGraphNode[] {
        return Array.from(this.nodes.values());
    }
}

/**
 * Extract imports from file content
 */
function extractImports(content: string): string[] {
    const imports: string[] = [];

    // Match ES6 imports
    const importRegex = /from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    // Fixed: use while (true) instead of assignment in condition
    while (true) {
        match = importRegex.exec(content);
        if (match === null) break;
        const importPath = match[1] || match[2];
        if (importPath && !importPath.startsWith('react') && !importPath.startsWith('next/')) {
            imports.push(importPath);
        }
    }

    // Match require statements
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    // Fixed: use while (true) instead of assignment in condition
    while (true) {
        match = requireRegex.exec(content);
        if (match === null) break;
        const importPath = match[1];
        if (importPath && !importPath.startsWith('react') && !importPath.startsWith('next/')) {
            imports.push(importPath);
        }
    }

    return imports;
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

/**
 * Check if a file is a client component
 */
function isClientComponent(filePath: string): boolean {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Check for 'use client' directive
        const lines = content.split('\n');
        for (let i = 0; i < Math.min(lines.length, 10); i++) {
            if (lines[i]?.includes("'use client'") || lines[i]?.includes('"use client"')) {
                return true;
            }
        }
        return false;
    } catch (err) {
        console.warn(`⚠️ Could not read file ${filePath}: ${err}`);
        return false;
    }
}

/**
 * Detect all types of issues in a file
 */
function checkFileForIssues(filePath: string, isClient: boolean): Issue[] {
    let content: string;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.warn(`⚠️ Could not read file ${filePath}: ${err}`);
        return [];
    }

    const lines = content.split('\n');
    const issues: Issue[] = [];

    // Check for server leaks in client components
    if (isClient) {
        for (const serverPattern of SERVER_ONLY_PATTERNS) {
            const regex = serverPattern.pattern;
            // Reset regex lastIndex
            regex.lastIndex = 0;

            // Fixed: use while (true) instead of assignment in condition
            while (true) {
                const match = regex.exec(content);
                if (match === null) break;
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
    }

    // Check for server action misuse in client components
    if (isClient) {
        for (const actionPattern of SERVER_ACTION_PATTERNS) {
            const regex = actionPattern.pattern;
            regex.lastIndex = 0;
            if (regex.test(content)) {
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

    // Check for danger patterns in any file
    for (const dangerPattern of DANGER_PATTERNS) {
        const regex = dangerPattern.pattern;
        regex.lastIndex = 0;

        // Fixed: use while (true) instead of assignment in condition
        while (true) {
            const match = regex.exec(content);
            if (match === null) break;
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

    // Check for patterns to avoid
    for (const avoidPattern of AVOID_PATTERNS) {
        const regex = avoidPattern.pattern;
        regex.lastIndex = 0;

        // Fixed: use while (true) instead of assignment in condition
        while (true) {
            const match = regex.exec(content);
            if (match === null) break;
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
 * Build import graph for the entire project
 */
function buildImportGraph(allFiles: string[], projectRoot: string): ImportGraph {
    const graph = new ImportGraph();

    // First pass: add all files to graph
    for (const file of allFiles) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            const isClient = isClientComponent(file);
            const imports = extractImports(content);
            const issues = checkFileForIssues(file, isClient);

            graph.addFile(file, isClient, imports, issues);
        } catch (err) {
            console.warn(`⚠️ Could not process file ${file}: ${err}`);
        }
    }

    // Second pass: build relationships
    graph.buildRelationships(projectRoot);

    return graph;
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

    if (issue.type === 'indirect-server-leak' && issue.importChain) {
        const importChainStr = issue.importChain
            .map((file, i) => `${'  '.repeat(i)}→ ${path.relative(process.cwd(), file)}`)
            .join('\n');

        return `
🔗 INDIRECT SERVER LEAK in ${relativePath}:

Client component imports server-only modules through this chain:
${importChainStr}

Leaked server module: ${issue.pattern}

${issue.fix}

Solution: Refactor the import chain to avoid mixing server and client code.
Consider creating a client-safe API layer.
`;
    }

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
 * Scan and suggest fixes
 */
function displayIssueSummary(issuesByType: Record<IssueType, Array<{ file: string; issue: Issue }>>): void {
    console.log('📊 ISSUE SUMMARY:');
    console.log(`   Direct server leaks: ${issuesByType['server-leak'].length}`);
    console.log(`   Indirect server leaks: ${issuesByType['indirect-server-leak'].length}`);
    console.log(`   Security issues: ${issuesByType['danger-pattern'].length}`);
    console.log(`   Code improvements: ${issuesByType['avoid-pattern'].length}`);
    console.log(`   Server action issues: ${issuesByType['server-action'].length}`);
    console.log('');
}

/**
 * Display detailed issues by type
 */
function displayDetailedIssues(
    issuesByType: Record<IssueType, Array<{ file: string; issue: Issue }>>,
    projectRoot: string
): void {
    for (const type of Object.keys(issuesByType) as IssueType[]) {
        const issues = issuesByType[type];
        if (issues.length === 0) continue;

        console.log(`📝 ${type.toUpperCase().replace(/-/g, ' ')}:`);
        for (const { file, issue } of issues) {
            const relativePath = path.relative(projectRoot, file);
            console.log(`   ${relativePath}:${issue.line} - ${issue.pattern}`);
        }
        console.log('');
    }
}

/**
 * Display fix suggestions
 */
function displayFixSuggestions(issuesByType: Record<IssueType, Array<{ file: string; issue: Issue }>>): void {
    let displayedFixes = false;
    for (const type of Object.keys(issuesByType) as IssueType[]) {
        const issues = issuesByType[type];
        if (issues.length === 0) continue;

        displayedFixes = true;
        console.log(`=== ${type.toUpperCase().replace(/-/g, ' ')} ===`);
        for (const { file, issue } of issues) {
            console.log(generateFixSuggestion(file, issue));
            console.log('─'.repeat(80));
        }
    }

    if (!displayedFixes) {
        console.log('No fixes to display.');
    }
}

/**
 * Display import graph visualization
 */
function displayImportGraph(importGraph: ImportGraph, projectRoot: string): void {
    console.log('\n📊 IMPORT GRAPH VISUALIZATION:');
    const nodes = importGraph.getAllNodes();
    for (const node of nodes.slice(0, 20)) {
        const relativePath = path.relative(projectRoot, node.filePath);
        const type = node.isClient ? 'CLIENT' : 'SERVER';
        const issues = node.issues.length > 0 ? ` (${node.issues.length} issues)` : '';
        console.log(`${type} ${relativePath}${issues}`);
        if (node.imports.length > 0) {
            node.imports.slice(0, 3).forEach(imp => {
                console.log(`  → imports: ${imp}`);
            });
            if (node.imports.length > 3) {
                console.log(`  ... and ${node.imports.length - 3} more`);
            }
        }
        console.log('');
    }
}

/**
 * Check if there are critical issues
 */
function hasCriticalIssues(issuesByType: Record<IssueType, Array<{ file: string; issue: Issue }>>): boolean {
    return (
        issuesByType['server-leak'].length > 0 ||
        issuesByType['danger-pattern'].length > 0 ||
        issuesByType['indirect-server-leak'].length > 0
    );
}

/**
 * Collect and scan all files
 */
async function collectAndScanFiles(): Promise<{
    allFiles: string[];
    allIssues: Array<{ file: string; issue: Issue }>;
    importGraph: ImportGraph;
}> {
    const projectRoot = process.cwd();
    const allFiles: string[] = [];
    const allIssues: Array<{ file: string; issue: Issue }> = [];

    // Collect all files
    for (const dir of SCAN_DIRS) {
        if (fs.existsSync(dir)) {
            allFiles.push(...getAllFiles(dir));
        } else {
            console.log(`⚠️ Directory not found: ${dir}`);
        }
    }

    console.log(`📁 Found ${allFiles.length} files to scan\n`);

    // Build import graph
    console.log('🔗 Building import graph...');
    const importGraph = buildImportGraph(allFiles, projectRoot);
    console.log('✅ Import graph built\n');

    // Find direct issues
    for (const file of allFiles) {
        const isClient = isClientComponent(file);
        const issues = checkFileForIssues(file, isClient);
        if (issues.length > 0) {
            for (const issue of issues) {
                allIssues.push({ file, issue });
            }
        }
    }

    // Find indirect leaks through import graph
    console.log('🔍 Checking for indirect server leaks...');
    const indirectLeaks = importGraph.findIndirectServerLeaks();

    for (const leak of indirectLeaks) {
        allIssues.push({
            file: leak.clientFile,
            issue: {
                type: 'indirect-server-leak',
                pattern: leak.serverModules.join(', '),
                fix: 'Refactor import chain to avoid mixing server and client code. Create client-safe APIs or move server logic to server components.',
                line: 1,
                context: `Client component imports ${leak.serverModules.join(', ')} indirectly through ${leak.importChain.length} file(s)`,
                importChain: [leak.clientFile, ...leak.importChain]
            }
        });
    }

    console.log(`📊 Found ${indirectLeaks.length} indirect server leaks\n`);

    return { allFiles, allIssues, importGraph };
}

/**
 * Group issues by type
 */
function groupIssuesByType(
    allIssues: Array<{ file: string; issue: Issue }>
): Record<IssueType, Array<{ file: string; issue: Issue }>> {
    return {
        'server-leak': allIssues.filter(i => i.issue.type === 'server-leak'),
        'danger-pattern': allIssues.filter(i => i.issue.type === 'danger-pattern'),
        'avoid-pattern': allIssues.filter(i => i.issue.type === 'avoid-pattern'),
        'server-action': allIssues.filter(i => i.issue.type === 'server-action'),
        'indirect-server-leak': allIssues.filter(i => i.issue.type === 'indirect-server-leak')
    };
}

/**
 * Prompt user for seeing fixes
 */
async function shouldShowFixes(): Promise<boolean> {
    const showFixes = process.argv.includes('--fix') || process.argv.includes('-f');

    if (showFixes) {
        return true;
    }

    if (process.stdin.isTTY && process.stdout.isTTY) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise(resolve => {
            rl.question('💡 Would you like to see detailed fix suggestions? (y/n): ', answer => {
                rl.close();
                resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
            });
        });
    }

    return false;
}

/**
 * Scan and suggest fixes
 */
async function scanAndFix(): Promise<void> {
    console.log('🔎 Scanning for Next.js Client ↔ Server issues...\n');

    const projectRoot = process.cwd();

    // Collect files and scan
    const { allIssues, importGraph } = await collectAndScanFiles();

    // Group issues by type
    const issuesByType = groupIssuesByType(allIssues);

    // Display results
    if (allIssues.length === 0) {
        console.log('✅ No issues detected! Your code follows Next.js best practices.\n');
        return;
    }

    // Show summary
    displayIssueSummary(issuesByType);

    // Show detailed issues
    displayDetailedIssues(issuesByType, projectRoot);

    // Ask user if they want to see fixes
    const showFixes = await shouldShowFixes();

    if (showFixes) {
        console.log('\n🛠️ DETAILED FIX SUGGESTIONS:\n');
        displayFixSuggestions(issuesByType);
    }

    // Optional: Show import graph visualization
    if (process.argv.includes('--graph')) {
        displayImportGraph(importGraph, projectRoot);
    }

    // Exit with appropriate code
    if (hasCriticalIssues(issuesByType)) {
        console.log('\n❌ Critical issues found. Fix these before proceeding.');
        process.exit(1);
    } else {
        console.log('\n⚠️  Issues found. Consider fixing them for better code quality.');
        process.exit(0);
    }
}

// Export utilities for use in CI/CD
export {
    getAllFiles,
    isClientComponent,
    checkFileForIssues,
    generateFixSuggestion,
    scanAndFix,
    buildImportGraph,
    ImportGraph,
    displayIssueSummary,
    displayDetailedIssues,
    displayFixSuggestions,
    displayImportGraph,
    hasCriticalIssues,
    collectAndScanFiles,
    groupIssuesByType,
    shouldShowFixes
};

// Run if called directly
if (import.meta.url === `file://${process.cwd()}/find.ts`) {
    scanAndFix().catch(err => {
        console.error('❌ Error during scanning:', err);
        process.exit(1);
    });
}
