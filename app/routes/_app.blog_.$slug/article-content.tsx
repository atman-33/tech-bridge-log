import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import type { ArticleMetadata } from '~/lib/blog/mdx-processor';
import { Badge } from '~/components/ui/badge';
import { formatDate } from '~/lib/utils';

interface ArticleContentProps {
  article: ArticleMetadata;
  mdxContent: string;
  previousArticle: ArticleMetadata | null;
  nextArticle: ArticleMetadata | null;
}

export function ArticleContent({
  article,
  mdxContent,
  previousArticle,
  nextArticle
}: ArticleContentProps) {
  return (
    <article className="prose prose-lg max-w-none">
      {/* Article Header */}
      <header className="mb-8 border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <time dateTime={article.publishedAt.toISOString()}>
            Published {formatDate(article.publishedAt)}
          </time>

          {article.updatedAt > article.publishedAt && (
            <time dateTime={article.updatedAt.toISOString()}>
              Updated {formatDate(article.updatedAt)}
            </time>
          )}

          <span>{article.readingTime} min read</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-xl text-muted-foreground mt-4">
          {article.description}
        </p>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-pre:bg-muted prose-pre:border prose-pre:border-border">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeRaw,
            rehypeSanitize,
            rehypeHighlight
          ]}
          components={{
            // Headings with proper styling
            h1: ({ children, ...props }) => (
              <h1 className="text-4xl font-bold tracking-tight mb-6 mt-8 first:mt-0" {...props}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 className="text-3xl font-semibold tracking-tight mb-4 mt-8" {...props}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="text-2xl font-semibold tracking-tight mb-3 mt-6" {...props}>
                {children}
              </h3>
            ),
            h4: ({ children, ...props }) => (
              <h4 className="text-xl font-semibold mb-2 mt-4" {...props}>
                {children}
              </h4>
            ),
            h5: ({ children, ...props }) => (
              <h5 className="text-lg font-semibold mb-2 mt-4" {...props}>
                {children}
              </h5>
            ),
            h6: ({ children, ...props }) => (
              <h6 className="text-base font-semibold mb-2 mt-4" {...props}>
                {children}
              </h6>
            ),

            // Paragraphs with proper spacing
            p: ({ children, ...props }) => (
              <p className="mb-4 leading-7" {...props}>
                {children}
              </p>
            ),

            // Lists with proper styling
            ul: ({ children, ...props }) => (
              <ul className="mb-4 ml-6 list-disc space-y-2" {...props}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol className="mb-4 ml-6 list-decimal space-y-2" {...props}>
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li className="leading-7" {...props}>
                {children}
              </li>
            ),

            // Links with proper styling
            a: ({ children, href, ...props }) => (
              <a
                href={href}
                className="text-primary hover:text-primary/80 underline underline-offset-4"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            ),

            // Code blocks with syntax highlighting
            pre: ({ children, ...props }) => (
              <pre className="mb-4 overflow-x-auto rounded-lg bg-muted border border-border p-4 text-sm" {...props}>
                {children}
              </pre>
            ),
            code: ({ children, className, ...props }) => {
              const isInline = !className?.includes('language-');

              if (isInline) {
                return (
                  <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },

            // Blockquotes
            blockquote: ({ children, ...props }) => (
              <blockquote className="mb-4 border-l-4 border-primary pl-4 italic text-muted-foreground" {...props}>
                {children}
              </blockquote>
            ),

            // Tables
            table: ({ children, ...props }) => (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full border-collapse border border-border" {...props}>
                  {children}
                </table>
              </div>
            ),
            th: ({ children, ...props }) => (
              <th className="border border-border bg-muted p-2 text-left font-semibold" {...props}>
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td className="border border-border p-2" {...props}>
                {children}
              </td>
            ),

            // Horizontal rule
            hr: (props) => (
              <hr className="my-8 border-border" {...props} />
            ),

            // Images with responsive styling
            img: ({ src, alt, ...props }) => (
              <img
                src={src}
                alt={alt}
                className="mb-4 max-w-full rounded-lg"
                loading="lazy"
                {...props}
              />
            ),
          }}
        >
          {mdxContent}
        </ReactMarkdown>
      </div>

      {/* Article Navigation */}
      {(previousArticle || nextArticle) && (
        <nav className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previousArticle && (
              <a
                href={`/blog/${previousArticle.slug}`}
                className="group p-4 rounded-lg border border-border hover:border-primary transition-colors"
              >
                <div className="text-sm text-muted-foreground mb-1">Previous Article</div>
                <div className="font-semibold group-hover:text-primary transition-colors">
                  {previousArticle.title}
                </div>
              </a>
            )}

            {nextArticle && (
              <a
                href={`/blog/${nextArticle.slug}`}
                className="group p-4 rounded-lg border border-border hover:border-primary transition-colors md:text-right"
              >
                <div className="text-sm text-muted-foreground mb-1">Next Article</div>
                <div className="font-semibold group-hover:text-primary transition-colors">
                  {nextArticle.title}
                </div>
              </a>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}