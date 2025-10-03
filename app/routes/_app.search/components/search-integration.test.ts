import { describe, expect, it } from "vitest";
import {
  createDocumentIndex,
  deduplicateSearchableArticles,
  performSearch,
  type SearchableArticle,
} from "~/lib/blog/search-index";

describe("Search Integration", () => {
  const mockArticles: SearchableArticle[] = [
    {
      slug: "react-guide",
      title: "React Development Guide",
      description: "A comprehensive guide to React development",
      content:
        "React is a popular JavaScript library for building user interfaces. It uses components and hooks.",
      tags: ["react", "javascript", "frontend"],
    },
    {
      slug: "typescript-basics",
      title: "TypeScript Basics",
      description: "Learn the fundamentals of TypeScript",
      content:
        "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
      tags: ["typescript", "javascript"],
    },
    {
      slug: "react-guide", // Duplicate slug
      title: "React Guide Duplicate",
      description: "This is a duplicate article",
      content: "This should be filtered out by deduplication.",
      tags: ["react"],
    },
  ];

  it("should deduplicate articles and perform search correctly", () => {
    // Deduplicate articles
    const deduplicatedArticles = deduplicateSearchableArticles(mockArticles);

    // Should remove the duplicate
    expect(deduplicatedArticles).toHaveLength(2);
    expect(
      deduplicatedArticles.find((a) => a.slug === "react-guide")?.title
    ).toBe("React Development Guide");

    // Create search index
    const index = createDocumentIndex();

    // Add articles to index
    for (const article of deduplicatedArticles) {
      index.add({
        slug: article.slug,
        title: article.title,
        description: article.description,
        content: article.content,
        tags: article.tags.join(" "),
      });
    }

    // Perform search
    const results = performSearch(index, deduplicatedArticles, "React", 10);

    // Should find the React article
    expect(results).toHaveLength(1);
    expect(results[0].slug).toBe("react-guide");
    expect(results[0].title).toBe("React Development Guide");
    expect(results[0].highlights.title).toContain("<mark>React</mark>");
  });

  it("should handle search across multiple fields", () => {
    const deduplicatedArticles = deduplicateSearchableArticles(mockArticles);
    const index = createDocumentIndex();

    for (const article of deduplicatedArticles) {
      index.add({
        slug: article.slug,
        title: article.title,
        description: article.description,
        content: article.content,
        tags: article.tags.join(" "),
      });
    }

    // Search for JavaScript (appears in both articles)
    const results = performSearch(
      index,
      deduplicatedArticles,
      "JavaScript",
      10
    );

    // Should find both articles
    expect(results).toHaveLength(2);

    // Results should be unique (no duplicates)
    const slugs = results.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("should return empty results for non-existent terms", () => {
    const deduplicatedArticles = deduplicateSearchableArticles(mockArticles);
    const index = createDocumentIndex();

    for (const article of deduplicatedArticles) {
      index.add({
        slug: article.slug,
        title: article.title,
        description: article.description,
        content: article.content,
        tags: article.tags.join(" "),
      });
    }

    const results = performSearch(
      index,
      deduplicatedArticles,
      "nonexistent",
      10
    );
    expect(results).toHaveLength(0);
  });
});
