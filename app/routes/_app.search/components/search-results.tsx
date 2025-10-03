import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  SearchErrorBoundary,
  SearchIndexUnavailable,
} from "~/components/error-boundaries/search-error-boundary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  createDocumentIndex,
  deduplicateSearchableArticles,
  deduplicateSearchResults,
  performSearch,
  type SearchIndex,
  type SearchResult,
} from "~/lib/blog/search-index";

type SearchResultsProps = {
  query: string;
  searchIndex: SearchIndex | null;
  searchIndexError?: string | null;
};

export function SearchResults({
  query,
  searchIndex,
  searchIndexError,
}: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (!(query.trim() && searchIndex)) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    try {
      // Deduplicate articles before indexing to prevent duplicate entries
      const deduplicatedArticles = deduplicateSearchableArticles(
        searchIndex.articles
      );

      // Create FlexSearch index
      const index = createDocumentIndex();

      // Add deduplicated articles to the index
      for (const article of deduplicatedArticles) {
        index.add({
          slug: article.slug,
          title: article.title,
          description: article.description,
          content: article.content,
          tags: article.tags.join(" "),
        });
      }

      // Perform search with deduplicated articles
      const searchResults = performSearch(
        index,
        deduplicatedArticles,
        query,
        20
      );

      // Apply final deduplication as a safety measure
      const uniqueResults = deduplicateSearchResults(searchResults);

      setResults(uniqueResults);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("An error occurred while searching. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, searchIndex]);

  // Handle search index errors
  if (searchIndexError) {
    return <SearchErrorBoundary error={new Error(searchIndexError)} />;
  }

  if (!searchIndex) {
    return <SearchIndexUnavailable />;
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Searching...</p>
      </div>
    );
  }

  if (searchError) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">{searchError}</p>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Enter a search term to find articles.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          No articles found for "{query}". Try different keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Found {results.length} {results.length === 1 ? "article" : "articles"}
        </p>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <SearchResultCard key={result.slug} result={result} />
        ))}
      </div>
    </div>
  );
}

type SearchResultCardProps = {
  result: SearchResult;
};

function SearchResultCard({ result }: SearchResultCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">
              <Link className="hover:underline" to={`/blog/${result.slug}`}>
                <span
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: ignore
                  dangerouslySetInnerHTML={{
                    __html: result.highlights.title || result.title,
                  }}
                />
              </Link>
            </CardTitle>
            <CardDescription className="mt-2">
              <span
                // biome-ignore lint/security/noDangerouslySetInnerHtml: ignore
                dangerouslySetInnerHTML={{
                  __html: result.highlights.description || result.description,
                }}
              />
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {result.highlights.content && (
          <div className="mb-4">
            <p
              className="text-muted-foreground text-sm leading-relaxed"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: ignore
              dangerouslySetInnerHTML={{
                __html: result.highlights.content,
              }}
            />
          </div>
        )}

        {result.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag) => (
              <span
                className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-700 text-xs dark:bg-slate-800 dark:text-slate-300"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
