import { TagBadge } from "~/components/blog/tag-badge";
import type { ArticleMetadata } from "~/lib/blog/mdx-processor";
import type { Tag } from "~/lib/blog/tags";
import { formatDate } from "~/lib/utils";

type ArticleHeaderProps = {
  article: ArticleMetadata;
  tags: Tag[];
};

export function ArticleHeader({ article, tags }: ArticleHeaderProps) {
  return (
    <header className="border-border pb-8">
      <div className="mb-4 flex flex-col items-center gap-4 text-center">
        <span className="text-6xl">{article.emoji}</span>
        <h1 className="font-bold text-4xl tracking-tight">{article.title}</h1>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-sm">
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

      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag) => (
          <TagBadge
            key={tag.id}
            showIcon={true}
            size="md"
            tag={tag}
            variant="default"
          />
        ))}
      </div>

      <p className="mt-4 text-md text-muted-foreground">
        {article.description}
      </p>
    </header>
  );
}
