import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('Image Gallery', () => {
  it('should retrieve all uploaded images', async () => {
    const caller = appRouter.createCaller({} as any);
    
    const images = await caller.blog.getAllImages();
    
    expect(Array.isArray(images)).toBe(true);
    
    // If there are images, verify structure
    if (images.length > 0) {
      const image = images[0];
      expect(image).toHaveProperty('id');
      expect(image).toHaveProperty('filename');
      expect(image).toHaveProperty('url');
      expect(image).toHaveProperty('contentType');
      expect(image).toHaveProperty('size');
      expect(image).toHaveProperty('uploadedAt');
      
      expect(typeof image.id).toBe('number');
      expect(typeof image.filename).toBe('string');
      expect(typeof image.url).toBe('string');
      expect(typeof image.contentType).toBe('string');
      expect(image.url).toMatch(/^https?:\/\//);
    }
  });

  it('should upload and track image metadata', async () => {
    const caller = appRouter.createCaller({} as any);
    
    // Create a small test image (1x1 transparent PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    const result = await caller.blog.uploadImage({
      filename: 'test-gallery-image.png',
      contentType: 'image/png',
      base64Data: testImageBase64,
    });
    
    expect(result).toHaveProperty('url');
    expect(result.url).toMatch(/^https?:\/\//);
    
    // Verify image was saved to database
    const images = await caller.blog.getAllImages();
    const uploadedImage = images.find(img => img.filename === 'test-gallery-image.png');
    
    expect(uploadedImage).toBeDefined();
    if (uploadedImage) {
      expect(uploadedImage.contentType).toBe('image/png');
      expect(uploadedImage.url).toBe(result.url);
    }
  });
});
