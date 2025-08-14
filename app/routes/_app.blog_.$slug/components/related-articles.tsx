import { Link } from 'react-router';
import type { ArticleMetadata } from '~/lib/blog/mdx-processor';
import { formatDate } from '~/lib/utils';

interface RelatedArticlesProps {
  articles: ArticleMetadata[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  // Don't render anything if no related articles
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to={`/blog/${article.slug}`}
            className="group block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors bg-card hover:bg-accent/50"
          >
            <div className="space-y-3">
              {/* Article emoji and title */}
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">
                  {article.emoji}
                </span>
                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </div>

              {/* Article description */}
              <p className="text-muted-foreground text-sm line-clamp-3">
                {article.description}
              </p>

              {/* Article metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
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
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
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