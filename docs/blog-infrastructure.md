# Blog Infrastructure

This document explains the core blog infrastructure that has been set up for the tech blog platform.

## Overview

The blog infrastructure provides:
- MDX file discovery and processing
- Frontmatter validation and metadata extraction
- Build-time article caching
- Asset management (images and other files)
- Emoji validation for article icons
- Reading time calculation

## Directory Structure

```
contents/blog/
├── article-slug/
│   ├── index.mdx          # Article content with frontmatter
│   └── other-assets.*     # Additional images/assets (optional)
└── ...

public/blog-assets/        # Generated during build (if assets exist)
├── article-slug/
│   └── other-assets.*     # Copied from source
└── ...

public/blog-metadata.json  # Generated article cache
```

## Article Format

Each article should be in a directory under `contents/blog/` with the following structure:

### Frontmatter (Required)

```yaml
---
title: "Article Title"
slug: "article-slug"
publishedAt: "2024-01-15T10:00:00Z"
updatedAt: "2024-01-15T10:00:00Z"
tags: ["tag1", "tag2", "tag3"]
description: "Brief description of the article"
emoji: "🚀"
---
```

#### Frontmatter Field Validation

- **title**: String, required, max 200 characters
- **slug**: String, required, must match directory name, max 100 characters
- **publishedAt**: ISO 8601 date string, required
- **updatedAt**: ISO 8601 date string, required
- **tags**: Array of strings, required, each tag max 50 characters
- **description**: String, required, max 500 characters
- **emoji**: String, required, must be a valid emoji character (max 10 characters)

### Content

The article content follows the frontmatter and is written in MDX format, supporting:
- Standard Markdown syntax with GitHub Flavored Markdown extensions
- React components integration
- Code blocks with syntax highlighting (using highlight.js)
- Link cards for URLs (automatic rich preview generation)
- HTML elements for advanced formatting
- Task lists and tables

## Build Process

### Manual Build

```bash
npm run blog:build
```

This command:
1. Discovers all articles in `contents/blog/`
2. Validates frontmatter for each article (including emoji validation)
3. Copies assets to `public/blog-assets/` (if any exist)
4. Generates `public/blog-metadata.json` cache with metadata including emojis

### Automatic Build

The blog build is integrated into the main build process:

```bash
npm run build  # Runs blog:build automatically
```

## API

### MDX Processor (`app/lib/blog/mdx-processor.ts`)

- `discoverArticles()` - Find all MDX files
- `processArticle(filePath)` - Process single article
- `generateArticleCache()` - Generate metadata cache
- `loadArticleContent(slug)` - Load and compile MDX content

### Article Loader (`app/lib/blog/article-loader.ts`)

- `loadArticleMetadata()` - Load all article metadata
- `loadArticleBySlug(slug)` - Load specific article metadata
- `loadArticlesByTag(tag)` - Filter articles by tag
- `getAllTags()` - Get all unique tags

## Error Handling

The system includes comprehensive error handling for:
- Missing required frontmatter fields
- Invalid frontmatter data types
- Invalid emoji characters (using Unicode emoji validation)
- Missing article files
- Asset copying failures
- MDX compilation errors
- Duplicate article slugs

## Testing

Run tests with:

```bash
npm test app/lib/blog/
```

## Current Implementation Status

This infrastructure is fully implemented and includes:
1. ✅ Blog listing page with emoji icons
2. ✅ Individual article page with full MDX rendering
3. ✅ Search functionality integration (FlexSearch)
4. ✅ Tag filtering system
5. ✅ SEO meta tag generation
6. ✅ Reading progress indicator
7. ✅ Table of contents generation
8. ✅ Related articles suggestions
9. ✅ Dark mode support
10. ✅ Mobile-responsive design

## Additional Features

### Search Integration
- Full-text search across article content, titles, and tags
- Real-time search results with highlighting
- Search index built during the blog build process

### Visual Design
- Emoji-based article icons for visual identification
- Consistent typography and spacing
- Syntax highlighting for code blocks
- Link cards for external URLs

### Performance Optimizations
- Build-time article processing and caching
- Optimized asset delivery
- Server-side rendering with React Router v7
- Edge deployment on Cloudflare Workers