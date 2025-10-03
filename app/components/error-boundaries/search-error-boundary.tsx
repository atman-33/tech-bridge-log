import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type SearchErrorBoundaryProps = {
  error?: Error;
  reset?: () => void;
  query?: string;
};

export function SearchErrorBoundary({
  error,
  reset,
  query,
}: SearchErrorBoundaryProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <Card className="text-center">
      <CardHeader className="pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg
            className="h-8 w-8 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <CardTitle className="font-bold text-xl">Search Error</CardTitle>
        <CardDescription className="mt-2 text-base">
          {query
            ? `Unable to search for "${query}". Please try again.`
            : "There was an error with the search functionality."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isDevelopment && error && (
          <details className="rounded-md bg-muted p-4 text-left">
            <summary className="mb-2 cursor-pointer font-medium text-sm">
              Error Details (Development Only)
            </summary>
            <pre className="whitespace-pre-wrap text-muted-foreground text-xs">
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
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
          <svg
            className="h-8 w-8 text-warning"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <CardTitle className="font-bold text-xl">
          Search Temporarily Unavailable
        </CardTitle>
        <CardDescription className="mt-2 text-base">
          The search functionality is currently unavailable. You can still
          browse articles by visiting the blog homepage or browsing by tags.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
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
