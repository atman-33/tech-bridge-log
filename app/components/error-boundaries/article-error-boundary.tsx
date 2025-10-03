import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type ArticleErrorBoundaryProps = {
  error?: Error;
  reset?: () => void;
  title?: string;
  description?: string;
  showBackButton?: boolean;
};

export function ArticleErrorBoundary({
  error,
  reset,
  title = "Article Not Found",
  description = "The article you're looking for doesn't exist or has been moved.",
  showBackButton = true,
}: ArticleErrorBoundaryProps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <CardTitle className="font-bold text-2xl">{title}</CardTitle>
            <CardDescription className="mt-2 text-base">
              {description}
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

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              {reset && (
                <Button onClick={reset} variant="outline">
                  Try Again
                </Button>
              )}
              {showBackButton && (
                <Button asChild>
                  <Link to="/">← Back to Blog</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Specific error boundary for 404 articles
export function ArticleNotFoundBoundary() {
  return (
    <ArticleErrorBoundary
      description="The article you're looking for doesn't exist or has been moved."
      title="Article Not Found"
    />
  );
}

// Specific error boundary for article loading failures
export function ArticleLoadingErrorBoundary({
  error,
  reset,
}: {
  error?: Error;
  reset?: () => void;
}) {
  return (
    <ArticleErrorBoundary
      description="There was an error loading this article. Please try again."
      error={error}
      reset={reset}
      title="Failed to Load Article"
    />
  );
}
