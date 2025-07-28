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

    // Write cache to public directory
    await writeFile('public/blog-metadata.json', JSON.stringify(cache, null, 2));

    console.log(`✅ Generated metadata for ${cache.articles.length} articles`);
    console.log(`📝 Cache written to public/blog-metadata.json`);

  } catch (error) {
    console.error('❌ Failed to build blog:', error);
    process.exit(1);
  }
}

buildBlog();