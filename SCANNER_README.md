# Next.js Client-Server Leak Scanner

A comprehensive static analysis tool to detect and prevent common Next.js client-server boundary violations.

## Features

- 🔍 **Detects Server Leaks**: Identifies server-only code used in client components
- 🎯 **Detects Client Leaks**: Identifies React hooks used without 'use client' directive
- 🔒 **Security Scanning**: Finds dangerous patterns like `eval()` and unsafe HTML
- 📊 **Severity Levels**: Critical, Warning, and Info classifications
- 🛠️ **Fix Suggestions**: Detailed, actionable fix recommendations
- 📁 **Smart File Scanning**: Ignores test files, config files, and build artifacts
- 🎨 **Beautiful Output**: Color-coded, organized results

## Installation

```bash
# Make the script executable
chmod +x find.ts

# Or run with tsx
npx tsx find.ts
```

## Usage

### Basic Scan
```bash
npx tsx find.ts
```

### Show Detailed Fix Suggestions
```bash
npx tsx find.ts --fix
# or
npx tsx find.ts -f
```

### Verbose Output
```bash
npx tsx find.ts --verbose
# or
npx tsx find.ts -v
```

### Combined Flags
```bash
npx tsx find.ts --fix --verbose
```

## What It Detects

### 1. Server Leaks in Client Components

Detects when client components import or use server-only modules:

- **Database**: `@prisma/client`, `pg`, `mysql2`, `@/lib/db`
- **Next.js APIs**: `next/headers`, `next/cookies`
- **Node.js Built-ins**: `fs`, `child_process`, `net`, `crypto`, etc.
- **Auth Libraries**: `bcrypt`, `jsonwebtoken`
- **Environment Variables**: Non-public env vars (without `NEXT_PUBLIC_` prefix)

**Example Issue:**
```tsx
'use client';
import { db } from '@/lib/db'; // ❌ Server leak!

export function UserList() {
  // ...
}
```

**Fix:**
```tsx
// src/actions/users.ts
'use server';
import { db } from '@/lib/db';

export async function getUsers() {
  return await db.user.findMany();
}

// src/components/user-list.tsx
'use client';
import { getUsers } from '@/actions/users';
import { useEffect, useState } from 'react';

export function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    getUsers().then(setUsers);
  }, []);
  
  return <div>{/* render users */}</div>;
}
```

### 2. Client Leaks in Server Components

Detects when server components use React hooks without 'use client':

- `useState`, `useEffect`, `useContext`, `useReducer`
- `useCallback`, `useMemo`, `useRef`
- `window`, `document`, `localStorage`, `sessionStorage`

**Example Issue:**
```tsx
// Missing 'use client' directive
import { useState } from 'react'; // ❌ Client leak!

export function Counter() {
  const [count, setCount] = useState(0);
  // ...
}
```

**Fix:**
```tsx
'use client'; // ✅ Add this directive

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  // ...
}
```

### 3. Security Issues

- `eval()` usage
- `Function()` constructor
- Unsanitized `dangerouslySetInnerHTML`

### 4. Code Quality Issues

- CommonJS `require()` instead of ES6 imports
- `module.exports` instead of ES6 exports

## Configuration

### Scan Directories

Edit the `SCAN_DIRS` array in `find.ts`:

```typescript
const SCAN_DIRS = ['src/components', 'src/lib', 'src/app', 'src/hooks', 'src/actions'];
```

### Ignore Patterns

Edit the `IGNORE_PATTERNS` array:

```typescript
const IGNORE_PATTERNS = [
    /\.test\.(ts|tsx)$/,
    /\.spec\.(ts|tsx)$/,
    /\.stories\.(ts|tsx)$/,
    /\/__tests__\//,
    /\.config\.(ts|js)$/,
    /middleware\.(ts|js)$/
];
```

### Custom Patterns

Add your own patterns to detect:

```typescript
const SERVER_ONLY_PATTERNS = [
    // ... existing patterns
    { 
        pattern: "from '@/lib/my-server-module'", 
        fix: 'use only in server components', 
        severity: 'critical' 
    }
];
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Lint Client-Server Boundaries

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g tsx
      - run: npx tsx find.ts
```

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx tsx find.ts
```

## Output Example

```
🔎 Scanning for Next.js Client ↔ Server issues...

📁 Scanning 247 files...

📊 ISSUE SUMMARY:
   🔴 Critical: 3
   🟡 Warning: 1
   🔵 Info: 0

   Server leaks: 3
   Client leaks: 1
   Security issues: 0
   Code improvements: 0

🔴 CRITICAL ISSUES (3):
   src/components/user-list.tsx:5 - from '@/lib/db'
   src/components/profile.tsx:12 - useState
   src/lib/utils.tsx:8 - process.env.DATABASE_URL

🟡 WARNING ISSUES (1):
   src/components/image.tsx:3 - from 'sharp'

💡 Run with --fix or -f flag to see detailed fix suggestions
💡 Run with --verbose or -v flag to see more details

❌ Critical issues found. Fix these before proceeding.
```

## Exit Codes

- `0`: No critical issues (warnings or info only)
- `1`: Critical issues found

## Best Practices

### Server Components (Default in Next.js App Router)

```tsx
// No directive needed - server by default
import { db } from '@/lib/db';

export default async function UsersPage() {
  const users = await db.user.findMany();
  return <div>{/* render users */}</div>;
}
```

### Client Components

```tsx
'use client'; // Required for hooks and browser APIs

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Server Actions

```tsx
'use server'; // Required for server actions

import { db } from '@/lib/db';

export async function createUser(formData: FormData) {
  const name = formData.get('name');
  return await db.user.create({ data: { name } });
}
```

### Mixing Server and Client

```tsx
// app/users/page.tsx (Server Component)
import { db } from '@/lib/db';
import { UserList } from './user-list';

export default async function UsersPage() {
  const users = await db.user.findMany(); // Server-side data fetching
  return <UserList users={users} />; // Pass to client component
}

// app/users/user-list.tsx (Client Component)
'use client';

import { useState } from 'react';

export function UserList({ users }: { users: User[] }) {
  const [filter, setFilter] = useState('');
  // Client-side interactivity
  return <div>{/* render filtered users */}</div>;
}
```

## Troubleshooting

### False Positives

If the scanner reports false positives, you can:

1. Add the file to `IGNORE_PATTERNS`
2. Add a comment to suppress the warning (future feature)
3. Adjust the pattern matching in the code

### Missing Issues

If the scanner misses issues:

1. Check if the file is in `SCAN_DIRS`
2. Verify the file isn't in `IGNORE_PATTERNS`
3. Add custom patterns for your specific use case

## Contributing

To add new patterns or improve detection:

1. Edit the pattern arrays in `find.ts`
2. Test with `npx tsx find.ts`
3. Submit a PR with your improvements

## License

MIT
