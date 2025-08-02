import { Document, Index } from "flexsearch";

export interface SearchableArticle {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  // biome-ignore lint/suspicious/noExplicitAny: <>
  [key: string]: any; // Index signature for FlexSearch compatibility
}

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  highlights: {
    title?: string;
    description?: string;
    content?: string;
  };
}

export interface SearchIndex {
  articles: SearchableArticle[];
  generatedAt: string;
}

/**
 * Creates a FlexSearch index for client-side searching
 */
export function createSearchIndex() {
  return new Index({
    tokenize: "forward",
    cache: true,
    resolution: 9,
  });
}

/**
 * Creates a document-based FlexSearch index for more complex searching
 */
export function createDocumentIndex() {
  return new Document({
    tokenize: "forward",
    cache: true,
    resolution: 9,
    document: {
      id: "slug",
      index: ["title", "description", "content", "tags"],
      store: ["title", "description", "tags"],
    },
  });
}

/**
 * Strips MDX/HTML content to plain text for indexing
 */
export function stripMarkdown(content: string): string {
  return (
    content
      // Remove MDX imports and exports
      .replace(/^import\s+.*$/gm, "")
      .replace(/^export\s+.*$/gm, "")
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove markdown syntax
      .replace(/#{1,6}\s+/g, "") // Headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
      .replace(/\*(.*?)\*/g, "$1") // Italic
      .replace(/`(.*?)`/g, "$1") // Inline code
      .replace(/```[\s\S]*?```/g, "") // Code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // Images
      // Clean up whitespace
      .replace(/\n\s*\n/g, "\n")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Highlights search terms in text
 */
export function highlightSearchTerms(
  text: string,
  searchTerms: string[],
): string {
  if (!searchTerms.length) return text;

  let highlightedText = text;

  for (const term of searchTerms) {
    if (term.length < 2) continue; // Skip very short terms

    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    highlightedText = highlightedText.replace(regex, "<mark>$1</mark>");
  }

  return highlightedText;
}

/**
 * Deduplicates search results by slug to ensure unique articles
 */
export function deduplicateSearchResults(
  results: SearchResult[],
): SearchResult[] {
  const seen = new Set<string>();
  const deduplicated: SearchResult[] = [];

  for (const result of results) {
    if (!seen.has(result.slug)) {
      seen.add(result.slug);
      deduplicated.push(result);
    }
  }

  return deduplicated;
}

/**
 * Validates and deduplicates searchable articles
 */
export function deduplicateSearchableArticles(
  articles: SearchableArticle[],
): SearchableArticle[] {
  const seen = new Set<string>();
  const deduplicated: SearchableArticle[] = [];

  for (const article of articles) {
    if (!seen.has(article.slug)) {
      seen.add(article.slug);
      deduplicated.push(article);
    } else {
      console.warn(`Duplicate article found in search index: ${article.slug}`);
    }
  }

  return deduplicated;
}

/**
 * Extracts relevant snippets from content around search terms
 */
export function extractSnippets(
  content: string,
  searchTerms: string[],
  maxLength = 200,
): string {
  if (!searchTerms.length) {
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  }

  const lowerContent = content.toLowerCase();
  const positions: number[] = [];

  // Find positions of search terms
  for (const term of searchTerms) {
    if (term.length < 2) continue;

    const lowerTerm = term.toLowerCase();
    let index = lowerContent.indexOf(lowerTerm);

    while (index !== -1) {
      positions.push(index);
      index = lowerContent.indexOf(lowerTerm, index + 1);
    }
  }

  if (positions.length === 0) {
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  }

  // Sort positions and find the best snippet
  positions.sort((a, b) => a - b);
  const firstPosition = positions[0];

  // Try to center the snippet around the first match
  const start = Math.max(0, firstPosition - Math.floor(maxLength / 2));
  const end = Math.min(content.length, start + maxLength);

  let snippet = content.substring(start, end);

  // Add ellipsis if needed
  if (start > 0) snippet = `...${snippet}`;
  if (end < content.length) snippet = `${snippet}...`;

  return snippet;
}

/**
 * Performs client-side search using FlexSearch
 */
export function performSearch(
  // biome-ignore lint/suspicious/noExplicitAny: <>
  index: any, // FlexSearch Document instance
  articles: SearchableArticle[],
  query: string,
  limit = 10,
): SearchResult[] {
  if (!query.trim()) return [];

  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length >= 2);
  if (searchTerms.length === 0) return [];

  try {
    // Perform the search with a higher limit to account for duplicates
    const results = index.search(query, { limit: limit * 3, enrich: true });

    if (!Array.isArray(results) || results.length === 0) {
      return [];
    }

    // Use a Map to deduplicate results by slug
    const uniqueResults = new Map<string, SearchResult>();

    // Process results from the document index
    for (const result of results) {
      if (
        typeof result === "object" &&
        "result" in result &&
        Array.isArray(result.result)
      ) {
        for (const item of result.result) {
          if (typeof item === "object" && "id" in item && "doc" in item) {
            const article = articles.find((a) => a.slug === item.id);
            if (!article) continue;

            // Skip if we already have this article (deduplication)
            if (uniqueResults.has(article.slug)) continue;

            const searchResult: SearchResult = {
              slug: article.slug,
              title: article.title,
              description: article.description,
              tags: article.tags,
              highlights: {
                title: highlightSearchTerms(article.title, searchTerms),
                description: highlightSearchTerms(
                  extractSnippets(article.description, searchTerms, 150),
                  searchTerms,
                ),
                content: highlightSearchTerms(
                  extractSnippets(article.content, searchTerms, 200),
                  searchTerms,
                ),
              },
            };

            uniqueResults.set(article.slug, searchResult);

            // Stop when we have enough unique results
            if (uniqueResults.size >= limit) break;
          }
        }
      }

      // Stop outer loop when we have enough unique results
      if (uniqueResults.size >= limit) break;
    }

    // Convert Map values to array and return
    return Array.from(uniqueResults.values());
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
