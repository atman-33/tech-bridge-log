import type { Route } from './+types/route';
import { loadArticleMetadata } from '~/lib/blog/article-loader';
import { getUsedTags } from '~/lib/blog/tags';
import { generateBlogListingMetaTags } from '~/lib/seo';
import { ArticleCard } from './article-card';

export const meta: Route.MetaFunction = () => {
  return generateBlogListingMetaTags();
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const articles = await loadArticleMetadata(request);

  // Sort articles by publication date (newest first) and filter published articles
  const publishedArticles = articles
    .filter(article => article.publishedAt <= new Date())
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  // Get tags that are actually used in articles
  const usedTags = await getUsedTags(publishedArticles);

  return {
    articles: publishedArticles,
    tags: usedTags
  };
};

export default function BlogPage({ loaderData }: Route.ComponentProps) {
  const { articles, tags } = loaderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary dark:bg-primary-foreground rounded-full animate-pulse"></span>
              Latest Articles
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
              Tech Blog
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Discover the latest technical articles, tutorials, and insights from our development team.
            </p>
            <div className="flex justify-center">
              <a
                href="/tags"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <span className="text-base">🏷️</span>
                Browse by Tags
              </a>
            </div>
          </header>

          {articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">No articles yet</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Check back soon for our latest technical content.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {articles.map((article, index) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  index={index}
                  tags={tags}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}