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
export async function loadArticleMetadata(): Promise<ArticleMetadata[]> {
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
      const response = await fetch("/blog-metadata.json");

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
      return validateArticleMetadata(articleWithDates, `cache article ${index} (${article.slug})`);
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
): Promise<ArticleMetadata | null> {
  const articles = await loadArticleMetadata();
  return articles.find((article) => article.slug === slug) || null;
}

/**
 * Loads articles filtered by tag
 */
export async function loadArticlesByTag(
  tag: string,
): Promise<ArticleMetadata[]> {
  const articles = await loadArticleMetadata();
  return articles.filter((article) => article.tags.includes(tag));
}

/**
 * Gets all unique tags from articles
 */
export async function getAllTags(): Promise<string[]> {
  const articles = await loadArticleMetadata();
  const tagSet = new Set<string>();

  articles.forEach((article) => {
    article.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}
