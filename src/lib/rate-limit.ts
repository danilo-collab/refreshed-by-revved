import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a rate limiter only if Redis is configured
function createRateLimiter() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const redis = new Redis({ url, token });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
}

export const rateLimiter = createRateLimiter();

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  if (!rateLimiter) {
    // If rate limiter is not configured, allow all requests
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }

  const result = await rateLimiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
