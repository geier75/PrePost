// src/lib/rate-limit.ts
import { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: async (request: NextRequest, limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      const currentTime = Date.now();
      const windowStart = currentTime - (options?.interval || 60000);
      
      // Filter out old timestamps
      const requestsInWindow = tokenCount.filter(timestamp => timestamp > windowStart);
      
      if (requestsInWindow.length >= limit) {
        throw new Error('Rate limit exceeded');
      }
      
      requestsInWindow.push(currentTime);
      tokenCache.set(token, requestsInWindow);
    },
  };
}