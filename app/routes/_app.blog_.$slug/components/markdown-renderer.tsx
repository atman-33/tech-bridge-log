import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { rehypeLinkCardTransform } from "~/lib/blog/rehype-link-card-transform";
import { remarkLinkCard } from "~/lib/blog/remark-link-card";
import { createMarkdownComponents } from "./markdown-components";

type MarkdownRendererProps = {
  content: string;
  slug: string;
};

export function MarkdownRenderer({ content, slug }: MarkdownRendererProps) {
  const markdownComponents = createMarkdownComponents(slug);

  // Create a custom sanitization schema that allows HTML elements commonly used in markdown
  const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [
      ...(defaultSchema.tagNames || []),
      "details",
      "summary",
      "kbd",
      "mark",
      "sub",
      "sup",
      "ins",
      "del",
      "abbr",
      "dfn",
      "time",
      "small",
      "cite",
      "q",
      "var",
      "samp",
      "output",
      "progress",
      "meter",
      "linkcard", // Allow lowercase version
    ],
    attributes: {
      ...defaultSchema.attributes,
      details: ["open"],
      summary: [],
      kbd: [],
      mark: [],
      sub: [],
      sup: [],
      ins: ["cite", "dateTime"],
      del: ["cite", "dateTime"],
      abbr: ["title"],
      dfn: ["title"],
      time: ["dateTime"],
      small: [],
      cite: [],
      q: ["cite"],
      var: [],
      samp: [],
      output: ["for"],
      progress: ["value", "max"],
      meter: ["value", "min", "max", "low", "high", "optimum"],
      linkcard: ["url"], // Allow url attribute for lowercase version
    },
  };

  return (
    <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 rounded-md border prose-pre:border prose-pre:border-border prose-pre:bg-muted p-2 md:p-8">
      <ReactMarkdown
        components={markdownComponents}
        rehypePlugins={[
          rehypeRaw,
          rehypeLinkCardTransform, // Add the new rehype plugin
          [rehypeSanitize, sanitizeSchema],
          rehypeHighlight,
        ]}
        remarkPlugins={[
          remarkLinkCard,
          [remarkGfm],
          remarkBreaks, // Add breaks plugin to convert line breaks to <br> tags
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
