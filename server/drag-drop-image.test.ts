import { describe, it, expect } from 'vitest';
import { uploadImage } from './blog';

describe('Drag-and-Drop Image Upload', () => {
  it('should handle multiple image uploads sequentially', async () => {
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    
    const uploads = await Promise.all([
      uploadImage('image1.png', 'image/png', testImageBase64),
      uploadImage('image2.png', 'image/png', testImageBase64),
      uploadImage('image3.png', 'image/png', testImageBase64),
    ]);
    
    expect(uploads).toHaveLength(3);
    uploads.forEach(result => {
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('key');
      expect(result.url).toContain('http');
    });
    
    // All URLs should be unique
    const urls = uploads.map(u => u.url);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(3);
  });

  it('should support common image formats', async () => {
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    
    const formats = [
      { filename: 'test.png', contentType: 'image/png' },
      { filename: 'test.jpg', contentType: 'image/jpeg' },
      { filename: 'test.gif', contentType: 'image/gif' },
      { filename: 'test.webp', contentType: 'image/webp' },
    ];
    
    for (const format of formats) {
      const result = await uploadImage(format.filename, format.contentType, testImageBase64);
      expect(result).toBeDefined();
      expect(result.url).toContain('http');
      expect(result.key).toContain('blog/');
    }
  });

  it('should handle images with special characters in filename', async () => {
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    
    const result = await uploadImage(
      'my test image (copy) [1].png',
      'image/png',
      testImageBase64
    );
    
    expect(result).toBeDefined();
    expect(result.url).toContain('http');
    expect(result.key).toContain('blog/');
  });

  it('should return publicly accessible URLs', async () => {
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    
    const result = await uploadImage('test.png', 'image/png', testImageBase64);
    
    // URL should be a valid HTTP/HTTPS URL
    expect(result.url).toMatch(/^https?:\/\/.+/);
    
    // Should not contain localhost
    expect(result.url).not.toContain('localhost');
  });
});
