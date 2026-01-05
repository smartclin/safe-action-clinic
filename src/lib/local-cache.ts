// lib/local-cache.ts
import { LRUCache } from 'lru-cache';

type CacheValue = Record<string, unknown>; // satisfies LRUCache constraint

export const localCache = new LRUCache<string, CacheValue>({
    max: 500,
    ttl: 60 * 1000 // 1 minute
});

/**
 * Retrieves an item and casts it to the desired type.
 */
export function getCache<T extends CacheValue>(key: string): T | undefined {
    return localCache.get(key) as T | undefined;
}

/**
 * Sets an item in the cache.
 */
export function setCache<T extends CacheValue>(key: string, value: T): void {
    localCache.set(key, value);
}

/**
 * Deletes an item from the cache.
 */
export function deleteCache(key: string): void {
    localCache.delete(key);
}
