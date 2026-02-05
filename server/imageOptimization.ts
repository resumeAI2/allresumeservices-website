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
 * Generate multiple optimized versions of an image.
 * Variant generation and storage uploads run in parallel for faster uploads and less client wait time.
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
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  const mime = ext === 'jpg' ? 'jpeg' : ext;

  // Get original metadata once
  const metadata = await sharp(buffer).metadata();
  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;

  // Generate all resized buffers in parallel (no uploads yet); one failure doesn't break others
  const variantResults = await Promise.allSettled(
    Object.entries(IMAGE_SIZES).map(async ([sizeName, sizeConfig]) => {
      let resizeOptions: sharp.ResizeOptions = {
        width: sizeConfig.width,
        fit: 'inside',
        withoutEnlargement: true,
      };
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
      const meta = await sharp(optimizedBuffer).metadata();
      return {
        sizeName,
        sizeConfig,
        buffer: optimizedBuffer,
        width: meta.width || sizeConfig.width,
        height: meta.height || 0,
      };
    })
  );
  type VariantResult = { sizeName: string; sizeConfig: ImageSize; buffer: Buffer; width: number; height: number };
  const variantBuffers = variantResults
    .filter((r): r is PromiseFulfilledResult<VariantResult> => r.status === 'fulfilled')
    .map((r) => r.value);
  variantResults.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`Failed to generate ${Object.keys(IMAGE_SIZES)[i]} variant:`, r.reason);
    }
  });

  // Upload original + all variants in parallel for minimal client wait
  const originalKey = `${basePath}/${nameWithoutExt}-${uniqueId}-original.${ext}`;
  const uploads = [
    storagePut(originalKey, buffer, `image/${mime}`).then((r) => ({
      size: 'original',
      url: r.url,
      width: originalWidth,
      height: originalHeight,
    })),
    ...variantBuffers.map((v) =>
      storagePut(
        `${basePath}/${nameWithoutExt}-${uniqueId}${v.sizeConfig.suffix}.jpg`,
        v.buffer,
        'image/jpeg'
      ).then((r) => ({
        size: v.sizeName,
        url: r.url,
        width: v.width,
        height: v.height,
      }))
    ),
  ];

  const results = await Promise.all(uploads);
  return results.filter((r): r is OptimizedImage => Boolean(r.url));
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
