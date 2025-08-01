import type { Components } from 'react-markdown';
import { generateHeadingId } from './article-utils';

export const markdownComponents: Components = {
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
};