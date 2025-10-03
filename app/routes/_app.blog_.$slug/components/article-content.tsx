import type { ArticleMetadata } from "~/lib/blog/mdx-processor";
import { ArticleNavigation } from "./article-navigation";
import { MarkdownRenderer } from "./markdown-renderer";
import { NavigationMenu } from "./navigation-menu";
import { ReadingProgress } from "./reading-progress";
import { RelatedArticles } from "./related-articles";
import { TableOfContents } from "./table-of-contents";

type ArticleContentProps = {
  mdxContent: string;
  slug: string;
  previousArticle: ArticleMetadata | null;
  nextArticle: ArticleMetadata | null;
  relatedArticles: ArticleMetadata[];
};

export function ArticleContent({
  mdxContent,
  slug,
  previousArticle,
  nextArticle,
  relatedArticles,
}: ArticleContentProps) {
  return (
    <>
      <ReadingProgress target="article" />

      {/* Mobile Navigation Menu - shows when TOC is hidden */}
      <NavigationMenu content={mdxContent} />

      <div className="flex max-w-full gap-8">
        {/* Main Content */}
        <article className="prose prose-lg min-w-0 max-w-none flex-1">
          <MarkdownRenderer content={mdxContent} slug={slug} />
          <RelatedArticles articles={relatedArticles} />
          <ArticleNavigation
            nextArticle={nextArticle}
            previousArticle={previousArticle}
          />
        </article>

        {/* Table of Contents Sidebar - hidden on mobile */}
        <aside className="hidden w-64 flex-shrink-0 md:block">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden">
            <TableOfContents
              className="rounded-lg border border-border bg-muted/50 p-4"
              content={mdxContent}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
