#!/usr/bin/env tsx

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { generateArticleCache } from '../app/lib/blog/mdx-processor.js';

async function buildBlog() {
  console.log('🔨 Building blog metadata cache...');

  try {
    // Ensure public directory exists
    if (!existsSync('public')) {
      await mkdir('public', { recursive: true });
    }

    // Generate article cache
    const cache = await generateArticleCache();

    // Write cache to public directory (excluding errors and stats from the JSON file)
    const cacheForPublic = {
      articles: cache.articles,
      generatedAt: cache.generatedAt,
    };

    await writeFile('public/blog-metadata.json', JSON.stringify(cacheForPublic, null, 2));

    console.log(`✅ Generated metadata for ${cache.articles.length} articles`);
    console.log(`📊 Processing stats: ${cache.stats.processed}/${cache.stats.total} successful, ${cache.stats.failed} failed`);

    if (cache.errors.length > 0) {
      console.log(`⚠️  ${cache.errors.length} errors encountered:`);
      cache.errors.forEach(error => console.log(`   - ${error}`));
    }

    console.log(`📝 Cache written to public/blog-metadata.json`);

  } catch (error) {
    console.error('❌ Failed to build blog:', error);
    process.exit(1);
  }
}

buildBlog();