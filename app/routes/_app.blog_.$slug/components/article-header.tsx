import type { ArticleMetadata } from '~/lib/blog/mdx-processor';
import type { Tag } from '~/lib/blog/tags';
import { TagBadge } from '~/components/blog/tag-badge';
import { formatDate } from '~/lib/utils';

interface ArticleHeaderProps {
  article: ArticleMetadata;
  tags: Tag[];
}

export function ArticleHeader({ article, tags }: ArticleHeaderProps) {
  return (
    <header className="border-border pb-8">
      <div className="flex flex-col items-center text-center gap-4 mb-4">
        <span className="text-6xl">{article.emoji}</span>
        <h1 className="text-4xl font-bold tracking-tight">
          {article.title}
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-center text-sm text-muted-foreground mb-4 gap-4">
        <time dateTime={article.publishedAt.toISOString()}>
          Published {formatDate(article.publishedAt)}
        </time>

        {article.updatedAt > article.publishedAt && (
          <time dateTime={article.updatedAt.toISOString()}>
            Updated {formatDate(article.updatedAt)}
          </time>
        )}

        <span>{article.readingTime} min read</span>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            variant="default"
            size="md"
            showIcon={true}
          />
        ))}
      </div>

      <p className="text-md text-muted-foreground mt-4">
        {article.description}
      </p>
    </header>
  );
}