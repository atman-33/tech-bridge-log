import type { Components } from 'react-markdown';
import { generateHeadingId } from '~/utils/heading-utils';
import { ImageWithFallback } from '~/components/blog/image-fallback';
import { EnhancedCodeBlock } from '~/components/blog/enhanced-code-block';
import { EnhancedImage } from '~/components/blog/enhanced-image';

export function createMarkdownComponents(slug: string): Components {
  return {
    // Headings with proper styling and IDs
    h1: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h1 id={id} className="text-4xl font-bold tracking-tight mb-6 mt-8 first:mt-0 scroll-mt-20" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h2 id={id} className="text-3xl font-semibold tracking-tight mb-4 mt-8 scroll-mt-20" {...props}>
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
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props}>
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
    img: ({ src, alt, ...props }) => {
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
          {alt && (
            <p className="text-sm text-muted-foreground text-center mt-2 italic">
              {alt}
            </p>
          )}
        </div>
      );
    },
  };
}