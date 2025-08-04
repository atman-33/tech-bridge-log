import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface TagErrorBoundaryProps {
  tagId?: string;
  error?: Error;
  reset?: () => void;
}

export function TagErrorBoundary({ tagId, error, reset }: TagErrorBoundaryProps) {
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold">Tag Not Found</CardTitle>
            <CardDescription className="text-base mt-2">
              {tagId
                ? `The tag "${tagId}" doesn't exist or has no associated articles.`
                : 'The requested tag could not be found.'
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

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {reset && (
                <Button onClick={reset} variant="outline">
                  Try Again
                </Button>
              )}
              <Button asChild variant="outline">
                <Link to="/tags">Browse All Tags</Link>
              </Button>
              <Button asChild>
                <Link to="/">← Back to Blog</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}