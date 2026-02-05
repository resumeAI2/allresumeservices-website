/**
 * Get the appropriate image URL based on size requirement
 * Falls back to original image if optimised variants are not available
 */
export function getImageUrl(
  imageUrl: string | null | undefined,
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium'
): string {
  if (!imageUrl) return '/blog/default.jpg';
  
  // If it's already a full URL, return it
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // Ensure relative paths work from site root (prepend / if missing)
  if (imageUrl.startsWith('/')) return imageUrl;
  return `/${imageUrl}`;
}

/**
 * Resolve case study image URL for display (handles relative paths from API).
 * Returns null if no URL so callers can show a placeholder.
 */
export function resolveCaseStudyImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : `/${url}`;
}

/**
 * Get optimised image URL from uploaded image object
 */
export function getOptimisedImageUrl(
  image: {
    url?: string | null;
    thumbnailUrl?: string | null;
    smallUrl?: string | null;
    mediumUrl?: string | null;
    largeUrl?: string | null;
  },
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original' = 'medium'
): string {
  if (!image) return '/blog/default.jpg';
  
  switch (size) {
    case 'thumbnail':
      return image.thumbnailUrl || image.smallUrl || image.url || '/blog/default.jpg';
    case 'small':
      return image.smallUrl || image.mediumUrl || image.url || '/blog/default.jpg';
    case 'medium':
      return image.mediumUrl || image.largeUrl || image.url || '/blog/default.jpg';
    case 'large':
      return image.largeUrl || image.url || '/blog/default.jpg';
    case 'original':
    default:
      return image.url || '/blog/default.jpg';
  }
}
