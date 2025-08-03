import type { Route } from './+types/route';
import { loadArticleMetadata } from '~/lib/blog/article-loader';
import { loadTagsConfig, getUsedTags } from '~/lib/blog/tags';
import { ArticleCard } from '~/components/blog/article-card';
import { TagHeader } from './tag-header';
import { TagErrorBoundary } from '~/components/error-boundaries/tag-error-boundary';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Browse by Tags - Tech Blog' },
    { name: 'description', content: 'Explore our technical articles organized by topics and technologies.' },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const selectedTag = url.searchParams.get('tag');

  try {
    // Load all articles and tags
    const [articles, allTags] = await Promise.all([
      loadArticleMetadata(request),
      loadTagsConfig(),
    ]);

    // Filter published articles
    const publishedArticles = articles
      .filter(article => article.publishedAt <= new Date())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // Get tags that are actually used in articles
    const usedTags = await getUsedTags(publishedArticles);

    // If a specific tag is requested but doesn't exist, throw 404
    if (selectedTag && !usedTags.find(tag => tag.id === selectedTag)) {
      throw new Response(`Tag "${selectedTag}" not found`, { status: 404 });
    }

    // Filter articles by selected tag if provided
    const filteredArticles = selectedTag
      ? publishedArticles.filter(article => article.tags.includes(selectedTag))
      : publishedArticles;

    // Find the selected tag info
    const selectedTagInfo = selectedTag
      ? usedTags.find(tag => tag.id === selectedTag) || null
      : null;

    return {
      articles: filteredArticles,
      allTags: usedTags,
      selectedTag: selectedTagInfo,
      requestedTagId: selectedTag,
    };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error('Failed to load tags page:', error);
    throw new Response('Failed to load tags', { status: 500 });
  }
};

export default function TagsPage({ loaderData }: Route.ComponentProps) {
  const { articles, allTags, selectedTag, requestedTagId } = loaderData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <TagHeader
            selectedTag={selectedTag}
            allTags={allTags}
            articleCount={articles.length}
          />

          {articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-2xl">🏷️</span>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                {selectedTag ? `No articles found for "${selectedTag.label}"` : 'No articles found'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {selectedTag
                  ? 'Try selecting a different tag or browse all articles.'
                  : 'Check back soon for our latest technical content.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              {articles.map((article, index) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error?: Error; }) {
  // Try to extract tag ID from URL if available
  const tagId = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('tag')
    : null;

  return <TagErrorBoundary tagId={tagId || undefined} error={error} />;
}