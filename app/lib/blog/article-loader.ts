import {
  fetchStaticJSON,
  type ReactRouterContext,
} from "~/lib/utils/static-assets";
import type { ArticleMetadata } from "./mdx-processor";
import { validateArticleMetadata } from "./mdx-processor";

type ArticleCache = {
  articles: ArticleMetadata[];
  generatedAt: string;
};

/**
 * Loads article metadata from the generated cache file
 */
export async function loadArticleMetadata(
  context?: ReactRouterContext,
  request?: Request
): Promise<ArticleMetadata[]> {
  try {
    const cache = await fetchStaticJSON<ArticleCache>(
      "/blog-metadata.json",
      context,
      request
    );

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
        `cache article ${index} (${article.slug})`
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
  context?: ReactRouterContext,
  request?: Request
): Promise<ArticleMetadata | null> {
  const articles = await loadArticleMetadata(context, request);
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
  context?: ReactRouterContext,
  request?: Request
): Promise<ArticleMetadata[]> {
  const articles = await loadArticleMetadata(context, request);
  return articles.filter((article) => article.tags.includes(tag));
}

/**
 * Gets all unique tags from articles
 */
export async function getAllTags(
  context?: ReactRouterContext,
  request?: Request
): Promise<string[]> {
  const articles = await loadArticleMetadata(context, request);
  const tagSet = new Set<string>();

  // biome-ignore lint/complexity/noForEach: ignore
  articles.forEach((article) => {
    // biome-ignore lint/complexity/noForEach: ignore
    // biome-ignore lint/suspicious/useIterableCallbackReturn: ignore
    article.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}
