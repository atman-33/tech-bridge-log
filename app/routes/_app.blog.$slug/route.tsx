import type { Route } from './+types/route';
import { loadArticleBySlug, loadArticleMetadata } from '~/lib/blog/article-loader';
import { loadArticleContent } from '~/lib/blog/mdx-processor';
import { ArticleContent } from './article-content';

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.article) {
    return [
      { title: 'Article Not Found' },
      { name: 'description', content: 'The requested article could not be found.' },
    ];
  }

  const { article } = data;

  return [
    { title: `${article.title} - Tech Blog` },
    { name: 'description', content: article.description },
    { property: 'og:title', content: article.title },
    { property: 'og:description', content: article.description },
    { property: 'og:image', content: article.thumbnail },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: article.publishedAt.toISOString() },
    { property: 'article:modified_time', content: article.updatedAt.toISOString() },
    { property: 'article:tag', content: article.tags.join(', ') },
  ];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { slug } = params;

  if (!slug) {
    throw new Response('Article slug is required', { status: 400 });
  }

  // Load article metadata
  const article = await loadArticleBySlug(slug);

  if (!article) {
    throw new Response('Article not found', { status: 404 });
  }

  // Check if article is published
  if (article.publishedAt > new Date()) {
    throw new Response('Article not found', { status: 404 });
  }

  // Load MDX content
  const mdxContent = await loadArticleContent(slug);

  if (!mdxContent) {
    throw new Response('Article content could not be loaded', { status: 500 });
  }

  // Load all articles for navigation
  const allArticles = await loadArticleMetadata();
  const publishedArticles = allArticles
    .filter(a => a.publishedAt <= new Date())
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  // Find previous and next articles
  const currentIndex = publishedArticles.findIndex(a => a.slug === slug);
  const previousArticle = currentIndex > 0 ? publishedArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < publishedArticles.length - 1 ? publishedArticles[currentIndex + 1] : null;

  return {
    article,
    mdxContent,
    previousArticle,
    nextArticle,
  };
};

export default function ArticlePage({ loaderData }: Route.ComponentProps) {
  const { article, mdxContent, previousArticle, nextArticle } = loaderData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ArticleContent
          article={article}
          mdxContent={mdxContent}
          previousArticle={previousArticle}
          nextArticle={nextArticle}
        />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The article you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/blog"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          ← Back to Blog
        </a>
      </div>
    </div>
  );
}