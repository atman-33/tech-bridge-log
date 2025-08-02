import type { ArticleMetadata } from '~/lib/blog/mdx-processor';
import { ReadingProgress } from './reading-progress';
import { TableOfContents } from './table-of-contents';
import { NavigationMenu } from './navigation-menu';
import { MarkdownRenderer } from './markdown-renderer';
import { ArticleNavigation } from './article-navigation';

interface ArticleContentProps {
  mdxContent: string;
  previousArticle: ArticleMetadata | null;
  nextArticle: ArticleMetadata | null;
}

export function ArticleContent({
  mdxContent,
  previousArticle,
  nextArticle,
}: ArticleContentProps) {
  return (
    <>
      <ReadingProgress target="article" />

      {/* Mobile Navigation Menu - shows when TOC is hidden */}
      <NavigationMenu content={mdxContent} />

      <div className="flex gap-8 max-w-full">
        {/* Main Content */}
        <article className="prose prose-lg max-w-none flex-1 min-w-0">
          <MarkdownRenderer content={mdxContent} />
          <ArticleNavigation previousArticle={previousArticle} nextArticle={nextArticle} />
        </article>

        {/* Table of Contents Sidebar - hidden on mobile */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <TableOfContents content={mdxContent} className="p-4 border border-border rounded-lg bg-muted/50" />
          </div>
        </aside>
      </div>
    </>
  );
}