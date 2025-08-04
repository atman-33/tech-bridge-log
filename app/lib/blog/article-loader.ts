import type { ArticleMetadata } from "./mdx-processor";
import { validateArticleMetadata } from "./mdx-processor";

interface ArticleCache {
  articles: ArticleMetadata[];
  generatedAt: string;
}

/**
 * Loads article metadata from the generated cache file
 */
export async function loadArticleMetadata(
  request?: Request,
): Promise<ArticleMetadata[]> {
  try {
    // Always fetch from the static file endpoint
    let url = "/blog-metadata.json";

    // If we have a request object (SSR), construct absolute URL
    if (request) {
      const requestUrl = new URL(request.url);
      url = `${requestUrl.origin}/blog-metadata.json`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.warn("Failed to load blog metadata cache, returning empty array");
      return [];
    }

    const cache: ArticleCache = await response.json();

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
