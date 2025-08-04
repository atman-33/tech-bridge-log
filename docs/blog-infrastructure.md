# Blog Infrastructure

This document explains the core blog infrastructure that has been set up for the tech blog platform.

## Overview

The blog infrastructure provides:
- MDX file discovery and processing
- Frontmatter validation and metadata extraction
- Build-time article caching
- Asset management (images, thumbnails)
- Reading time calculation

## Directory Structure

```
contents/blog/
├── article-slug/
│   ├── index.mdx          # Article content with frontmatter
│   ├── thumbnail.png      # Article thumbnail
│   └── other-assets.*     # Additional images/assets
└── ...

public/blog-assets/        # Generated during build
├── article-slug/
│   ├── thumbnail.png      # Copied from source
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
thumbnail: "./thumbnail.png"
---
```

### Content

The article content follows the frontmatter and is written in MDX format, supporting:
- Standard Markdown syntax
- React components (when implemented)
- Code blocks with syntax highlighting (when implemented)

## Build Process

### Manual Build

```bash
npm run blog:build
```

This command:
1. Discovers all articles in `contents/blog/`
2. Validates frontmatter for each article
3. Copies assets to `public/blog-assets/`
4. Generates `public/blog-metadata.json` cache

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
- Missing article files
- Asset copying failures
- MDX compilation errors

## Testing

Run tests with:

```bash
npm test app/lib/blog/
```

## Next Steps

This infrastructure is ready for:
1. Blog listing page implementation
2. Individual article page implementation
3. Search functionality integration
4. Tag filtering system
5. SEO meta tag generation