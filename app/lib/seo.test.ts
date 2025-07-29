import { describe, it, expect } from 'vitest';
import { generateMetaTags, generateArticleMetaTags, generateArticleStructuredData } from './seo';
import type { ArticleMetadata } from './blog/mdx-processor';

describe('SEO utilities', () => {
  const mockArticle: ArticleMetadata = {
    slug: 'test-article',
    title: 'Test Article Title',
    description: 'This is a test article description for SEO testing.',
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    tags: ['react', 'typescript', 'testing'],
    thumbnail: '/blog-assets/test-article/thumbnail.png',
    readingTime: 5,
  };

  describe('generateMetaTags', () => {
    it('should generate basic meta tags', () => {
      const metaTags = generateMetaTags({
        title: 'Test Page',
        description: 'Test description',
      });

      expect(metaTags).toContainEqual({ title: 'Test Page - Tech Blog' });
      expect(metaTags).toContainEqual({ name: 'description', content: 'Test description' });
      expect(metaTags).toContainEqual({ property: 'og:title', content: 'Test Page' });
      expect(metaTags).toContainEqual({ property: 'og:description', content: 'Test description' });
      expect(metaTags).toContainEqual({ property: 'og:type', content: 'website' });
    });

    it('should generate article-specific meta tags', () => {
      const metaTags = generateMetaTags({
        title: 'Test Article',
        description: 'Test article description',
        type: 'article',
        publishedTime: '2024-01-15T10:00:00Z',
        modifiedTime: '2024-01-16T14:30:00Z',
        tags: ['react', 'typescript'],
      });

      expect(metaTags).toContainEqual({ property: 'og:type', content: 'article' });
      expect(metaTags).toContainEqual({ property: 'article:published_time', content: '2024-01-15T10:00:00Z' });
      expect(metaTags).toContainEqual({ property: 'article:modified_time', content: '2024-01-16T14:30:00Z' });
      expect(metaTags).toContainEqual({ property: 'article:tag', content: 'react' });
      expect(metaTags).toContainEqual({ property: 'article:tag', content: 'typescript' });
      expect(metaTags).toContainEqual({ name: 'keywords', content: 'react, typescript' });
    });

    it('should include Twitter Card meta tags', () => {
      const metaTags = generateMetaTags({
        title: 'Test Page',
        description: 'Test description',
      });

      expect(metaTags).toContainEqual({ name: 'twitter:card', content: 'summary_large_image' });
      expect(metaTags).toContainEqual({ name: 'twitter:title', content: 'Test Page' });
      expect(metaTags).toContainEqual({ name: 'twitter:description', content: 'Test description' });
    });

    it('should handle absolute image URLs', () => {
      const metaTags = generateMetaTags({
        title: 'Test Page',
        image: 'https://example.com/image.png',
      });

      const ogImageTag = metaTags.find(tag => tag.property === 'og:image');
      expect(ogImageTag?.content).toBe('https://example.com/image.png');
    });

    it('should convert relative image URLs to absolute', () => {
      const metaTags = generateMetaTags({
        title: 'Test Page',
        image: '/test-image.png',
      });

      const ogImageTag = metaTags.find(tag => tag.property === 'og:image');
      expect(ogImageTag?.content).toBe('https://your-app.pages.dev/test-image.png');
    });
  });

  describe('generateArticleMetaTags', () => {
    it('should generate comprehensive article meta tags', () => {
      const metaTags = generateArticleMetaTags(mockArticle);

      expect(metaTags).toContainEqual({ title: 'Test Article Title - Tech Blog' });
      expect(metaTags).toContainEqual({ name: 'description', content: mockArticle.description });
      expect(metaTags).toContainEqual({ property: 'og:type', content: 'article' });
      expect(metaTags).toContainEqual({ property: 'og:url', content: 'https://your-app.pages.dev/blog/test-article' });
      expect(metaTags).toContainEqual({ property: 'article:published_time', content: '2024-01-15T10:00:00.000Z' });
      expect(metaTags).toContainEqual({ property: 'article:modified_time', content: '2024-01-16T14:30:00.000Z' });
      expect(metaTags).toContainEqual({ property: 'article:tag', content: 'react' });
      expect(metaTags).toContainEqual({ property: 'article:tag', content: 'typescript' });
      expect(metaTags).toContainEqual({ property: 'article:tag', content: 'testing' });
    });
  });

  describe('generateArticleStructuredData', () => {
    it('should generate valid JSON-LD structured data', () => {
      const structuredDataJson = generateArticleStructuredData(mockArticle);
      const structuredData = JSON.parse(structuredDataJson);

      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('Article');
      expect(structuredData.headline).toBe(mockArticle.title);
      expect(structuredData.description).toBe(mockArticle.description);
      expect(structuredData.url).toBe('https://your-app.pages.dev/blog/test-article');
      expect(structuredData.datePublished).toBe('2024-01-15T10:00:00.000Z');
      expect(structuredData.dateModified).toBe('2024-01-16T14:30:00.000Z');
      expect(structuredData.keywords).toBe('react, typescript, testing');
      expect(structuredData.author.name).toBe('Your Name');
      expect(structuredData.publisher.name).toBe('Tech Blog');
    });

    it('should include reading time and word count estimates', () => {
      const structuredDataJson = generateArticleStructuredData(mockArticle);
      const structuredData = JSON.parse(structuredDataJson);

      expect(structuredData.timeRequired).toBe('PT5M'); // 5 minutes in ISO 8601 format
      expect(structuredData.wordCount).toBe(1000); // 5 minutes * 200 words per minute
    });
  });
});