import { Link } from "react-router";
import { TagBadge } from "~/components/blog/tag-badge";
import type { ArticleMetadata } from "~/lib/blog/mdx-processor";
import type { Tag } from "~/lib/blog/tags";

type ArticleCardProps = {
  article: ArticleMetadata;
  index?: number;
  tags?: Tag[];
};

export function ArticleCard({
  article,
  index = 0,
  tags = [],
}: ArticleCardProps) {
  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);

  return (
    <article
      className="group fade-in slide-in-from-bottom-4 animate-in duration-700"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link
        className="hover:-translate-y-1 block rounded-2xl border-slate-200/60 p-2 backdrop-blur-sm transition-all duration-300 hover:border-slate-300/80 hover:bg-white/90 hover:shadow-slate-200/50 hover:shadow-xl md:p-4 dark:border-slate-700/60 dark:hover:border-slate-600/80 dark:hover:bg-slate-800/90 dark:hover:shadow-slate-900/50"
        to={`/blog/${article.slug}`}
      >
        <div className="flex items-start gap-5">
          {/* Emoji */}
          <div className="flex h-14 w-14 min-w-14 items-center justify-center rounded-full border border-slate-200/50 bg-gradient-to-br from-slate-100 to-slate-50 transition-all duration-300 group-hover:rotate-3 group-hover:scale-110 dark:border-slate-600/50 dark:from-slate-700 dark:to-slate-800">
            <span
              aria-label={`Emoji for ${article.title}`}
              className="text-2xl drop-shadow-sm filter"
              role="img"
            >
              {article.emoji}
            </span>
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col justify-start space-y-3">
            <h2 className="line-clamp-2 font-semibold text-lg text-slate-800 leading-tight transition-colors group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-slate-100">
              {article.title}
            </h2>

            <div className="flex items-center gap-2 text-slate-500 text-sm dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
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
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags
                  .filter((tag) => article.tags.includes(tag.id))
                  .slice(0, 3) // Limit to 3 tags to avoid overcrowding
                  .map((tag) => (
                    <TagBadge
                      key={tag.id}
                      showIcon={true}
                      size="sm"
                      tag={tag}
                      variant="outline"
                    />
                  ))}
                {article.tags.length > 3 && (
                  <span className="px-2 py-1 text-slate-400 text-xs dark:text-slate-500">
                    +{article.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="mt-1 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
            <svg
              className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
