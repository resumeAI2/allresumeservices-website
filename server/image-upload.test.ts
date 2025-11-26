import { describe, it, expect } from 'vitest';
import { uploadImage } from './blog';

describe('Blog Image Upload', () => {
  it('should upload image to S3 and return URL', async () => {
    // Create a small test image (1x1 red pixel PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    
    const result = await uploadImage(
      'test-image.png',
      'image/png',
      testImageBase64
    );
    
    expect(result).toBeDefined();
    expect(result).toHaveProperty('url');
    expect(result).toHaveProperty('key');
    expect(typeof result.url).toBe('string');
    expect(typeof result.key).toBe('string');
    expect(result.url).toContain('http');
    expect(result.key).toContain('blog/');
  });

  it('should generate unique filenames for uploaded images', async () => {
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    
    const result1 = await uploadImage('test.png', 'image/png', testImageBase64);
    const result2 = await uploadImage('test.png', 'image/png', testImageBase64);
    
    // Keys should be different even with same filename
    expect(result1.key).not.toBe(result2.key);
  });

  it('should preserve file extension in uploaded filename', async () => {
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    
    const result = await uploadImage('test-image.jpg', 'image/jpeg', testImageBase64);
    
    expect(result.key).toMatch(/\.jpg$/);
  });

  it('should store images in blog directory', async () => {
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    
    const result = await uploadImage('test.png', 'image/png', testImageBase64);
    
    expect(result.key).toMatch(/^blog\//);
  });
});
