import type { ArticleMetadata } from "~/lib/blog/mdx-processor";

type ArticleNavigationProps = {
  previousArticle: ArticleMetadata | null;
  nextArticle: ArticleMetadata | null;
};

export function ArticleNavigation({
  previousArticle,
  nextArticle,
}: ArticleNavigationProps) {
  if (!(previousArticle || nextArticle)) {
    return null;
  }

  return (
    <nav className="mt-12 border-border border-t pt-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {previousArticle && (
          <a
            className="group rounded-lg border border-border p-4 transition-colors hover:border-primary"
            href={`/blog/${previousArticle.slug}`}
          >
            <div className="mb-1 text-muted-foreground text-sm">
              Previous Article
            </div>
            <div className="font-semibold transition-colors group-hover:text-primary">
              {previousArticle.title}
            </div>
          </a>
        )}

        {nextArticle && (
          <a
            className="group rounded-lg border border-border p-4 transition-colors hover:border-primary md:text-right"
            href={`/blog/${nextArticle.slug}`}
          >
            <div className="mb-1 text-muted-foreground text-sm">
              Next Article
            </div>
            <div className="font-semibold transition-colors group-hover:text-primary">
              {nextArticle.title}
            </div>
          </a>
        )}
      </div>
    </nav>
  );
}
