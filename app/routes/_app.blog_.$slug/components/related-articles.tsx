import { Link } from "react-router";
import type { ArticleMetadata } from "~/lib/blog/mdx-processor";
import { formatDate } from "~/lib/utils";

type RelatedArticlesProps = {
  articles: ArticleMetadata[];
};

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  // Don't render anything if no related articles
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-border border-t pt-8">
      <h2 className="mb-6 font-bold text-2xl">Related Articles</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent/50"
            key={article.slug}
            to={`/blog/${article.slug}`}
          >
            <div className="space-y-3">
              {/* Article emoji and title */}
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className="flex-shrink-0 text-2xl">
                  {article.emoji}
                </span>
                <h3 className="line-clamp-2 font-semibold text-lg leading-tight transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
              </div>

              {/* Article description */}
              <p className="line-clamp-3 text-muted-foreground text-sm">
                {article.description}
              </p>

              {/* Article metadata */}
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <time dateTime={article.publishedAt.toISOString()}>
                  {formatDate(article.publishedAt)}
                </time>
                <span>{article.readingTime} min read</span>
              </div>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      className="inline-flex items-center rounded-md bg-secondary px-2 py-1 font-medium text-secondary-foreground text-xs"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 font-medium text-secondary-foreground text-xs">
                      +{article.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
