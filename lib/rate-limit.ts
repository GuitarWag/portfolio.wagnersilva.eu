/**
 * Simple in-memory rate limiter
 * For distributed systems, consider Upstash Redis or Vercel KV
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

class RateLimiter {
    private cache: Map<string, RateLimitEntry> = new Map();
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Cleanup expired entries every 5 minutes
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [key, entry] of this.cache.entries()) {
                if (entry.resetAt < now) {
                    this.cache.delete(key);
                }
            }
        }, 5 * 60 * 1000);
    }

    /**
     * Check if request is allowed
     * @param identifier - Unique identifier (IP address, user ID, etc.)
     * @param limit - Max requests allowed
     * @param windowMs - Time window in milliseconds
     * @returns { allowed: boolean, remaining: number, resetAt: number }
     */
    check(identifier: string, limit: number, windowMs: number): {
        allowed: boolean;
        remaining: number;
        resetAt: number;
        retryAfter?: number;
    } {
        const now = Date.now();
        const entry = this.cache.get(identifier);

        // No entry or expired - create new
        if (!entry || entry.resetAt < now) {
            const resetAt = now + windowMs;
            this.cache.set(identifier, { count: 1, resetAt });
            return {
                allowed: true,
                remaining: limit - 1,
                resetAt,
            };
        }

        // Check if limit exceeded
        if (entry.count >= limit) {
            return {
                allowed: false,
                remaining: 0,
                resetAt: entry.resetAt,
                retryAfter: Math.ceil((entry.resetAt - now) / 1000), // seconds
            };
        }

        // Increment count
        entry.count++;
        return {
            allowed: true,
            remaining: limit - entry.count,
            resetAt: entry.resetAt,
        };
    }

    /**
     * Reset rate limit for an identifier (useful for testing or admin override)
     */
    reset(identifier: string): void {
        this.cache.delete(identifier);
    }

    /**
     * Get current status without incrementing
     */
    status(identifier: string, limit: number, windowMs: number): {
        count: number;
        remaining: number;
        resetAt: number;
    } {
        const now = Date.now();
        const entry = this.cache.get(identifier);

        if (!entry || entry.resetAt < now) {
            return {
                count: 0,
                remaining: limit,
                resetAt: now + windowMs,
            };
        }

        return {
            count: entry.count,
            remaining: Math.max(0, limit - entry.count),
            resetAt: entry.resetAt,
        };
    }

    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.cache.clear();
    }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Rate limit configuration presets
 */
export const RateLimitPresets = {
    // Very strict - for expensive operations
    STRICT: { limit: 5, windowMs: 60 * 1000 }, // 5 requests per minute

    // Standard - for normal API endpoints
    STANDARD: { limit: 10, windowMs: 60 * 1000 }, // 10 requests per minute

    // Relaxed - for lightweight operations
    RELAXED: { limit: 30, windowMs: 60 * 1000 }, // 30 requests per minute

    // Generous - for development/testing
    GENEROUS: { limit: 60, windowMs: 60 * 1000 }, // 60 requests per minute
} as const;

/**
 * Helper to get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
    // Try to get real IP from headers (Vercel, Cloudflare, etc.)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    // Use first IP from x-forwarded-for if available
    const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0]?.trim() || 'unknown';

    // Fallback: use user agent hash if no IP (shouldn't happen in production)
    if (ip === 'unknown') {
        const userAgent = request.headers.get('user-agent') || 'unknown-ua';
        // Simple hash function
        let hash = 0;
        for (let i = 0; i < userAgent.length; i++) {
            hash = ((hash << 5) - hash) + userAgent.charCodeAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }
        return `ua-${hash}`;
    }

    return ip;
}
