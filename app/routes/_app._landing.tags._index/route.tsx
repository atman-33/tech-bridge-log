import { ArticleCard } from "~/components/blog/article-card";
import { TagErrorBoundary } from "~/components/error-boundaries/tag-error-boundary";
import { Pagination } from "~/components/ui/pagination";
import { loadArticleMetadata } from "~/lib/blog/article-loader";
import { getUsedTags, loadTagsConfig } from "~/lib/blog/tags";
import {
  createPageUrl,
  getPageFromSearchParams,
  paginateArray,
} from "~/lib/pagination";
import type { Route } from "./+types/route";
import { TagHeader } from "./components/tag-header";

export const meta: Route.MetaFunction = () => [
  { title: "Browse by Tags - Tech Bridge Log" },
  {
    name: "description",
    content:
      "Explore our technical articles organized by topics and technologies.",
  },
];

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const selectedTag = url.searchParams.get("tag");
  const currentPage = getPageFromSearchParams(url.searchParams);

  try {
    // Load all articles and tags
    const [articles] = await Promise.all([
      loadArticleMetadata(context, request),
      loadTagsConfig(context, request),
    ]);

    // Filter published articles
    const publishedArticles = articles
      .filter((article) => article.publishedAt <= new Date())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // Get tags that are actually used in articles
    const usedTags = await getUsedTags(publishedArticles, context, request);

    // If a specific tag is requested but doesn't exist, throw 404
    if (selectedTag && !usedTags.find((tag) => tag.id === selectedTag)) {
      throw new Response(`Tag "${selectedTag}" not found`, { status: 404 });
    }

    // Filter articles by selected tag if provided
    const filteredArticles = selectedTag
      ? publishedArticles.filter((article) =>
          article.tags.includes(selectedTag)
        )
      : publishedArticles;

    // Apply pagination
    const paginatedResult = paginateArray(filteredArticles, currentPage);

    // Find the selected tag info
    const selectedTagInfo = selectedTag
      ? usedTags.find((tag) => tag.id === selectedTag) || null
      : null;

    return {
      articles: paginatedResult.items,
      pagination: paginatedResult.pagination,
      allTags: usedTags,
      selectedTag: selectedTagInfo,
      requestedTagId: selectedTag,
      totalArticles: filteredArticles.length,
      currentUrl: {
        pathname: url.pathname,
        searchParams: url.searchParams.toString(),
      },
    };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Failed to load tags page:", error);
    throw new Response("Failed to load tags", { status: 500 });
  }
};

export default function TagsPage({ loaderData }: Route.ComponentProps) {
  const {
    articles,
    pagination,
    allTags,
    selectedTag,
    totalArticles,
    currentUrl,
  } = loaderData;

  const createPageUrlForTag = (page: number) => {
    const searchParams = new URLSearchParams(currentUrl.searchParams);
    return createPageUrl(currentUrl.pathname, page, searchParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <TagHeader
            allTags={allTags}
            articleCount={totalArticles}
            selectedTag={selectedTag}
          />

          {articles.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="text-2xl">🏷️</span>
              </div>
              <h2 className="mb-4 font-semibold text-2xl text-slate-800 dark:text-slate-200">
                {selectedTag
                  ? `No articles found for "${selectedTag.label}"`
                  : "No articles found"}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {selectedTag
                  ? "Try selecting a different tag or browse all articles."
                  : "Check back soon for our latest technical content."}
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
                  />
                ))}
              </div>

              <Pagination
                createPageUrl={createPageUrlForTag}
                pagination={pagination}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error?: Error }) {
  return <TagErrorBoundary error={error} />;
}
