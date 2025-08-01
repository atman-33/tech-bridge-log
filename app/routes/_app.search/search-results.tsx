import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { TagBadge } from '~/components/blog/tag-badge';
import {
  createDocumentIndex,
  performSearch,
  type SearchResult,
  type SearchIndex
} from '~/lib/blog/search-index';

interface SearchResultsProps {
  query: string;
  searchIndex: SearchIndex | null;
}

export function SearchResults({ query, searchIndex }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim() || !searchIndex) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    try {
      // Create FlexSearch index
      const index = createDocumentIndex();

      // Add articles to the index
      for (const article of searchIndex.articles) {
        index.add({
          slug: article.slug,
          title: article.title,
          description: article.description,
          content: article.content,
          tags: article.tags.join(' '),
        });
      }

      // Perform search
      const searchResults = performSearch(index, searchIndex.articles, query, 20);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred while searching. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, searchIndex]);

  if (!searchIndex) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Search index is not available.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Searching...</p>
      </div>
    );
  }

  if (searchError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{searchError}</p>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Enter a search term to find articles.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No articles found for "{query}". Try different keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found {results.length} {results.length === 1 ? 'article' : 'articles'}
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

interface SearchResultCardProps {
  result: SearchResult;
}

function SearchResultCard({ result }: SearchResultCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">
              <Link
                to={`/blog/${result.slug}`}
                className="hover:underline"
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: result.highlights.title || result.title
                  }}
                />
              </Link>
            </CardTitle>
            <CardDescription className="mt-2">
              <span
                dangerouslySetInnerHTML={{
                  __html: result.highlights.description || result.description
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
              className="text-sm text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: result.highlights.content
              }}
            />
          </div>
        )}

        {result.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
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