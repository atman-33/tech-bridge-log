import { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  showPlaceholder?: boolean;
  placeholderIcon?: React.ReactNode;
  className?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  showPlaceholder = true,
  placeholderIcon,
  className = '',
  ...props
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // If there's an error and no fallback, show placeholder
  if (imageError && !fallbackSrc) {
    if (!showPlaceholder) {
      return null;
    }

    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
        role="img"
        aria-label={alt}
      >
        {placeholderIcon || (
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>
    );
  }

  return (
    <>
      {isLoading && showPlaceholder && (
        <div
          className={`flex items-center justify-center bg-muted text-muted-foreground animate-pulse ${className}`}
          role="img"
          aria-label="Loading image..."
        >
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
      <img
        src={imageError && fallbackSrc ? fallbackSrc : src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...props}
      />
    </>
  );
}

// Specific component for article thumbnails
export function ArticleThumbnail({
  src,
  alt,
  className = '',
  ...props
}: Omit<ImageWithFallbackProps, 'fallbackSrc' | 'placeholderIcon'>) {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={`rounded-lg object-cover ${className}`}
      placeholderIcon={
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <span className="text-xs">Article Image</span>
        </div>
      }
      {...props}
    />
  );
}