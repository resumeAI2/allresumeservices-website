/**
 * Database Query Optimization Utilities
 * 
 * Helpers to prevent common performance issues:
 * - N+1 queries
 * - Missing pagination
 * - Inefficient SELECT *
 */

import { logger } from './logger';

/**
 * Pagination helper to prevent unbounded queries
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20)); // Max 100 items per page
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Detect and warn about N+1 query patterns
 */
export class QueryTracker {
  private queries: Map<string, number> = new Map();
  private startTime: number = Date.now();

  track(queryType: string): void {
    const count = this.queries.get(queryType) || 0;
    this.queries.set(queryType, count + 1);

    // Warn if same query executed >10 times (likely N+1)
    if (count + 1 > 10) {
      logger.warn('Potential N+1 query detected', {
        queryType,
        count: count + 1,
        duration: Date.now() - this.startTime,
      });
    }
  }

  getStats() {
    return {
      totalQueries: Array.from(this.queries.values()).reduce((a, b) => a + b, 0),
      uniqueQueries: this.queries.size,
      duration: Date.now() - this.startTime,
      queries: Object.fromEntries(this.queries),
    };
  }
}

/**
 * Batch loader to prevent N+1 queries
 * 
 * Example usage:
 * 
 * // Instead of this (N+1):
 * for (const post of posts) {
 *   post.author = await getUser(post.authorId);
 * }
 * 
 * // Do this (1 query):
 * const authorIds = posts.map(p => p.authorId);
 * const authors = await batchLoad(authorIds, async (ids) => {
 *   return await db.select().from(users).where(inArray(users.id, ids));
 * });
 */
export async function batchLoad<K, V>(
  keys: K[],
  loader: (keys: K[]) => Promise<V[]>,
  keyExtractor: (item: V) => K
): Promise<Map<K, V>> {
  if (keys.length === 0) {
    return new Map();
  }

  const uniqueKeys = Array.from(new Set(keys));
  const items = await loader(uniqueKeys);

  const map = new Map<K, V>();
  for (const item of items) {
    map.set(keyExtractor(item), item);
  }

  return map;
}

/**
 * Query performance wrapper
 */
export async function trackQuery<T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  
  try {
    const result = await query();
    const duration = Date.now() - start;

    if (duration > 100) {
      logger.warn('Slow database query', {
        query: queryName,
        duration,
      });
    } else if (process.env.DEBUG === 'true') {
      logger.debug('Query executed', {
        query: queryName,
        duration,
      });
    }

    return result;
  } catch (error) {
    logger.error('Query failed', error as Error, {
      query: queryName,
    });
    throw error;
  }
}

/**
 * Common query optimizations
 */
export const queryOptimizations = {
  /**
   * Get only IDs (much faster than full records)
   */
  getIds: <T extends { id: number }>(records: T[]): number[] => {
    return records.map(r => r.id);
  },

  /**
   * Chunk large arrays to prevent "too many SQL variables" error
   */
  chunkArray: <T>(array: T[], chunkSize: number = 1000): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  },

  /**
   * Deduplicate array (useful for batch loading)
   */
  dedupe: <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
  },
};

/**
 * Example optimized query pattern:
 * 
 * // Get blog posts with author names (avoiding N+1)
 * async function getBlogPostsWithAuthors() {
 *   const posts = await db.select().from(blog_posts).limit(20);
 *   
 *   const authorIds = queryOptimizations.dedupe(posts.map(p => p.authorId));
 *   const authors = await batchLoad(
 *     authorIds,
 *     async (ids) => await db.select().from(users).where(inArray(users.id, ids)),
 *     (user) => user.id
 *   );
 *   
 *   return posts.map(post => ({
 *     ...post,
 *     author: authors.get(post.authorId),
 *   }));
 * }
 */
