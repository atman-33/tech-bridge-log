import type { Route } from './+types/route';
import { loadArticleMetadata } from '~/lib/blog/article-loader';
import { getUsedTags } from '~/lib/blog/tags';
import { generateBlogListingMetaTags } from '~/lib/seo';
import { ArticleCard } from './article-card';
import { ArticleLoadingErrorBoundary } from '~/components/error-boundaries/article-error-boundary';

export const meta: Route.MetaFunction = () => {
  return generateBlogListingMetaTags();
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
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
  } catch (error) {
    console.error('Failed to load blog articles:', error);
    throw new Response('Failed to load articles', { status: 500 });
  }
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

export function ErrorBoundary() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Failed to Load Articles</h1>
        <p className="text-muted-foreground mb-8">
          There was an error loading the blog articles. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}