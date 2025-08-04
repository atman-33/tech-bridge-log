import { describe, expect, it } from "vitest";
import {
  formatFileSize,
  generateAssetUrl,
  isSupportedImageFormat,
  resolveImagePath,
  resolveThumbnailPath,
  validateThumbnailPath,
} from "./image-processor";

describe("Image Processor", () => {
  describe("isSupportedImageFormat", () => {
    it("should identify supported image formats", () => {
      expect(isSupportedImageFormat("image.png")).toBe(true);
      expect(isSupportedImageFormat("image.jpg")).toBe(true);
      expect(isSupportedImageFormat("image.jpeg")).toBe(true);
      expect(isSupportedImageFormat("image.gif")).toBe(true);
      expect(isSupportedImageFormat("image.svg")).toBe(true);
      expect(isSupportedImageFormat("image.webp")).toBe(true);
      expect(isSupportedImageFormat("image.avif")).toBe(true);
    });

    it("should reject unsupported formats", () => {
      expect(isSupportedImageFormat("document.txt")).toBe(false);
      expect(isSupportedImageFormat("script.js")).toBe(false);
      expect(isSupportedImageFormat("style.css")).toBe(false);
      expect(isSupportedImageFormat("data.json")).toBe(false);
    });

    it("should handle case insensitive extensions", () => {
      expect(isSupportedImageFormat("image.PNG")).toBe(true);
      expect(isSupportedImageFormat("image.JPG")).toBe(true);
      expect(isSupportedImageFormat("image.JPEG")).toBe(true);
    });
  });

  describe("generateAssetUrl", () => {
    it("should generate correct asset URLs", () => {
      expect(generateAssetUrl("test-article", "image.png")).toBe(
        "/blog-assets/test-article/image.png",
      );
      expect(generateAssetUrl("another-post", "thumbnail.jpg")).toBe(
        "/blog-assets/another-post/thumbnail.jpg",
      );
    });

    it("should handle special characters in filenames", () => {
      expect(generateAssetUrl("test-article", "image-with-dashes.png")).toBe(
        "/blog-assets/test-article/image-with-dashes.png",
      );
      expect(
        generateAssetUrl("test-article", "image_with_underscores.jpg"),
      ).toBe("/blog-assets/test-article/image_with_underscores.jpg");
    });
  });

  describe("resolveImagePath", () => {
    it("should resolve relative paths starting with ./", () => {
      expect(resolveImagePath("./image.png", "test-article")).toBe(
        "/blog-assets/test-article/image.png",
      );
      expect(resolveImagePath("./subfolder/image.jpg", "test-article")).toBe(
        "/blog-assets/test-article/subfolder/image.jpg",
      );
    });

    it("should resolve relative paths without ./", () => {
      expect(resolveImagePath("image.png", "test-article")).toBe(
        "/blog-assets/test-article/image.png",
      );
      expect(resolveImagePath("thumbnail.jpg", "test-article")).toBe(
        "/blog-assets/test-article/thumbnail.jpg",
      );
    });

    it("should leave absolute paths unchanged", () => {
      expect(resolveImagePath("/absolute/path/image.png", "test-article")).toBe(
        "/absolute/path/image.png",
      );
      expect(
        resolveImagePath("https://example.com/image.jpg", "test-article"),
      ).toBe("https://example.com/image.jpg");
      expect(
        resolveImagePath("http://example.com/image.png", "test-article"),
      ).toBe("http://example.com/image.png");
    });
  });

  describe("resolveThumbnailPath", () => {
    it("should resolve thumbnail paths correctly", () => {
      expect(resolveThumbnailPath("./thumbnail.png", "test-article")).toBe(
        "/blog-assets/test-article/thumbnail.png",
      );
      expect(resolveThumbnailPath("thumbnail.jpg", "test-article")).toBe(
        "/blog-assets/test-article/thumbnail.jpg",
      );
      expect(
        resolveThumbnailPath("/absolute/thumbnail.png", "test-article"),
      ).toBe("/absolute/thumbnail.png");
    });
  });

  describe("formatFileSize", () => {
    it("should format file sizes correctly", () => {
      expect(formatFileSize(0)).toBe("0.0 B");
      expect(formatFileSize(512)).toBe("512.0 B");
      expect(formatFileSize(1024)).toBe("1.0 KB");
      expect(formatFileSize(1536)).toBe("1.5 KB");
      expect(formatFileSize(1048576)).toBe("1.0 MB");
      expect(formatFileSize(1073741824)).toBe("1.0 GB");
    });
  });

  describe("validateThumbnailPath", () => {
    it("should validate existing thumbnail paths", () => {
      const assets = [
        {
          originalPath: "/test/thumbnail.png",
          publicPath: "/blog-assets/test-article/thumbnail.png",
          filename: "thumbnail.png",
          extension: ".png",
          size: 1024,
          isOptimized: false,
        },
      ];

      const result = validateThumbnailPath(
        "./thumbnail.png",
        assets,
        "test-article",
      );

      expect(result.isValid).toBe(true);
      expect(result.resolvedPath).toBe(
        "/blog-assets/test-article/thumbnail.png",
      );
      expect(result.error).toBeUndefined();
    });

    it("should invalidate non-existent thumbnail paths", () => {
      const assets = [
        {
          originalPath: "/test/other.png",
          publicPath: "/blog-assets/test-article/other.png",
          filename: "other.png",
          extension: ".png",
          size: 1024,
          isOptimized: false,
        },
      ];

      const result = validateThumbnailPath(
        "./thumbnail.png",
        assets,
        "test-article",
      );

      expect(result.isValid).toBe(false);
      expect(result.resolvedPath).toBe(
        "/blog-assets/test-article/thumbnail.png",
      );
      expect(result.error).toContain("Thumbnail image not found");
      expect(result.error).toContain("Available images: other.png");
    });
  });
});
