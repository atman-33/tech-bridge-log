import { Link } from 'react-router';
import type { ArticleMetadata } from '~/lib/blog/mdx-processor';
import type { Tag } from '~/lib/blog/tags';
import { TagBadge } from '~/components/blog/tag-badge';

interface ArticleCardProps {
  article: ArticleMetadata;
  index?: number;
  tags?: Tag[];
}

export function ArticleCard({ article, index = 0, tags = [] }: ArticleCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <article
      className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link
        to={`/blog/${article.slug}`}
        className="block p-2 md:p-4 rounded-2xl  backdrop-blur-sm  border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/80 dark:hover:border-slate-600/80 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1"
      >
        <div className="flex items-start gap-5">
          {/* Emoji */}
          <div className="flex h-14 w-14 min-w-14 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 border border-slate-200/50 dark:border-slate-600/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <span
              className="text-2xl filter drop-shadow-sm"
              role="img"
              aria-label={`Emoji for ${article.title}`}
            >
              {article.emoji}
            </span>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-start space-y-3 min-w-0 flex-1">
            <h2 className="font-semibold text-lg leading-tight line-clamp-2 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
              {article.title}
            </h2>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-slate-400 dark:text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <time dateTime={article.publishedAt.toISOString()}>
                  {formatDate(article.publishedAt)}
                </time>
              </div>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>{article.readingTime} min read</span>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags
                  .filter(tag => article.tags.includes(tag.id))
                  .slice(0, 3) // Limit to 3 tags to avoid overcrowding
                  .map(tag => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      variant="outline"
                      size="sm"
                      showIcon={true}
                    />
                  ))}
                {article.tags.length > 3 && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 px-2 py-1">
                    +{article.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 hidden md:block">
            <svg
              className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}