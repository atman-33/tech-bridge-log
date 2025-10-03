import { useState } from "react";
import { cn } from "~/lib/utils";

type EnhancedImageProps = {
  src: string;
  alt: string;
  slug: string;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
};

export function EnhancedImage({
  src,
  alt,
  slug,
  className,
  loading = "lazy",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw",
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
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-border bg-muted p-8 text-muted-foreground",
          className
        )}
      >
        <div className="text-center">
          <div className="mb-2 text-2xl">🖼️</div>
          <p className="text-sm">Failed to load image</p>
          <p className="mt-1 text-muted-foreground text-xs">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-muted">
          <div className="text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        </div>
      )}

      {/* Main image */}
      <img
        alt={alt}
        className={cn(
          "h-auto w-full object-contain transition-opacity duration-300 sm:max-h-96",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        sizes={sizes}
        src={resolvedSrc}
      />
    </div>
  );
}

/**
 * Transforms image paths from relative to absolute public URLs
 */
function transformImagePath(imagePath: string, slug: string): string {
  // Handle relative paths starting with ./
  if (imagePath.startsWith("./")) {
    return `/blog-assets/${slug}/${imagePath.slice(2)}`;
  }

  // Handle relative paths without ./
  if (!(imagePath.startsWith("/") || imagePath.startsWith("http"))) {
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
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".avif",
    ".bmp",
    ".tiff",
  ];

  const ext = filename.toLowerCase().split(".").pop();
  return ext ? supportedExtensions.includes(`.${ext}`) : false;
}
