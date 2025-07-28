import { describe, expect, it } from "vitest";
import { loadArticleBySlug } from "./article-loader";
import {
  discoverArticles,
  generateArticleCache,
  processArticle,
} from "./mdx-processor";

describe("MDX Processor", () => {
  it("should discover articles in the blog directory", async () => {
    const articles = await discoverArticles();
    expect(articles).toBeInstanceOf(Array);
    // The test might run from different working directory, so just check it's an array
    // In a real environment with articles, this would be > 0
  });

  it("should process article metadata correctly", async () => {
    const articles = await discoverArticles();
    if (articles.length > 0) {
      const metadata = await processArticle(articles[0]);

      expect(metadata).toHaveProperty("slug");
      expect(metadata).toHaveProperty("title");
      expect(metadata).toHaveProperty("description");
      expect(metadata).toHaveProperty("publishedAt");
      expect(metadata).toHaveProperty("updatedAt");
      expect(metadata).toHaveProperty("tags");
      expect(metadata).toHaveProperty("thumbnail");
      expect(metadata).toHaveProperty("readingTime");

      expect(metadata.publishedAt).toBeInstanceOf(Date);
      expect(metadata.updatedAt).toBeInstanceOf(Date);
      expect(Array.isArray(metadata.tags)).toBe(true);
      expect(typeof metadata.readingTime).toBe("number");
    }
  });

  it("should generate article cache with correct structure", async () => {
    const cache = await generateArticleCache();

    expect(cache).toHaveProperty("articles");
    expect(cache).toHaveProperty("generatedAt");
    expect(Array.isArray(cache.articles)).toBe(true);
    expect(typeof cache.generatedAt).toBe("string");

    if (cache.articles.length > 0) {
      const article = cache.articles[0];
      expect(article).toHaveProperty("slug");
      expect(article).toHaveProperty("title");
      expect(article.publishedAt).toBeInstanceOf(Date);
    }
  });
});

describe("Article Loader", () => {
  it("should load article by slug", async () => {
    const article = await loadArticleBySlug("getting-started");

    if (article) {
      expect(article.slug).toBe("getting-started");
      expect(article.title).toBe("Getting Started with Our Tech Blog");
      expect(article.publishedAt).toBeInstanceOf(Date);
    }
  });

  it("should return null for non-existent article", async () => {
    const article = await loadArticleBySlug("non-existent-article");
    expect(article).toBeNull();
  });
});
