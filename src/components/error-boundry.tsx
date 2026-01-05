// components/error-boundary.tsx
'use client';

import { AlertTriangle } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}

function DefaultErrorFallback({ error }: { error?: Error }) {
    const isAuthError =
        error?.message?.includes('auth') ||
        error?.message?.includes('session') ||
        error?.message?.includes('unauthorized');

    return (
        <div className='flex min-h-[50vh] flex-col items-center justify-center p-8'>
            <AlertTriangle className='mb-4 h-12 w-12 text-destructive' />

            <h2 className='mb-2 font-bold text-2xl'>{isAuthError ? 'Authentication Error' : 'Something went wrong'}</h2>

            <p className='mb-6 max-w-md text-center text-muted-foreground'>
                {isAuthError
                    ? 'There was an issue with your session. Please try logging in again.'
                    : 'An unexpected error occurred. Please try refreshing the page.'}
            </p>

            <div className='flex gap-3'>
                <Button
                    onClick={() => window.location.reload()}
                    variant='outline'
                >
                    Refresh Page
                </Button>

                {isAuthError && (
                    <Button asChild>
                        <a href='/login'>Go to Login</a>
                    </Button>
                )}
            </div>

            {process.env.NODE_ENV === 'development' && error && (
                <pre className='mt-8 max-w-2xl overflow-auto rounded-lg bg-muted p-4 text-sm'>
                    {error.message}
                    {'\n'}
                    {error.stack}
                </pre>
            )}
        </div>
    );
}
