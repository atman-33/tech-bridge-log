import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";

export interface ImageAsset {
  originalPath: string;
  publicPath: string;
  filename: string;
  extension: string;
  size: number;
  isOptimized: boolean;
}

export interface ImageProcessingResult {
  assets: ImageAsset[];
  thumbnailPath: string | null;
  errors: string[];
}

const SUPPORTED_IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".avif",
  ".bmp",
  ".tiff",
] as const;

const PUBLIC_ASSETS_DIR = "public/blog-assets";

/**
 * Checks if a file is a supported image format
 */
export function isSupportedImageFormat(filename: string): boolean {
  const ext = extname(filename).toLowerCase();
  return SUPPORTED_IMAGE_EXTENSIONS.includes(ext as any);
}

/**
 * Generates a public URL path for an article asset
 */
export function generateAssetUrl(slug: string, filename: string): string {
  return `/blog-assets/${slug}/${filename}`;
}

/**
 * Resolves relative image paths in article content to public URLs
 */
export function resolveImagePath(imagePath: string, slug: string): string {
  // Handle relative paths starting with ./
  if (imagePath.startsWith("./")) {
    return generateAssetUrl(slug, imagePath.slice(2));
  }

  // Handle relative paths without ./
  if (!imagePath.startsWith("/") && !imagePath.startsWith("http")) {
    return generateAssetUrl(slug, imagePath);
  }

  // Return absolute paths and URLs as-is
  return imagePath;
}

/**
 * Generates thumbnail URL from frontmatter thumbnail field
 */
export function resolveThumbnailPath(
  thumbnailPath: string,
  slug: string,
): string {
  return resolveImagePath(thumbnailPath, slug);
}

/**
 * Gets image file information including size
 */
async function getImageInfo(filePath: string): Promise<{
  size: number;
  filename: string;
  extension: string;
}> {
  const stats = await stat(filePath);
  const filename = basename(filePath);
  const extension = extname(filePath).toLowerCase();

  return {
    size: stats.size,
    filename,
    extension,
  };
}

/**
 * Discovers all image assets in an article directory
 */
export async function discoverArticleImages(
  articleDir: string,
): Promise<string[]> {
  if (!existsSync(articleDir)) {
    return [];
  }

  const images: string[] = [];
  const entries = await readdir(articleDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name !== "index.mdx") {
      if (isSupportedImageFormat(entry.name)) {
        images.push(join(articleDir, entry.name));
      }
    }
  }

  return images;
}

/**
 * Copies and processes images from article directory to public assets
 */
export async function processArticleImages(
  articleDir: string,
  slug: string,
): Promise<ImageProcessingResult> {
  const publicDir = join(PUBLIC_ASSETS_DIR, slug);
  const assets: ImageAsset[] = [];
  const errors: string[] = [];
  let thumbnailPath: string | null = null;

  // Ensure public directory exists
  try {
    if (!existsSync(dirname(publicDir))) {
      await mkdir(dirname(publicDir), { recursive: true });
    }
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }
  } catch (error) {
    const errorMsg = `Failed to create public directory ${publicDir}: ${error}`;
    errors.push(errorMsg);
    console.error(errorMsg);
    return { assets, thumbnailPath, errors };
  }

  // Discover all images in the article directory
  const imagePaths = await discoverArticleImages(articleDir);

  for (const imagePath of imagePaths) {
    try {
      const imageInfo = await getImageInfo(imagePath);
      const destPath = join(publicDir, imageInfo.filename);

      // Copy the image file
      await copyFile(imagePath, destPath);

      // Create asset record
      const asset: ImageAsset = {
        originalPath: imagePath,
        publicPath: generateAssetUrl(slug, imageInfo.filename),
        filename: imageInfo.filename,
        extension: imageInfo.extension,
        size: imageInfo.size,
        isOptimized: false, // TODO: Implement optimization
      };

      assets.push(asset);

      // Check if this is a thumbnail image
      if (imageInfo.filename.toLowerCase().includes("thumbnail")) {
        thumbnailPath = asset.publicPath;
      }

      console.log(
        `✓ Copied image asset: ${imageInfo.filename} (${formatFileSize(imageInfo.size)})`,
      );
    } catch (error) {
      const errorMsg = `Failed to process image ${imagePath}: ${error}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }
  }

  return { assets, thumbnailPath, errors };
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Validates that a thumbnail path exists in the article assets
 */
export function validateThumbnailPath(
  thumbnailPath: string,
  assets: ImageAsset[],
  slug: string,
): { isValid: boolean; resolvedPath: string; error?: string } {
  const resolvedPath = resolveThumbnailPath(thumbnailPath, slug);

  // Check if the resolved path matches any of the processed assets
  const matchingAsset = assets.find(
    (asset) => asset.publicPath === resolvedPath,
  );

  if (!matchingAsset) {
    return {
      isValid: false,
      resolvedPath,
      error: `Thumbnail image not found: ${thumbnailPath}. Available images: ${assets.map((a) => a.filename).join(", ")}`,
    };
  }

  return {
    isValid: true,
    resolvedPath,
  };
}

/**
 * Optimizes images for web delivery (placeholder for future implementation)
 */
export async function optimizeImage(
  imagePath: string,
  outputPath: string,
  options: {
    quality?: number;
    width?: number;
    height?: number;
    format?: "webp" | "avif" | "jpeg" | "png";
  } = {},
): Promise<{
  success: boolean;
  originalSize: number;
  optimizedSize?: number;
  error?: string;
}> {
  // TODO: Implement actual image optimization using sharp or similar library
  // For now, just copy the file as-is
  try {
    const stats = await stat(imagePath);
    await copyFile(imagePath, outputPath);

    return {
      success: true,
      originalSize: stats.size,
      optimizedSize: stats.size, // Same size since no optimization yet
    };
  } catch (error) {
    return {
      success: false,
      originalSize: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generates responsive image variants (placeholder for future implementation)
 */
export async function generateResponsiveImages(
  imagePath: string,
  outputDir: string,
  sizes: number[] = [320, 640, 1024, 1920],
): Promise<{
  variants: Array<{ width: number; path: string; size: number }>;
  errors: string[];
}> {
  // TODO: Implement responsive image generation
  // For now, return the original image as the only variant
  const variants: Array<{ width: number; path: string; size: number }> = [];
  const errors: string[] = [];

  try {
    const stats = await stat(imagePath);
    const filename = basename(imagePath);
    const originalPath = join(outputDir, filename);

    await copyFile(imagePath, originalPath);

    variants.push({
      width: 1920, // Assume original is full width
      path: originalPath,
      size: stats.size,
    });
  } catch (error) {
    errors.push(`Failed to generate responsive images: ${error}`);
  }

  return { variants, errors };
}

/**
 * Cleans up unused image assets from public directory
 */
export async function cleanupUnusedAssets(
  activeArticleSlugs: string[],
): Promise<{ cleaned: string[]; errors: string[] }> {
  const cleaned: string[] = [];
  const errors: string[] = [];

  if (!existsSync(PUBLIC_ASSETS_DIR)) {
    return { cleaned, errors };
  }

  try {
    const entries = await readdir(PUBLIC_ASSETS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !activeArticleSlugs.includes(entry.name)) {
        const dirPath = join(PUBLIC_ASSETS_DIR, entry.name);
        try {
          // TODO: Implement recursive directory removal
          // For now, just log what would be cleaned
          console.log(`Would clean unused asset directory: ${dirPath}`);
          cleaned.push(entry.name);
        } catch (error) {
          errors.push(`Failed to clean ${dirPath}: ${error}`);
        }
      }
    }
  } catch (error) {
    errors.push(`Failed to read assets directory: ${error}`);
  }

  return { cleaned, errors };
}
