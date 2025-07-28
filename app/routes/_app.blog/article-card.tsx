import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import type { ArticleMetadata } from '~/lib/blog/mdx-processor';

interface ArticleCardProps {
  article: ArticleMetadata;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatReadingTime = (minutes: number) => {
    return `${minutes} min read`;
  };

  return (
    <article className="group">
      <Link to={`/blog/${article.slug}`} className="block">
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg group-hover:shadow-lg">
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail */}
            <div className="md:w-1/3 lg:w-1/4">
              <div className="aspect-video md:aspect-square overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt={`Thumbnail for ${article.title}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Content */}
            <div className="md:w-2/3 lg:w-3/4">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <CardTitle className="text-xl md:text-2xl line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>

                <CardDescription className="text-base line-clamp-3 mt-2">
                  {article.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <time dateTime={article.publishedAt.toISOString()}>
                    {formatDate(article.publishedAt)}
                  </time>
                  <span>{formatReadingTime(article.readingTime)}</span>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </Link>
    </article>
  );
}