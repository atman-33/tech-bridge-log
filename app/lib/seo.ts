import type { MetaDescriptor } from "react-router";
import { siteConfig } from "~/config/site-config";
import type { ArticleMetadata } from "./blog/mdx-processor";

export interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  author?: string;
  siteName?: string;
}

/**
 * Generates comprehensive meta tags for SEO and social media sharing
 */
export function generateMetaTags(config: SEOConfig, request?: Request): MetaDescriptor[] {
  const {
    title,
    description = siteConfig.description,
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    tags,
    author = siteConfig.author,
    siteName = siteConfig.name,
  } = config;

  // Build full title with site name
  const fullTitle = title ? `${title} - ${siteName}` : siteName;

  // Resolve absolute URLs - use configured app URL as fallback
  const baseUrl = siteConfig.appUrl;
  const absoluteUrl = url ? `${baseUrl}${url}` : baseUrl;
  const absoluteImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}${siteConfig.ogpImage}`;

  const metaTags: MetaDescriptor[] = [
    // Basic meta tags
    { title: fullTitle },
    { name: "description", content: description },
    { name: "author", content: author },

    // Open Graph tags
    { property: "og:title", content: title || siteName },
    { property: "og:description", content: description },
    { property: "og:image", content: absoluteImage },
    { property: "og:url", content: absoluteUrl },
    { property: "og:type", content: type },
    { property: "og:site_name", content: siteName },

    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title || siteName },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: absoluteImage },
    { name: "twitter:creator", content: author },

    // Additional SEO tags
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];

  // Add article-specific meta tags
  if (type === "article") {
    if (publishedTime) {
      metaTags.push({ property: "article:published_time", content: publishedTime });
    }
    if (modifiedTime) {
      metaTags.push({ property: "article:modified_time", content: modifiedTime });
    }
    if (author) {
      metaTags.push({ property: "article:author", content: author });
    }
    if (tags && tags.length > 0) {
      // Add each tag as a separate meta tag (OGP standard)
      tags.forEach(tag => {
        metaTags.push({ property: "article:tag", content: tag });
      });

      // Also add as keywords for SEO
      metaTags.push({ name: "keywords", content: tags.join(", ") });
    }
  }

  return metaTags;
}

/**
 * Generates meta tags specifically for blog articles
 */
export function generateArticleMetaTags(article: ArticleMetadata, request?: Request): MetaDescriptor[] {
  return generateMetaTags({
    title: article.title,
    description: article.description,
    image: article.thumbnail,
    url: `/blog/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    tags: article.tags,
  }, request);
}

/**
 * Generates meta tags for the blog listing page
 */
export function generateBlogListingMetaTags(request?: Request): MetaDescriptor[] {
  return generateMetaTags({
    title: "Blog",
    description: "Technical articles and insights on modern web development, React, TypeScript, and more.",
    url: "/blog",
    type: "website",
  }, request);
}

/**
 * Generates meta tags for tag-filtered blog pages
 */
export function generateTagPageMetaTags(tag: string, articleCount: number, request?: Request): MetaDescriptor[] {
  return generateMetaTags({
    title: `Articles tagged "${tag}"`,
    description: `Browse ${articleCount} articles about ${tag}. Technical insights and tutorials on ${tag} and related technologies.`,
    url: `/blog/tag/${tag}`,
    type: "website",
  }, request);
}

/**
 * Generates structured data for articles (JSON-LD)
 */
export function generateArticleStructuredData(article: ArticleMetadata, request?: Request): string {
  const baseUrl = siteConfig.appUrl;
  const absoluteUrl = `${baseUrl}/blog/${article.slug}`;
  const absoluteImage = article.thumbnail.startsWith('http')
    ? article.thumbnail
    : `${baseUrl}${article.thumbnail}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": absoluteImage,
    "url": absoluteUrl,
    "datePublished": article.publishedAt.toISOString(),
    "dateModified": article.updatedAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": siteConfig.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}${siteConfig.ogpImage}`,
      },
    },
    "keywords": article.tags.join(", "),
    "articleSection": "Technology",
    "wordCount": Math.round(article.readingTime * 200), // Approximate word count
    "timeRequired": `PT${article.readingTime}M`, // ISO 8601 duration format
  };

  return JSON.stringify(structuredData);
}