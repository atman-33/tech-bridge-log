import { Pagination } from "~/components/ui/pagination";
import { loadArticleMetadata } from "~/lib/blog/article-loader";
import { getUsedTags } from "~/lib/blog/tags";
import {
  createPageUrl,
  getPageFromSearchParams,
  paginateArray,
} from "~/lib/pagination";
import { generateBlogListingMetaTags } from "~/lib/seo";
import { ArticleCard } from "../../components/blog/article-card";
import type { Route } from "./+types/route";

export const meta: Route.MetaFunction = () => generateBlogListingMetaTags();

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  try {
    const url = new URL(request.url);
    const currentPage = getPageFromSearchParams(url.searchParams);

    const articles = await loadArticleMetadata(context, request);

    // Sort articles by publication date (newest first) and filter published articles
    const publishedArticles = articles
      .filter((article) => article.publishedAt <= new Date())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // Apply pagination
    const paginatedResult = paginateArray(publishedArticles, currentPage);

    // Get tags that are actually used in articles
    const usedTags = await getUsedTags(publishedArticles, context, request);

    return {
      articles: paginatedResult.items,
      pagination: paginatedResult.pagination,
      tags: usedTags,
      totalArticles: publishedArticles.length,
      currentUrl: {
        pathname: url.pathname,
        searchParams: url.searchParams.toString(),
      },
    };
  } catch (error) {
    console.error("Failed to load blog articles:", error);
    throw new Response("Failed to load articles", { status: 500 });
  }
};

export default function BlogPage({ loaderData }: Route.ComponentProps) {
  const { articles, pagination, tags, currentUrl } = loaderData;

  const createPageUrlForBlog = (page: number) => {
    const searchParams = new URLSearchParams(currentUrl.searchParams);
    return createPageUrl(currentUrl.pathname, page, searchParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-medium text-primary text-sm dark:bg-primary/20 dark:text-primary-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary dark:bg-primary-foreground" />
              Latest Articles
            </div>
          </header>

          {articles.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="text-2xl">📝</span>
              </div>
              <h2 className="mb-4 font-semibold text-2xl text-slate-800 dark:text-slate-200">
                No articles yet
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Check back soon for our latest technical content.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
                {articles.map((article, index) => (
                  <ArticleCard
                    article={article}
                    index={index}
                    key={article.slug}
                    tags={tags}
                  />
                ))}
              </div>

              <Pagination
                createPageUrl={createPageUrlForBlog}
                pagination={pagination}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg
            className="h-8 w-8 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <h1 className="mb-4 font-bold text-2xl">Failed to Load Articles</h1>
        <p className="mb-8 text-muted-foreground">
          There was an error loading the blog articles. Please try refreshing
          the page.
        </p>
        {/** biome-ignore lint/a11y/useButtonType: ignore */}
        <button
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
