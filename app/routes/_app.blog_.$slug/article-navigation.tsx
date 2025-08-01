import type { ArticleMetadata } from '~/lib/blog/mdx-processor';

interface ArticleNavigationProps {
  previousArticle: ArticleMetadata | null;
  nextArticle: ArticleMetadata | null;
}

export function ArticleNavigation({ previousArticle, nextArticle }: ArticleNavigationProps) {
  if (!previousArticle && !nextArticle) {
    return null;
  }

  return (
    <nav className="mt-12 pt-8 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {previousArticle && (
          <a
            href={`/blog/${previousArticle.slug}`}
            className="group p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="text-sm text-muted-foreground mb-1">Previous Article</div>
            <div className="font-semibold group-hover:text-primary transition-colors">
              {previousArticle.title}
            </div>
          </a>
        )}

        {nextArticle && (
          <a
            href={`/blog/${nextArticle.slug}`}
            className="group p-4 rounded-lg border border-border hover:border-primary transition-colors md:text-right"
          >
            <div className="text-sm text-muted-foreground mb-1">Next Article</div>
            <div className="font-semibold group-hover:text-primary transition-colors">
              {nextArticle.title}
            </div>
          </a>
        )}
      </div>
    </nav>
  );
}