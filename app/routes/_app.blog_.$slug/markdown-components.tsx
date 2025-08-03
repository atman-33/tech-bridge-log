import type { Components } from 'react-markdown';
import { generateHeadingId } from '~/utils/heading-utils';
import { EnhancedCodeBlock } from '~/components/blog/enhanced-code-block';
import { EnhancedImage } from '~/components/blog/enhanced-image';

export function createMarkdownComponents(slug: string): Components {
  return {
    // Headings with proper styling and IDs
    h1: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h1 id={id} className="text-4xl font-bold tracking-tight mb-6 mt-8 first:mt-0 scroll-mt-20 border-b border-border pb-2" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h2 id={id} className="text-3xl font-semibold tracking-tight mb-4 mt-8 scroll-mt-20 border-b border-border pb-2" {...props}>
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
    img: ({ src, alt, title, ...props }) => {
      // DEBUG: Log image component information (debug-image-link only)
      if (slug === 'debug-image-link') {
        console.log('=== IMAGE DEBUG INFO ===');
        console.log('img src:', src);
        console.log('img alt:', alt);
        console.log('img title:', title);
        console.log('img props:', props);
        console.log('img all props keys:', Object.keys(props));

        // Check if there are any parent-related props or context
        console.log('img props has node:', 'node' in props);
        console.log('img props has parent:', 'parent' in props);

        // Log the entire props object to see if there's any link information
        console.log('img full props object:', JSON.stringify(props, null, 2));
        console.log('========================');
      }

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
      // DEBUG: Log the structure of children to understand how image links are parsed (debug-image-link only)
      if (slug === 'debug-image-link') {
        console.log('=== LINK DEBUG INFO ===');
        console.log('href:', href);
        console.log('children:', children);
        console.log('children type:', typeof children);
        console.log('children is array:', Array.isArray(children));

        if (Array.isArray(children)) {
          console.log('children length:', children.length);
          children.forEach((child, index) => {
            console.log(`child[${index}]:`, child);
            console.log(`child[${index}] type:`, typeof child);
            if (typeof child === 'object' && child) {
              console.log(`child[${index}] constructor:`, child.constructor?.name);
              console.log(`child[${index}] has type prop:`, 'type' in child);
              if ('type' in child) {
                console.log(`child[${index}].type:`, child.type);
              }
              if ('props' in child) {
                console.log(`child[${index}].props:`, child.props);
              }
            }
          });
        } else if (typeof children === 'object' && children) {
          console.log('single child constructor:', children.constructor?.name);
          console.log('single child has type prop:', 'type' in children);
          if ('type' in children) {
            console.log('single child type:', children.type);
          }
          if ('props' in children) {
            console.log('single child props:', children.props);
          }
        }
        console.log('======================');
      }

      // Check if this link contains only an image
      const isImageLink = Array.isArray(children) &&
        children.length === 1 &&
        typeof children[0] === 'object' &&
        children[0] &&
        'type' in children[0] &&
        children[0].type === 'img';

      if (slug === 'debug-image-link') {
        console.log('isImageLink result:', isImageLink);
      }

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
  };
}