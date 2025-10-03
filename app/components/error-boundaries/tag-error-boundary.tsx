import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type TagErrorBoundaryProps = {
  tagId?: string;
  error?: Error;
  reset?: () => void;
};

export function TagErrorBoundary({
  tagId,
  error,
  reset,
}: TagErrorBoundaryProps) {
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <CardTitle className="font-bold text-2xl">Tag Not Found</CardTitle>
            <CardDescription className="mt-2 text-base">
              {tagId
                ? `The tag "${tagId}" doesn't exist or has no associated articles.`
                : "The requested tag could not be found."}
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
