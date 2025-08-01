import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface ArticleErrorBoundaryProps {
  error?: Error;
  reset?: () => void;
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export function ArticleErrorBoundary({
  error,
  reset,
  title = 'Article Not Found',
  description = 'The article you\'re looking for doesn\'t exist or has been moved.',
  showBackButton = true,
}: ArticleErrorBoundaryProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="text-base mt-2">
              {description}
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

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
      title="Article Not Found"
      description="The article you're looking for doesn't exist or has been moved."
    />
  );
}

// Specific error boundary for article loading failures
export function ArticleLoadingErrorBoundary({ error, reset }: { error?: Error; reset?: () => void; }) {
  return (
    <ArticleErrorBoundary
      error={error}
      reset={reset}
      title="Failed to Load Article"
      description="There was an error loading this article. Please try again."
    />
  );
}