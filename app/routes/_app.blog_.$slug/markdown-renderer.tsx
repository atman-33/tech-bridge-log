import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { createMarkdownComponents } from './markdown-components';
import { remarkLinkCard } from '~/lib/blog/remark-link-card';

interface MarkdownRendererProps {
  content: string;
  slug: string;
}

export function MarkdownRenderer({ content, slug }: MarkdownRendererProps) {
  const markdownComponents = createMarkdownComponents(slug);

  // Create a custom sanitization schema that allows HTML elements commonly used in markdown
  const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [
      ...(defaultSchema.tagNames || []),
      'details',
      'summary',
      'kbd',
      'mark',
      'sub',
      'sup',
      'ins',
      'del',
      'abbr',
      'dfn',
      'time',
      'small',
      'cite',
      'q',
      'var',
      'samp',
      'output',
      'progress',
      'meter',
      'linkcard' // Allow lowercase version
    ],
    attributes: {
      ...defaultSchema.attributes,
      details: ['open'],
      summary: [],
      kbd: [],
      mark: [],
      sub: [],
      sup: [],
      ins: ['cite', 'dateTime'],
      del: ['cite', 'dateTime'],
      abbr: ['title'],
      dfn: ['title'],
      time: ['dateTime'],
      small: [],
      cite: [],
      q: ['cite'],
      var: [],
      samp: [],
      output: ['for'],
      progress: ['value', 'max'],
      meter: ['value', 'min', 'max', 'low', 'high', 'optimum'],
      linkcard: ['url'] // Allow url attribute for lowercase version
    }
  };

  return (
    <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-pre:bg-muted prose-pre:border prose-pre:border-border border p-2 md:p-8 rounded-md">
      <ReactMarkdown
        remarkPlugins={[remarkLinkCard, remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, sanitizeSchema],
          rehypeHighlight,
        ]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
