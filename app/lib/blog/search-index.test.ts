import { describe, expect, it, vi } from "vitest";
import {
  deduplicateSearchableArticles,
  deduplicateSearchResults,
  extractSnippets,
  highlightSearchTerms,
  type SearchableArticle,
  type SearchResult,
  stripMarkdown,
} from "./search-index";

describe("Search Index Deduplication", () => {
  describe("deduplicateSearchResults", () => {
    it("should remove duplicate search results by slug", () => {
      const results: SearchResult[] = [
        {
          slug: "article-1",
          title: "Article 1",
          description: "Description 1",
          tags: ["tag1"],
          highlights: { title: "Article 1" },
        },
        {
          slug: "article-2",
          title: "Article 2",
          description: "Description 2",
          tags: ["tag2"],
          highlights: { title: "Article 2" },
        },
        {
          slug: "article-1", // Duplicate
          title: "Article 1 Duplicate",
          description: "Description 1 Duplicate",
          tags: ["tag1"],
          highlights: { title: "Article 1 Duplicate" },
        },
      ];

      const deduplicated = deduplicateSearchResults(results);

      expect(deduplicated).toHaveLength(2);
      expect(deduplicated[0].slug).toBe("article-1");
      expect(deduplicated[1].slug).toBe("article-2");
      // Should keep the first occurrence
      expect(deduplicated[0].title).toBe("Article 1");
    });

    it("should return empty array for empty input", () => {
      const results = deduplicateSearchResults([]);
      expect(results).toEqual([]);
    });

    it("should return same array if no duplicates", () => {
      const results: SearchResult[] = [
        {
          slug: "article-1",
          title: "Article 1",
          description: "Description 1",
          tags: ["tag1"],
          highlights: { title: "Article 1" },
        },
        {
          slug: "article-2",
          title: "Article 2",
          description: "Description 2",
          tags: ["tag2"],
          highlights: { title: "Article 2" },
        },
      ];

      const deduplicated = deduplicateSearchResults(results);
      expect(deduplicated).toEqual(results);
    });
  });

  describe("deduplicateSearchableArticles", () => {
    it("should remove duplicate searchable articles by slug", () => {
      const articles: SearchableArticle[] = [
        {
          slug: "article-1",
          title: "Article 1",
          description: "Description 1",
          content: "Content 1",
          tags: ["tag1"],
        },
        {
          slug: "article-2",
          title: "Article 2",
          description: "Description 2",
          content: "Content 2",
          tags: ["tag2"],
        },
        {
          slug: "article-1", // Duplicate
          title: "Article 1 Duplicate",
          description: "Description 1 Duplicate",
          content: "Content 1 Duplicate",
          tags: ["tag1"],
        },
      ];

      // biome-ignore lint/suspicious/noEmptyBlockStatements: ignore
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const deduplicated = deduplicateSearchableArticles(articles);

      expect(deduplicated).toHaveLength(2);
      expect(deduplicated[0].slug).toBe("article-1");
      expect(deduplicated[1].slug).toBe("article-2");
      // Should keep the first occurrence
      expect(deduplicated[0].title).toBe("Article 1");

      // Should log warning for duplicate
      expect(consoleSpy).toHaveBeenCalledWith(
        "Duplicate article found in search index: article-1"
      );

      consoleSpy.mockRestore();
    });

    it("should return empty array for empty input", () => {
      const articles = deduplicateSearchableArticles([]);
      expect(articles).toEqual([]);
    });
  });

  describe("highlightSearchTerms", () => {
    it("should highlight search terms in text", () => {
      const text = "This is a test article about React and TypeScript";
      const searchTerms = ["React", "TypeScript"];

      const highlighted = highlightSearchTerms(text, searchTerms);

      expect(highlighted).toContain("<mark>React</mark>");
      expect(highlighted).toContain("<mark>TypeScript</mark>");
    });

    it("should handle case insensitive highlighting", () => {
      const text = "This is a test article about react and typescript";
      const searchTerms = ["React", "TypeScript"];

      const highlighted = highlightSearchTerms(text, searchTerms);

      expect(highlighted).toContain("<mark>react</mark>");
      expect(highlighted).toContain("<mark>typescript</mark>");
    });

    it("should return original text if no search terms", () => {
      const text = "This is a test article";
      const highlighted = highlightSearchTerms(text, []);

      expect(highlighted).toBe(text);
    });
  });

  describe("extractSnippets", () => {
    it("should extract snippets around search terms", () => {
      const content =
        "This is a long article about React development. React is a popular JavaScript library for building user interfaces. It makes development easier.";
      const searchTerms = ["React"];

      const snippet = extractSnippets(content, searchTerms, 50);

      expect(snippet).toContain("React");
      expect(snippet.length).toBeLessThanOrEqual(60); // 50 + ellipsis and buffer
    });

    it("should truncate long content without search terms", () => {
      const content =
        "This is a very long article that does not contain the search term we are looking for in the content.";
      const searchTerms = ["missing"];

      const snippet = extractSnippets(content, searchTerms, 50);

      expect(snippet.length).toBeLessThanOrEqual(60); // 50 + ellipsis and buffer
      expect(snippet).toContain("...");
    });
  });

  describe("stripMarkdown", () => {
    it("should remove markdown syntax", () => {
      const markdown = `
# Header
**Bold text** and *italic text*
\`inline code\` and [link](http://example.com)
\`\`\`javascript
const code = 'block';
\`\`\`
      `;

      const stripped = stripMarkdown(markdown);

      expect(stripped).not.toContain("#");
      expect(stripped).not.toContain("**");
      expect(stripped).not.toContain("*");
      expect(stripped).not.toContain("[");
      expect(stripped).not.toContain("](");
      expect(stripped).toContain("Header");
      expect(stripped).toContain("Bold text");
      expect(stripped).toContain("italic text");
    });

    it("should remove HTML tags", () => {
      const html = "<div><p>This is <strong>HTML</strong> content</p></div>";
      const stripped = stripMarkdown(html);

      expect(stripped).not.toContain("<");
      expect(stripped).not.toContain(">");
      expect(stripped).toContain("This is HTML content");
    });
  });
});
