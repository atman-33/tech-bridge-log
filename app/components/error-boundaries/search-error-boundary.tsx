import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface SearchErrorBoundaryProps {
  error?: Error;
  reset?: () => void;
  query?: string;
}

export function SearchErrorBoundary({ error, reset, query }: SearchErrorBoundaryProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <Card className="text-center">
      <CardHeader className="pb-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <CardTitle className="text-xl font-bold">Search Error</CardTitle>
        <CardDescription className="text-base mt-2">
          {query
            ? `Unable to search for "${query}". Please try again.`
            : 'There was an error with the search functionality.'
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isDevelopment && error && (
          <details className="text-left bg-muted p-4 rounded-md">
            <summary className="cursor-pointer font-medium text-sm mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        {reset && (
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Fallback for when search index is unavailable
export function SearchIndexUnavailable() {
  return (
    <Card className="text-center">
      <CardHeader className="pb-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warning/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-warning"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <CardTitle className="text-xl font-bold">Search Temporarily Unavailable</CardTitle>
        <CardDescription className="text-base mt-2">
          The search functionality is currently unavailable. You can still browse articles by visiting the blog homepage or browsing by tags.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <a href="/">Browse Articles</a>
          </Button>
          <Button asChild>
            <a href="/tags">Browse by Tags</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}