import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { ArticleMetadata } from "./mdx-processor";
import { validateArticleMetadata } from "./mdx-processor";

// Get the current file's directory and resolve project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "../../..");
const METADATA_FILE_PATH = join(PROJECT_ROOT, "public/blog-metadata.json");

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

    // console.log('loadArticleMetadata - METADATA_FILE_PATH:', METADATA_FILE_PATH);
    // console.log('loadArticleMetadata - file exists:', existsSync(METADATA_FILE_PATH));

    // In test/build environment, read from file system
    if (
      typeof window === "undefined" &&
      existsSync(METADATA_FILE_PATH)
    ) {
      // console.log('loadArticleMetadata - Reading from file system');
      const content = await readFile(METADATA_FILE_PATH, "utf-8");
      cache = JSON.parse(content);
      // console.log('loadArticleMetadata - Loaded cache from file:', cache);
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
  // console.log('loadArticleBySlug - Looking for slug:', slug);
  // console.log('loadArticleBySlug - Available articles:', articles.map(a => a.slug));
  const found = articles.find((article) => article.slug === slug) || null;
  // console.log('loadArticleBySlug - Found article:', found);
  return found;
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
