import type { Route } from './+types/route';
import { loadArticleBySlug, loadArticleMetadata } from '~/lib/blog/article-loader';
import { loadArticleContent } from '~/lib/blog/mdx-processor';
import { generateArticleMetaTags, generateArticleStructuredData } from '~/lib/seo';
import { ArticleContent } from './article-content';

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.article) {
    return [
      { title: 'Article Not Found' },
      { name: 'description', content: 'The requested article could not be found.' },
      { name: 'robots', content: 'noindex, nofollow' },
    ];
  }

  const { article } = data;
  return generateArticleMetaTags(article);
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { slug } = params;

  // console.log('Article loader called with slug:', slug);

  if (!slug) {
    throw new Response('Article slug is required', { status: 400 });
  }

  // Load article metadata
  const article = await loadArticleBySlug(slug, request);
  // console.log('Found article:', article);

  if (!article) {
    // console.log('Article not found for slug:', slug);
    throw new Response('Article not found', { status: 404 });
  }

  // Check if article is published
  // console.log('Article publishedAt:', article.publishedAt);
  // console.log('Current date:', new Date());
  // console.log('Is published:', article.publishedAt <= new Date());

  if (article.publishedAt > new Date()) {
    console.log('Article not published yet, throwing 404');
    throw new Response('Article not found', { status: 404 });
  }

  // Load MDX content
  // console.log('Loading MDX content for slug:', slug);
  const mdxContent = await loadArticleContent(slug);
  // console.log('MDX content loaded:', mdxContent ? 'success' : 'failed');
  // console.log('MDX content length:', mdxContent?.length);

  if (!mdxContent) {
    console.log('MDX content is null, throwing 500');
    throw new Response('Article content could not be loaded', { status: 500 });
  }

  // Load all articles for navigation
  const allArticles = await loadArticleMetadata(request);
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

  // Generate structured data for SEO
  const structuredData = generateArticleStructuredData(article);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

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
    </>
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