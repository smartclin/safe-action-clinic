# Pedia Safe Actions

## Overview

A pediatric clinic management system built with Next.js 16 App Router, featuring role-based authentication (Admin, Doctor, Staff, Patient), appointment scheduling, medical records management, prescription handling, and financial tracking. The application is designed for pediatric healthcare providers to manage patient care, immunization schedules, growth tracking, and clinic operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router and React Server Components
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **UI Components**: Radix UI primitives wrapped by shadcn/ui components

### Backend Architecture
- **API Routes**: Next.js App Router API routes under `src/app/api/`
- **Authentication**: Better-Auth library with session-based auth and role-based access control
- **Middleware**: Custom proxy middleware (`src/proxy.ts`) handles route protection and role-based redirects
- **Server Actions**: Used for form submissions and data mutations

### Data Storage
- **ORM**: Prisma 7 with PostgreSQL adapter (`@prisma/adapter-pg`)
- **Database**: PostgreSQL with connection pooling via Prisma Accelerate extension
- **Schema Location**: `prisma/schema.prisma` with generated client in `generated/` directory
- **Materialized Views**: Multiple MVs for dashboard analytics (ClinicDashboardMV, DoctorPerformanceMV, PatientOverviewMV, etc.)

### Authentication & Authorization
- **Auth Library**: Better-Auth with session cookies
- **User Roles**: ADMIN, STAFF, DOCTOR, PATIENT (defined in Prisma enum)
- **Route Protection**: Middleware checks session cookies and redirects based on role
- **Session Management**: Server-side session fetching with Suspense boundaries to avoid blocking root layout

### Key Design Patterns
- **Route Groups**: `(auth)` for authentication pages, `(protected)` for authenticated routes
- **Client/Server Separation**: Strict separation enforced by custom scanner tools (`find.ts`, `check.ts`)
- **Non-blocking Layouts**: Session fetching wrapped in Suspense to comply with Next.js 16 requirements
- **Type Safety**: TypeScript with strict mode, typed routes enabled in Next.js config

### Code Quality Tools
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Custom Scanners**: Static analysis tools to detect client/server boundary violations
- **Type Checking**: TypeScript with `noUncheckedIndexedAccess` enabled

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Prisma Accelerate**: Connection pooling and caching extension

### Authentication
- **Better-Auth**: Session-based authentication with role management

### UI Libraries
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **Lucide Icons**: Icon library
- **cmdk**: Command palette component
- **date-fns**: Date manipulation

### Development Tools
- **Biome**: Fast linter and formatter
- **tsx**: TypeScript execution for scripts
- **rimraf**: Cross-platform file deletion for clean scripts

### Data Generation
- **Faker.js**: Seed data generation for development

### Runtime
- **Node.js 20.9+**: Required for Next.js 16
- **Bun**: Alternative runtime used for some scripts (optional)
