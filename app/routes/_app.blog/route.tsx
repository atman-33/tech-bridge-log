import type { Route } from './+types/route';
import { loadArticleMetadata } from '~/lib/blog/article-loader';
import { generateBlogListingMetaTags } from '~/lib/seo';
import { ArticleCard } from './article-card';

export const meta: Route.MetaFunction = () => {
  return generateBlogListingMetaTags();
};

export const loader = async ({ request }: Route.LoaderArgs): Promise<{ articles: Awaited<ReturnType<typeof loadArticleMetadata>>; }> => {
  const articles = await loadArticleMetadata(request);

  // Sort articles by publication date (newest first) and filter published articles
  const publishedArticles = articles
    .filter(article => article.publishedAt <= new Date())
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return { articles: publishedArticles };
};

export default function BlogPage({ loaderData }: Route.ComponentProps) {
  const { articles } = loaderData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Tech Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the latest technical articles, tutorials, and insights from our development team.
          </p>
        </header>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No articles yet</h2>
            <p className="text-muted-foreground">
              Check back soon for our latest technical content.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:gap-12">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}