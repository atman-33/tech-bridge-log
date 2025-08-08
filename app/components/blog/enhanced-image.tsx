import { useState } from 'react';
import { cn } from '~/lib/utils';

interface EnhancedImageProps {
  src: string;
  alt: string;
  slug: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

export function EnhancedImage({
  src,
  alt,
  slug,
  className,
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw',
}: EnhancedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Transform relative paths to absolute public URLs
  const resolvedSrc = transformImagePath(src, slug);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-muted border border-border rounded-lg p-8 text-muted-foreground',
        className
      )}>
        <div className="text-center">
          <div className="text-2xl mb-2">🖼️</div>
          <p className="text-sm">Failed to load image</p>
          <p className="text-xs text-muted-foreground mt-1">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground">
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Main image */}
      <img
        src={resolvedSrc}
        alt={alt}
        loading={loading}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-auto sm:max-h-96 object-contain transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      />
    </div>
  );
}

/**
 * Transforms image paths from relative to absolute public URLs
 */
function transformImagePath(imagePath: string, slug: string): string {
  // Handle relative paths starting with ./
  if (imagePath.startsWith('./')) {
    return `/blog-assets/${slug}/${imagePath.slice(2)}`;
  }

  // Handle relative paths without ./
  if (!imagePath.startsWith('/') && !imagePath.startsWith('http')) {
    return `/blog-assets/${slug}/${imagePath}`;
  }

  // Return absolute paths and URLs as-is
  return imagePath;
}

/**
 * Checks if a file extension is a supported image format
 */
export function isSupportedImageFormat(filename: string): boolean {
  const supportedExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.svg',
    '.webp', '.avif', '.bmp', '.tiff'
  ];

  const ext = filename.toLowerCase().split('.').pop();
  return ext ? supportedExtensions.includes(`.${ext}`) : false;
}