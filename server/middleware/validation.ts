import { z } from 'zod';

/**
 * Input Validation Schemas
 * 
 * Centralized validation to prevent:
 * - Buffer overflow attacks
 * - Path traversal
 * - Excessive resource usage
 * - Invalid data formats
 */

export const inputValidation = {
  // User input fields
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
    
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
    
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters'),
    
  phone: z.string()
    .max(50, 'Phone number must be less than 50 characters')
    .optional()
    .transform(val => val?.trim()),
    
  // Content fields
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
    
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
    
  content: z.string()
    .min(1, 'Content is required')
    .max(100000, 'Content must be less than 100,000 characters'),
    
  excerpt: z.string()
    .max(500, 'Excerpt must be less than 500 characters')
    .trim(),
    
  slug: z.string()
    .min(1, 'Slug is required')
    .max(200, 'Slug must be less than 200 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .trim(),
    
  // File upload
  filename: z.string()
    .max(255, 'Filename must be less than 255 characters')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Invalid filename - only letters, numbers, dots, underscores, and hyphens allowed'),
    
  // URLs
  url: z.string()
    .url('Invalid URL')
    .max(2048, 'URL must be less than 2048 characters')
    .refine(
      (url) => {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      },
      'Only HTTP and HTTPS URLs are allowed'
    ),
    
  // Numeric fields
  rating: z.number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
    
  // Enums
  status: z.enum(['new', 'contacted', 'converted', 'archived']),
  
  // ID fields
  id: z.number()
    .int('ID must be a whole number')
    .positive('ID must be positive'),
};

/**
 * Sanitize HTML to prevent XSS in rich text content
 */
export function sanitizeHtmlContent(html: string): string {
  // Basic sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
}

/**
 * Validate file upload size
 */
export function validateFileSize(sizeInBytes: number, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return sizeInBytes <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function validateFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
}
