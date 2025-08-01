import { Link } from 'react-router';
import type { ArticleMetadata } from '~/lib/blog/mdx-processor';

interface ArticleCardProps {
  article: ArticleMetadata;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <article className="group">
      <Link
        to={`/blog/${article.slug}`}
        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200 group-hover:border-primary/20"
      >
        {/* Emoji */}
        <div className="flex h-16 w-16 min-w-16 items-center justify-center rounded-full bg-muted">
          <span
            className="text-3xl transition-transform duration-200 group-hover:scale-110"
            role="img"
            aria-label={`Emoji for ${article.title}`}
          >
            {article.emoji}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center space-y-1 min-w-0">
          <h2 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>📅 {formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}