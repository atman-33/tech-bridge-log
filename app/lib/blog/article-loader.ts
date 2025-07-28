import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import type { ArticleMetadata } from "./mdx-processor";
import { validateArticleMetadata } from "./mdx-processor";

interface ArticleCache {
  articles: ArticleMetadata[];
  generatedAt: string;
}

/**
 * Loads article metadata from the generated cache file
 */
export async function loadArticleMetadata(request?: Request): Promise<ArticleMetadata[]> {
  try {
    let cache: ArticleCache;

    // In test/build environment, read from file system
    if (
      typeof window === "undefined" &&
      existsSync("public/blog-metadata.json")
    ) {
      const content = await readFile("public/blog-metadata.json", "utf-8");
      cache = JSON.parse(content);
    } else {
      // In browser environment, fetch from server
      let url = "/blog-metadata.json";

      // If we have a request object (SSR), construct absolute URL
      if (request) {
        const requestUrl = new URL(request.url);
        url = `${requestUrl.origin}/blog-metadata.json`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        console.warn(
          "Failed to load blog metadata cache, returning empty array",
        );
        return [];
      }

      cache = await response.json();
    }

    // Convert date strings back to Date objects and validate metadata
    return cache.articles.map((article, index) => {
      const articleWithDates = {
        ...article,
        publishedAt: new Date(article.publishedAt),
        updatedAt: new Date(article.updatedAt),
      };

      // Validate the article metadata structure
      return validateArticleMetadata(
        articleWithDates,
        `cache article ${index} (${article.slug})`,
      );
    });
  } catch (error) {
    console.error("Error loading article metadata:", error);
    return [];
  }
}

/**
 * Loads metadata for a specific article by slug
 */
export async function loadArticleBySlug(
  slug: string,
  request?: Request,
): Promise<ArticleMetadata | null> {
  const articles = await loadArticleMetadata(request);
  return articles.find((article) => article.slug === slug) || null;
}

/**
 * Loads articles filtered by tag
 */
export async function loadArticlesByTag(
  tag: string,
  request?: Request,
): Promise<ArticleMetadata[]> {
  const articles = await loadArticleMetadata(request);
  return articles.filter((article) => article.tags.includes(tag));
}

/**
 * Gets all unique tags from articles
 */
export async function getAllTags(request?: Request): Promise<string[]> {
  const articles = await loadArticleMetadata(request);
  const tagSet = new Set<string>();

  articles.forEach((article) => {
    article.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}
