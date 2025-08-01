#!/usr/bin/env tsx

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { generateArticleCache, loadArticleContent } from '../app/lib/blog/mdx-processor.js';
import { stripMarkdown, type SearchIndex } from '../app/lib/blog/search-index.js';

interface TagConfig {
  label: string;
  icon: string;
  description?: string;
}

interface TagsConfig {
  [key: string]: TagConfig;
}

export interface Tag {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

/**
 * Validates a tag configuration object
 */
function validateTagConfig(tagId: string, config: unknown): void {
  if (typeof config !== 'object' || config === null) {
    throw new Error(`Invalid tag configuration for "${tagId}". Expected object.`);
  }

  const tagConfig = config as Record<string, unknown>;

  // Validate required fields
  if (typeof tagConfig.label !== 'string' || tagConfig.label.trim().length === 0) {
    throw new Error(`Invalid or missing label for tag "${tagId}". Expected non-empty string.`);
  }

  if (typeof tagConfig.icon !== 'string' || tagConfig.icon.trim().length === 0) {
    throw new Error(`Invalid or missing icon for tag "${tagId}". Expected non-empty string.`);
  }

  // Validate optional fields
  if (tagConfig.description !== undefined && typeof tagConfig.description !== 'string') {
    throw new Error(`Invalid description for tag "${tagId}". Expected string or undefined.`);
  }

  // Validate tag ID format (should be kebab-case)
  if (!/^[a-z0-9-]+$/.test(tagId)) {
    throw new Error(`Invalid tag ID "${tagId}". Must be lowercase letters, numbers, and hyphens only.`);
  }
}

/**
 * Loads and validates the tags configuration from tags.json
 */
async function loadAndProcessTags(): Promise<Tag[]> {
  try {
    const configContent = await readFile('contents/tags.json', 'utf-8');
    const config: TagsConfig = JSON.parse(configContent);

    if (typeof config !== 'object' || config === null) {
      throw new Error('Invalid tags.json format. Expected object.');
    }

    const tags: Tag[] = [];

    for (const [tagId, tagConfig] of Object.entries(config)) {
      validateTagConfig(tagId, tagConfig);

      tags.push({
        id: tagId,
        label: tagConfig.label.trim(),
        icon: tagConfig.icon.trim(),
        description: tagConfig.description?.trim(),
      });
    }

    // Sort tags alphabetically by label
    tags.sort((a, b) => a.label.localeCompare(b.label));

    return tags;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load tags configuration: ${error.message}`);
    }
    throw new Error('Failed to load tags configuration: Unknown error');
  }
}

async function buildBlog() {
  console.log('🔨 Building blog metadata cache...');

  try {
    // Ensure public directory exists
    if (!existsSync('public')) {
      await mkdir('public', { recursive: true });
    }

    // Generate article cache and tags
    const [cache, tags] = await Promise.all([
      generateArticleCache(),
      loadAndProcessTags()
    ]);

    // Generate search index
    console.log('🔍 Building search index...');
    const searchIndex: SearchIndex = {
      articles: [],
      generatedAt: new Date().toISOString(),
    };

    for (const article of cache.articles) {
      try {
        const content = await loadArticleContent(article.slug);
        if (content) {
          searchIndex.articles.push({
            slug: article.slug,
            title: article.title,
            description: article.description,
            content: stripMarkdown(content),
            tags: article.tags,
          });
        }
      } catch (error) {
        console.warn(`⚠️  Failed to load content for search index: ${article.slug}`, error);
      }
    }

    // Validate that all article tags exist in the tags configuration
    const validTagIds = new Set(tags.map(tag => tag.id));
    const invalidTags = new Set<string>();

    for (const article of cache.articles) {
      for (const tag of article.tags) {
        if (!validTagIds.has(tag)) {
          invalidTags.add(tag);
        }
      }
    }

    if (invalidTags.size > 0) {
      console.warn(`⚠️  Found ${invalidTags.size} invalid tags in articles: ${Array.from(invalidTags).join(', ')}`);
      console.warn('   Please add these tags to contents/tags.json or remove them from articles.');
    }

    // Write article cache to public directory (excluding errors and stats from the JSON file)
    const cacheForPublic = {
      articles: cache.articles,
      generatedAt: cache.generatedAt,
    };

    await writeFile('public/blog-metadata.json', JSON.stringify(cacheForPublic, null, 2));

    // Write tags metadata to public directory
    const tagsMetadata = {
      tags,
      generatedAt: new Date().toISOString(),
    };

    await writeFile('public/tags-metadata.json', JSON.stringify(tagsMetadata, null, 2));

    // Write search index to public directory
    await writeFile('public/search-index.json', JSON.stringify(searchIndex, null, 2));

    console.log(`✅ Generated metadata for ${cache.articles.length} articles`);
    console.log(`✅ Generated metadata for ${tags.length} tags`);
    console.log(`✅ Generated search index for ${searchIndex.articles.length} articles`);
    console.log(`📊 Processing stats: ${cache.stats.processed}/${cache.stats.total} successful, ${cache.stats.failed} failed`);

    if (cache.errors.length > 0) {
      console.log(`⚠️  ${cache.errors.length} errors encountered:`);
      cache.errors.forEach(error => console.log(`   - ${error}`));
    }

    console.log(`📝 Cache written to public/blog-metadata.json`);
    console.log(`📝 Tags written to public/tags-metadata.json`);
    console.log(`📝 Search index written to public/search-index.json`);

  } catch (error) {
    console.error('❌ Failed to build blog:', error);
    process.exit(1);
  }
}

buildBlog();