import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { createMarkdownComponents } from './markdown-components';

interface MarkdownRendererProps {
  content: string;
  slug: string;
}

export function MarkdownRenderer({ content, slug }: MarkdownRendererProps) {
  const markdownComponents = createMarkdownComponents(slug);

  // DEBUG: Log the raw markdown content for debug-image-link
  if (slug === 'debug-image-link') {
    console.log('=== MARKDOWN CONTENT DEBUG ===');
    console.log('Raw markdown content:', content);
    console.log('==============================');
  }

  return (
    <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-pre:bg-muted prose-pre:border prose-pre:border-border border p-2 md:p-8 rounded-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSanitize,
          rehypeHighlight
        ]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}