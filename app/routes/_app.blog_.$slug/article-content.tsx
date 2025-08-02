import type { ArticleMetadata } from '~/lib/blog/mdx-processor';
import type { Tag } from '~/lib/blog/tags';
import { ReadingProgress } from './reading-progress';
import { TableOfContents } from './table-of-contents';
import { ArticleHeader } from './article-header';
import { MarkdownRenderer } from './markdown-renderer';
import { ArticleNavigation } from './article-navigation';

interface ArticleContentProps {
  article: ArticleMetadata;
  mdxContent: string;
  previousArticle: ArticleMetadata | null;
  nextArticle: ArticleMetadata | null;
  tags: Tag[];
}

export function ArticleContent({
  article,
  mdxContent,
  previousArticle,
  nextArticle,
  tags
}: ArticleContentProps) {
  return (
    <>
      <ReadingProgress target="article" />

      <div className="flex gap-8">
        {/* Main Content */}
        <article className="prose prose-lg max-w-none flex-1">
          <ArticleHeader article={article} tags={tags} />
          <MarkdownRenderer content={mdxContent} />
          <ArticleNavigation previousArticle={previousArticle} nextArticle={nextArticle} />
        </article>

        {/* Table of Contents Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <TableOfContents content={mdxContent} className="p-4 border border-border rounded-lg bg-muted/50" />
          </div>
        </aside>
      </div>
    </>
  );
}