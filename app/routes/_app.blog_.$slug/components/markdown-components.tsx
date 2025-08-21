import type { Components } from 'react-markdown';
import { generateHeadingId } from '~/utils/heading-utils';
import { EnhancedCodeBlock } from '~/components/blog/enhanced-code-block';
import { EnhancedImage } from '~/components/blog/enhanced-image';
import { LinkCard as LinkCardComponent } from '~/components/blog/link-card';

interface CustomComponents extends Components {
  linkcard?: React.ComponentType<{ url?: string; }>;
}

export function createMarkdownComponents(slug: string): CustomComponents {
  return {
    // Headings with proper styling and IDs
    h1: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h1 id={id} className="text-4xl font-bold tracking-tight mb-6 mt-12 first:mt-0 scroll-mt-20 border-b border-border pb-2" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h2 id={id} className="text-3xl font-semibold tracking-tight mb-4 mt-12 scroll-mt-20 border-b border-border pb-2" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h3 id={id} className="text-2xl font-semibold tracking-tight mb-3 mt-6 scroll-mt-20" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h4 id={id} className="text-xl font-semibold mb-2 mt-4 scroll-mt-20" {...props}>
          {children}
        </h4>
      );
    },
    h5: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h5 id={id} className="text-lg font-semibold mb-2 mt-4 scroll-mt-20" {...props}>
          {children}
        </h5>
      );
    },
    h6: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h6 id={id} className="text-base font-semibold mb-2 mt-4 scroll-mt-20" {...props}>
          {children}
        </h6>
      );
    },

    // Paragraphs with proper spacing
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-7" {...props}>
        {children}
      </p>
    ),

    // Lists with proper styling
    ul: ({ children, ...props }) => (
      <ul className="mb-4 ml-8 list-disc space-y-1" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 ml-8 list-decimal space-y-1" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-7" {...props}>
        {children}
      </li>
    ),



    // Enhanced code blocks with copy and wrap functionality
    pre: ({ children, ...props }) => {
      // Check if this is a code block (has a code child with language class)
      const codeChild = Array.isArray(children) ? children[0] : children;
      const isCodeBlock = codeChild &&
        typeof codeChild === 'object' &&
        'props' in codeChild &&
        codeChild.props?.className?.includes('language-');

      if (isCodeBlock) {
        // Extract language from className, handling both "language-javascript" and "hljs language-javascript"
        const extractLanguage = (className: string): string => {
          const cleaned = className.replace(/^hljs\s+/, '');
          const match = cleaned.match(/language-(\w+)/);
          return match ? match[1] : '';
        };

        const language = extractLanguage(codeChild.props.className || '');
        return (
          <EnhancedCodeBlock
            className={codeChild.props.className}
            language={language}
          >
            {codeChild.props.children}
          </EnhancedCodeBlock>
        );
      }

      // Fallback for non-code pre elements
      return (
        <pre className="mb-4 overflow-x-auto rounded-lg bg-muted border border-border p-4 text-sm" {...props}>
          {children}
        </pre>
      );
    },
    code: ({ children, className, ...props }) => {
      const isInline = !className?.includes('language-');

      if (isInline) {
        return (
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono break-all" {...props}>
            {children}
          </code>
        );
      }

      // For code blocks, this will be handled by the pre component above
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

    // Enhanced images with loading states and path resolution
    img: ({ src, alt, title, ...props }) => {
      if (!src) {
        return (
          <div className="mb-4 p-4 bg-muted border border-border rounded-lg text-center text-muted-foreground">
            Missing image source
          </div>
        );
      }

      return (
        <div className="mb-4">
          <EnhancedImage
            src={src}
            alt={alt || 'Article image'}
            slug={slug}
            className="max-w-full"
            {...props}
          />
          {title && (
            <p className="text-sm text-muted-foreground text-center mt-2 italic">
              {title}
            </p>
          )}
        </div>
      );
    },

    // Links with proper styling - handle image links specially
    a: ({ children, href, ...props }) => {
      // Check if this link contains only an image
      const isImageLink = Array.isArray(children) &&
        children.length === 1 &&
        typeof children[0] === 'object' &&
        children[0] &&
        'type' in children[0] &&
        children[0].type === 'img';

      if (isImageLink) {
        const imgElement = children[0] as any;
        return (
          <div className="mb-4">
            <a
              href={href}
              className="block"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              <EnhancedImage
                src={imgElement.props.src}
                alt={imgElement.props.alt || 'Article image'}
                slug={slug}
                className="max-w-full hover:opacity-80 transition-opacity"
              />
            </a>
            {imgElement.props.title && (
              <p className="text-sm text-muted-foreground text-center mt-2 italic">
                {imgElement.props.title}
              </p>
            )}
          </div>
        );
      }

      // Regular links
      return (
        <a
          href={href}
          className="text-primary hover:text-primary/80 underline underline-offset-4"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },

    // HTML elements for enhanced markdown
    details: ({ children, ...props }) => (
      <details className="mb-4 border border-border rounded-lg overflow-hidden" {...props}>
        {children}
      </details>
    ),
    summary: ({ children, ...props }) => (
      <summary className="bg-muted px-4 py-2 cursor-pointer hover:bg-muted/80 font-medium border-b border-border" {...props}>
        {children}
      </summary>
    ),
    kbd: ({ children, ...props }) => (
      <kbd className="inline-flex items-center px-2 py-1 text-xs font-mono bg-muted border border-border rounded shadow-sm" {...props}>
        {children}
      </kbd>
    ),
    mark: ({ children, ...props }) => (
      <mark className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded" {...props}>
        {children}
      </mark>
    ),
    sub: ({ children, ...props }) => (
      <sub className="text-xs" {...props}>
        {children}
      </sub>
    ),
    sup: ({ children, ...props }) => (
      <sup className="text-xs" {...props}>
        {children}
      </sup>
    ),
    ins: ({ children, ...props }) => (
      <ins className="text-green-600 dark:text-green-400 no-underline bg-green-100 dark:bg-green-900/30 px-1 rounded" {...props}>
        {children}
      </ins>
    ),
    del: ({ children, ...props }) => (
      <del className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1 rounded" {...props}>
        {children}
      </del>
    ),
    abbr: ({ children, ...props }) => (
      <abbr className="border-b border-dotted border-muted-foreground cursor-help" {...props}>
        {children}
      </abbr>
    ),
    small: ({ children, ...props }) => (
      <small className="text-sm text-muted-foreground" {...props}>
        {children}
      </small>
    ),

    // Custom linkcard component for standalone URLs
    // The key must be lowercase to match the HTML tag rendered by rehypeRaw.
    linkcard: ({ url, ...props }: { url?: string; }) => {
      if (!url) return null;
      return <LinkCardComponent url={url} {...props} />;
    },
  };
}
