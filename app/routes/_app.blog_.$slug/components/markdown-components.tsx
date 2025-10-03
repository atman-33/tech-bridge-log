import type { Components } from "react-markdown";
import { EnhancedCodeBlock } from "~/components/blog/enhanced-code-block";
import { EnhancedImage } from "~/components/blog/enhanced-image";
import { LinkCard as LinkCardComponent } from "~/components/blog/link-card";
import { generateHeadingId } from "~/utils/heading-utils";

interface CustomComponents extends Components {
  linkcard?: React.ComponentType<{ url?: string }>;
}

export function createMarkdownComponents(slug: string): CustomComponents {
  return {
    // Headings with proper styling and IDs
    h1: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h1
          className="mt-12 mb-6 scroll-mt-20 border-border border-b pb-2 font-bold text-4xl tracking-tight first:mt-0"
          id={id}
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h2
          className="mt-12 mb-4 scroll-mt-20 border-border border-b pb-2 font-semibold text-3xl tracking-tight"
          id={id}
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h3
          className="mt-8 mb-3 scroll-mt-20 font-semibold text-2xl tracking-tight"
          id={id}
          {...props}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h4
          className="mt-4 mb-2 scroll-mt-20 font-semibold text-xl"
          id={id}
          {...props}
        >
          {children}
        </h4>
      );
    },
    h5: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h5
          className="mt-4 mb-2 scroll-mt-20 font-semibold text-lg"
          id={id}
          {...props}
        >
          {children}
        </h5>
      );
    },
    h6: ({ children, ...props }) => {
      const id = generateHeadingId(String(children));
      return (
        <h6
          className="mt-4 mb-2 scroll-mt-20 font-semibold text-base"
          id={id}
          {...props}
        >
          {children}
        </h6>
      );
    },

    // Paragraphs with proper spacing
    p: ({ children, ...props }) => (
      <p className="mb-2 leading-7" {...props}>
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
      const isCodeBlock =
        codeChild &&
        typeof codeChild === "object" &&
        "props" in codeChild &&
        codeChild.props?.className?.includes("language-");

      if (isCodeBlock) {
        // Extract language from className, handling both "language-javascript" and "hljs language-javascript"
        const extractLanguage = (className: string): string => {
          const cleaned = className.replace(/^hljs\s+/, "");
          const match = cleaned.match(/language-(\w+)/);
          return match ? match[1] : "";
        };

        const language = extractLanguage(codeChild.props.className || "");
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
        <pre
          className="mb-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm"
          {...props}
        >
          {children}
        </pre>
      );
    },
    code: ({ children, className, ...props }) => {
      const isInline = !className?.includes("language-");

      if (isInline) {
        return (
          <code
            className="break-all rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
            {...props}
          >
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
      <blockquote
        className="mb-4 border-primary border-l-4 pl-4 text-muted-foreground italic"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Tables
    table: ({ children, ...props }) => (
      <div className="mb-4 overflow-x-auto">
        <table
          className="w-full border-collapse border border-border"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border border-border bg-muted p-2 text-left font-semibold"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-border p-2" {...props}>
        {children}
      </td>
    ),

    // Horizontal rule
    hr: (props) => <hr className="my-8 border-border" {...props} />,

    // Enhanced images with loading states and path resolution
    img: ({ src, alt, title, ...props }) => {
      if (!src) {
        return (
          <div className="mb-4 rounded-lg border border-border bg-muted p-4 text-center text-muted-foreground">
            Missing image source
          </div>
        );
      }

      return (
        <div className="mb-4">
          <EnhancedImage
            alt={alt || "Article image"}
            className="max-w-[720px]"
            slug={slug}
            src={src}
            {...props}
          />
          {title && (
            <p className="mt-2 text-center text-muted-foreground text-sm italic">
              {title}
            </p>
          )}
        </div>
      );
    },

    // Links with proper styling - handle image links specially
    a: ({ children, href, ...props }) => {
      // Check if this link contains only an image
      const isImageLink =
        Array.isArray(children) &&
        children.length === 1 &&
        typeof children[0] === "object" &&
        children[0] &&
        "type" in children[0] &&
        children[0].type === "img";

      if (isImageLink) {
        // biome-ignore lint/suspicious/noExplicitAny: ignore
        const imgElement = children[0] as any;
        return (
          <div className="mb-4">
            <a
              className="block"
              href={href}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              target={href?.startsWith("http") ? "_blank" : undefined}
              {...props}
            >
              <EnhancedImage
                alt={imgElement.props.alt || "Article image"}
                className="max-w-full transition-opacity hover:opacity-80"
                slug={slug}
                src={imgElement.props.src}
              />
            </a>
            {imgElement.props.title && (
              <p className="mt-2 text-center text-muted-foreground text-sm italic">
                {imgElement.props.title}
              </p>
            )}
          </div>
        );
      }

      // Regular links
      return (
        <a
          className="text-primary underline underline-offset-4 hover:text-primary/80"
          href={href}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          target={href?.startsWith("http") ? "_blank" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },

    // HTML elements for enhanced markdown
    details: ({ children, ...props }) => (
      <details
        className="mb-4 overflow-hidden rounded-lg border border-border"
        {...props}
      >
        {children}
      </details>
    ),
    summary: ({ children, ...props }) => (
      <summary
        className="cursor-pointer border-border border-b bg-muted px-4 py-2 font-medium hover:bg-muted/80"
        {...props}
      >
        {children}
      </summary>
    ),
    kbd: ({ children, ...props }) => (
      <kbd
        className="inline-flex items-center rounded border border-border bg-muted px-2 py-1 font-mono text-xs shadow-sm"
        {...props}
      >
        {children}
      </kbd>
    ),
    mark: ({ children, ...props }) => (
      <mark
        className="rounded bg-yellow-200 px-1 dark:bg-yellow-800"
        {...props}
      >
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
      <ins
        className="rounded bg-green-100 px-1 text-green-600 no-underline dark:bg-green-900/30 dark:text-green-400"
        {...props}
      >
        {children}
      </ins>
    ),
    del: ({ children, ...props }) => (
      <del
        className="rounded bg-red-100 px-1 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        {...props}
      >
        {children}
      </del>
    ),
    abbr: ({ children, ...props }) => (
      <abbr
        className="cursor-help border-muted-foreground border-b border-dotted"
        {...props}
      >
        {children}
      </abbr>
    ),
    small: ({ children, ...props }) => (
      <small className="text-muted-foreground text-sm" {...props}>
        {children}
      </small>
    ),

    // Custom linkcard component for standalone URLs
    // The key must be lowercase to match the HTML tag rendered by rehypeRaw.
    linkcard: ({ url, ...props }: { url?: string }) => {
      if (!url) {
        return null;
      }
      return (
        <LinkCardComponent className="max-w-[720px]" url={url} {...props} />
      );
    },
  };
}
