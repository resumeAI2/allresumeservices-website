import sharp from 'sharp';
import { storagePut } from './storage';

export interface ImageSize {
  width: number;
  height?: number;
  suffix: string;
  quality?: number;
}

// Define image size variants for responsive images
export const IMAGE_SIZES: Record<string, ImageSize> = {
  thumbnail: { width: 150, height: 150, suffix: '-thumb', quality: 80 },
  small: { width: 400, suffix: '-small', quality: 85 },
  medium: { width: 800, suffix: '-medium', quality: 85 },
  large: { width: 1200, suffix: '-large', quality: 90 },
};

export interface OptimizedImage {
  size: string;
  url: string;
  width: number;
  height: number;
}

/**
 * Generate multiple optimized versions of an image
 * @param buffer - Original image buffer
 * @param filename - Original filename
 * @param basePath - Base S3 path (e.g., 'blog-images')
 * @returns Array of optimized image URLs with metadata
 */
export async function generateOptimizedImages(
  buffer: Buffer,
  filename: string,
  basePath: string = 'blog-images'
): Promise<OptimizedImage[]> {
  const optimizedImages: OptimizedImage[] = [];
  
  // Get original image metadata
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  // Extract filename without extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  
  // Generate a unique identifier to prevent enumeration
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  
  // Store original image
  const originalKey = `${basePath}/${nameWithoutExt}-${uniqueId}-original.${ext}`;
  const originalResult = await storagePut(
    originalKey,
    buffer,
    `image/${ext === 'jpg' ? 'jpeg' : ext}`
  );
  
  optimizedImages.push({
    size: 'original',
    url: originalResult.url,
    width: metadata.width || 0,
    height: metadata.height || 0,
  });
  
  // Generate optimized variants
  for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES)) {
    try {
      let resizeOptions: sharp.ResizeOptions = {
        width: sizeConfig.width,
        fit: 'inside',
        withoutEnlargement: true,
      };
      
      // For thumbnails, use cover fit to create square images
      if (sizeName === 'thumbnail' && sizeConfig.height) {
        resizeOptions = {
          width: sizeConfig.width,
          height: sizeConfig.height,
          fit: 'cover',
          position: 'center',
        };
      }
      
      const optimizedBuffer = await sharp(buffer)
        .resize(resizeOptions)
        .jpeg({ quality: sizeConfig.quality || 85, progressive: true })
        .toBuffer();
      
      const optimizedMetadata = await sharp(optimizedBuffer).metadata();
      
      const optimizedKey = `${basePath}/${nameWithoutExt}-${uniqueId}${sizeConfig.suffix}.jpg`;
      const result = await storagePut(
        optimizedKey,
        optimizedBuffer,
        'image/jpeg'
      );
      
      optimizedImages.push({
        size: sizeName,
        url: result.url,
        width: optimizedMetadata.width || sizeConfig.width,
        height: optimizedMetadata.height || 0,
      });
    } catch (error) {
      console.error(`Failed to generate ${sizeName} variant:`, error);
      // Continue with other sizes even if one fails
    }
  }
  
  return optimizedImages;
}

/**
 * Convert base64 image to buffer and generate optimized versions
 * @param base64Data - Base64 encoded image data
 * @param filename - Original filename
 * @param basePath - Base S3 path
 * @returns Array of optimized image URLs with metadata
 */
export async function optimizeBase64Image(
  base64Data: string,
  filename: string,
  basePath: string = 'blog-images'
): Promise<OptimizedImage[]> {
  // Remove data URL prefix if present
  const base64String = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64String, 'base64');
  
  return generateOptimizedImages(buffer, filename, basePath);
}

/**
 * Get the most appropriate image URL based on desired width
 * @param images - Array of optimized images
 * @param desiredWidth - Desired width in pixels
 * @returns URL of the most appropriate image
 */
export function getResponsiveImageUrl(images: OptimizedImage[], desiredWidth: number): string {
  if (!images || images.length === 0) return '';
  
  // Sort images by width
  const sortedImages = [...images].sort((a, b) => a.width - b.width);
  
  // Find the smallest image that is larger than or equal to desired width
  const appropriateImage = sortedImages.find(img => img.width >= desiredWidth);
  
  // If no image is large enough, return the largest available
  return appropriateImage?.url || sortedImages[sortedImages.length - 1].url;
}
