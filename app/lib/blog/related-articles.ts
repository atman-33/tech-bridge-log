import type { ArticleMetadata } from "./mdx-processor";

/**
 * Finds related articles based on shared tags
 * @param currentArticle The current article to find related articles for
 * @param allArticles All available articles
 * @param maxResults Maximum number of related articles to return (default: 3)
 * @returns Array of related articles, randomly selected from those with matching tags
 */
export function findRelatedArticles(
  currentArticle: ArticleMetadata,
  allArticles: ArticleMetadata[],
  maxResults = 3
): ArticleMetadata[] {
  // Filter out the current article and unpublished articles
  const candidateArticles = allArticles.filter(
    (article) =>
      article.slug !== currentArticle.slug && article.publishedAt <= new Date()
  );

  // Find articles that share at least one tag with the current article
  const relatedArticles = candidateArticles.filter((article) =>
    article.tags.some((tag) => currentArticle.tags.includes(tag))
  );

  // If no related articles found, return empty array
  if (relatedArticles.length === 0) {
    return [];
  }

  // Sort by number of shared tags (descending) and then by publication date (descending)
  const sortedRelated = relatedArticles
    .map((article) => ({
      article,
      sharedTagCount: article.tags.filter((tag) =>
        currentArticle.tags.includes(tag)
      ).length,
    }))
    .sort((a, b) => {
      // First sort by number of shared tags (more shared tags = higher priority)
      if (a.sharedTagCount !== b.sharedTagCount) {
        return b.sharedTagCount - a.sharedTagCount;
      }
      // Then sort by publication date (newer = higher priority)
      return b.article.publishedAt.getTime() - a.article.publishedAt.getTime();
    })
    .map((item) => item.article);

  // Randomly shuffle articles with the same number of shared tags to add variety
  const result: ArticleMetadata[] = [];
  const tagGroups = new Map<number, ArticleMetadata[]>();

  // Group articles by shared tag count
  // biome-ignore lint/complexity/noForEach: ignore
  sortedRelated.forEach((article) => {
    const sharedTagCount = article.tags.filter((tag) =>
      currentArticle.tags.includes(tag)
    ).length;
    const group = tagGroups.get(sharedTagCount) || [];
    group.push(article);
    tagGroups.set(sharedTagCount, group);
  });

  // Randomly select from each group, starting with highest shared tag count
  const sortedTagCounts = Array.from(tagGroups.keys()).sort((a, b) => b - a);

  for (const tagCount of sortedTagCounts) {
    const group = tagGroups.get(tagCount);
    if (!group) {
      continue;
    }
    const shuffled = shuffleArray([...group]);

    for (const article of shuffled) {
      if (result.length < maxResults) {
        result.push(article);
      } else {
        break;
      }
    }

    if (result.length >= maxResults) {
      break;
    }
  }

  return result;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
