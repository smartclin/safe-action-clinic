import 'server-only';

// lib/rate-limit.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { getCache, setCache } from './local-cache';

interface RateLimitResult {
    success: boolean;
    limit?: number;
    remaining?: number;
    reset?: number;
    ip?: string;
}

/**
 * Check rate limit for a given request or IP.
 * Uses in-memory cache for local development.
 */
export async function checkRateLimit(req?: Request, limit = 10, windowMs = 10_000): Promise<RateLimitResult> {
    const headersList = req ? req.headers : await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? headersList.get('x-real-ip') ?? 'anonymous';

    const cacheKey = `rate-limit:${ip}`;
    const now = Date.now();

    let record = getCache<{ count: number; reset: number }>(cacheKey);

    if (!record) {
        record = { count: 0, reset: now + windowMs };
    }

    if (record.count >= limit) {
        return {
            success: false,
            limit,
            remaining: 0,
            reset: record.reset,
            ip
        };
    }

    record.count += 1;
    setCache(cacheKey, record);

    return {
        success: true,
        limit,
        remaining: limit - record.count,
        reset: record.reset,
        ip
    };
}

/**
 * Standard 429 response for rate-limited requests.
 */
export function rateLimitResponse(result: { limit?: number; remaining?: number; reset?: number }) {
    return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        {
            status: 429,
            headers: {
                'X-RateLimit-Limit': String(result.limit ?? 10),
                'X-RateLimit-Remaining': String(result.remaining ?? 0),
                'X-RateLimit-Reset': String(result.reset ?? Date.now() + 10_000)
            }
        }
    );
}
