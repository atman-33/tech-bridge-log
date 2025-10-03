import { describe, expect, it } from "vitest";
import type { ArticleMetadata } from "./mdx-processor";
import { findRelatedArticles } from "./related-articles";

// Mock article data for testing
const mockArticles: ArticleMetadata[] = [
  {
    slug: "react-hooks-guide",
    title: "React Hooks Guide",
    description: "Learn React hooks",
    publishedAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    tags: ["react", "hooks", "frontend"],
    emoji: "⚛️",
    readingTime: 5,
  },
  {
    slug: "typescript-basics",
    title: "TypeScript Basics",
    description: "Learn TypeScript fundamentals",
    publishedAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    tags: ["typescript", "basics", "programming"],
    emoji: "📘",
    readingTime: 4,
  },
  {
    slug: "react-typescript-combo",
    title: "React with TypeScript",
    description: "Combining React and TypeScript",
    publishedAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    tags: ["react", "typescript", "frontend"],
    emoji: "🔥",
    readingTime: 6,
  },
  {
    slug: "vue-basics",
    title: "Vue.js Basics",
    description: "Learn Vue.js fundamentals",
    publishedAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    tags: ["vue", "frontend", "javascript"],
    emoji: "💚",
    readingTime: 4,
  },
  {
    slug: "future-article",
    title: "Future Article",
    description: "This article is not published yet",
    publishedAt: new Date("2026-01-01"), // Future date
    updatedAt: new Date("2026-01-01"),
    tags: ["react", "future"],
    emoji: "🔮",
    readingTime: 3,
  },
];

describe("findRelatedArticles", () => {
  it("should find articles with shared tags", () => {
    const currentArticle = mockArticles[0]; // react-hooks-guide with tags: ['react', 'hooks', 'frontend']
    const related = findRelatedArticles(currentArticle, mockArticles, 3);

    // Should find react-typescript-combo (shares 'react', 'frontend') and vue-basics (shares 'frontend')
    expect(related.length).toBeGreaterThan(0);
    expect(
      related.some((article) => article.slug === "react-typescript-combo")
    ).toBe(true);
    expect(related.some((article) => article.slug === "vue-basics")).toBe(true);
  });

  it("should exclude the current article from results", () => {
    const currentArticle = mockArticles[0]; // react-hooks-guide
    const related = findRelatedArticles(currentArticle, mockArticles, 3);

    expect(
      related.every((article) => article.slug !== currentArticle.slug)
    ).toBe(true);
  });

  it("should exclude unpublished articles", () => {
    const currentArticle = mockArticles[0]; // react-hooks-guide
    const related = findRelatedArticles(currentArticle, mockArticles, 5); // Increase limit to ensure we get all possible results

    // All returned articles should be published
    expect(related.every((article) => article.publishedAt <= new Date())).toBe(
      true
    );

    // The future article should not be included even though it shares the 'react' tag
    expect(related.some((article) => article.slug === "future-article")).toBe(
      false
    );
  });

  it("should return empty array when no related articles exist", () => {
    const isolatedArticle: ArticleMetadata = {
      slug: "isolated-article",
      title: "Isolated Article",
      description: "No shared tags",
      publishedAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      tags: ["unique-tag", "isolated"],
      emoji: "🏝️",
      readingTime: 3,
    };

    const related = findRelatedArticles(isolatedArticle, mockArticles, 3);
    expect(related).toEqual([]);
  });

  it("should respect maxResults parameter", () => {
    const currentArticle = mockArticles[0]; // react-hooks-guide
    const related = findRelatedArticles(currentArticle, mockArticles, 1);

    expect(related.length).toBeLessThanOrEqual(1);
  });

  it("should prioritize articles with more shared tags", () => {
    const currentArticle = mockArticles[0]; // react-hooks-guide with tags: ['react', 'hooks', 'frontend']
    const related = findRelatedArticles(currentArticle, mockArticles, 3);

    // react-typescript-combo shares 2 tags ('react', 'frontend')
    // vue-basics shares 1 tag ('frontend')
    // So react-typescript-combo should come first
    const reactTypescriptIndex = related.findIndex(
      (article) => article.slug === "react-typescript-combo"
    );
    const vueBasicsIndex = related.findIndex(
      (article) => article.slug === "vue-basics"
    );

    if (reactTypescriptIndex !== -1 && vueBasicsIndex !== -1) {
      expect(reactTypescriptIndex).toBeLessThan(vueBasicsIndex);
    }
  });

  it("should handle empty articles array", () => {
    const currentArticle = mockArticles[0];
    const related = findRelatedArticles(currentArticle, [], 3);

    expect(related).toEqual([]);
  });

  it("should handle articles with no tags", () => {
    const articleWithNoTags: ArticleMetadata = {
      slug: "no-tags-article",
      title: "Article with No Tags",
      description: "This article has no tags",
      publishedAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      tags: [],
      emoji: "🏷️",
      readingTime: 2,
    };

    const related = findRelatedArticles(articleWithNoTags, mockArticles, 3);
    expect(related).toEqual([]);
  });
});
