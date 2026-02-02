/**
 * Simple In-Memory Cache
 * 
 * Reduces database load by caching frequently accessed data.
 * For production, consider Redis or another distributed cache.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly defaultTTL: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached data or fetch and cache if not found
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached data if not expired
    if (cached && cached.expiresAt > now) {
      return cached.data as T;
    }

    // Fetch fresh data
    const data = await fetcher();
    
    // Cache the result
    this.cache.set(key, {
      data,
      expiresAt: now + ttl,
    });

    return data;
  }

  /**
   * Set cache entry directly
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: RegExp): void {
    for (const key of Array.from(this.cache.keys())) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Cleanup expired entries (run periodically)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new SimpleCache();

// Cleanup expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}

/**
 * Cache key generators for common patterns
 */
export const cacheKeys = {
  blogPost: (slug: string) => `blog:post:${slug}`,
  blogPosts: (published: boolean) => `blog:posts:${published ? 'published' : 'all'}`,
  testimonials: (approved: boolean, featured: boolean) => 
    `testimonials:${approved ? 'approved' : 'all'}:${featured ? 'featured' : 'all'}`,
  caseStudy: (slug: string) => `case-study:${slug}`,
  caseStudies: (published: boolean) => `case-studies:${published ? 'published' : 'all'}`,
  user: (email: string) => `user:${email}`,
  promoCode: (code: string) => `promo:${code}`,
  categories: () => 'blog:categories',
  tags: () => 'blog:tags',
};

/**
 * Example usage:
 * 
 * const posts = await cache.get(
 *   cacheKeys.blogPosts(true),
 *   () => getAllBlogPosts(true),
 *   10 * 60 * 1000 // 10 minutes
 * );
 * 
 * // Invalidate when creating/updating/deleting
 * cache.invalidatePattern(/^blog:/);
 */
