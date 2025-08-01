import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import readingTime from "reading-time";
import { processArticleImages } from "./image-processor";

export interface ArticleMetadata {
  slug: string;
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  emoji: string;
  readingTime: number;
}

export interface Article extends ArticleMetadata {
  content?: string;
}

interface ArticleFrontmatter {
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  description: string;
  emoji: string;
}

/**
 * Validation schema for article frontmatter fields
 */
const FRONTMATTER_VALIDATION = {
  title: { type: "string", required: true, minLength: 1, maxLength: 200 },
  slug: {
    type: "string",
    required: true,
    pattern: /^[a-z0-9-]+$/,
    minLength: 1,
    maxLength: 100,
  },
  publishedAt: {
    type: "string",
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
  },
  updatedAt: {
    type: "string",
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
  },
  tags: { type: "array", required: true, minLength: 1, maxLength: 10 },
  description: {
    type: "string",
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  emoji: {
    type: "string",
    required: true,
    minLength: 1,
    maxLength: 10,
    pattern:
      /^[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u,
  },
} as const;

// Get the current file's directory and resolve project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "../../..");

const BLOG_CONTENT_DIR = join(PROJECT_ROOT, "contents/blog");
const _PUBLIC_ASSETS_DIR = join(PROJECT_ROOT, "public/blog-assets");

// Use import.meta.glob to load MDX files at build time (Vite + SSR compatible)
// This will be undefined in Node.js environment
const mdxModules =
  typeof import.meta.glob !== "undefined"
    ? import.meta.glob("/contents/blog/**/index.mdx", { as: "raw" })
    : {};

/**
 * Enhanced reading time calculation with customizable options
 */
function calculateReadingTime(content: string): {
  minutes: number;
  words: number;
  text: string;
} {
  const stats = readingTime(content, {
    wordsPerMinute: 200, // Average reading speed
  });

  return {
    minutes: Math.ceil(stats.minutes), // Always round up to ensure realistic estimates
    words: stats.words,
    text: stats.text,
  };
}

/**
 * Validates that an ArticleMetadata object has all required properties with correct types
 */
export function validateArticleMetadata(
  metadata: unknown,
  source: string,
): ArticleMetadata {
  if (typeof metadata !== "object" || metadata === null) {
    throw new Error(`Invalid article metadata in ${source}. Expected object.`);
  }

  const meta = metadata as Record<string, unknown>;
  const required = [
    "slug",
    "title",
    "description",
    "publishedAt",
    "updatedAt",
    "tags",
    "emoji",
    "readingTime",
  ];

  for (const field of required) {
    if (!(field in meta)) {
      throw new Error(
        `Missing required field "${field}" in article metadata from ${source}`,
      );
    }
  }

  // Type validations
  if (typeof meta.slug !== "string") {
    throw new Error(`Invalid slug type in ${source}. Expected string.`);
  }

  if (typeof meta.title !== "string") {
    throw new Error(`Invalid title type in ${source}. Expected string.`);
  }

  if (typeof meta.description !== "string") {
    throw new Error(`Invalid description type in ${source}. Expected string.`);
  }

  if (!(meta.publishedAt instanceof Date)) {
    throw new Error(
      `Invalid publishedAt type in ${source}. Expected Date object.`,
    );
  }

  if (!(meta.updatedAt instanceof Date)) {
    throw new Error(
      `Invalid updatedAt type in ${source}. Expected Date object.`,
    );
  }

  if (!Array.isArray(meta.tags)) {
    throw new Error(`Invalid tags type in ${source}. Expected array.`);
  }

  if (typeof meta.emoji !== "string") {
    throw new Error(`Invalid emoji type in ${source}. Expected string.`);
  }

  if (typeof meta.readingTime !== "number") {
    throw new Error(`Invalid readingTime type in ${source}. Expected number.`);
  }

  return meta as unknown as ArticleMetadata;
}

/**
 * Sanitizes and normalizes article metadata
 */
export function sanitizeArticleMetadata(
  metadata: ArticleMetadata,
): ArticleMetadata {
  return {
    ...metadata,
    title: metadata.title.trim(),
    description: metadata.description.trim(),
    slug: metadata.slug.toLowerCase().trim(),
    tags: metadata.tags
      .map((tag) => tag.toLowerCase().trim())
      .filter((tag) => tag.length > 0),
    emoji: metadata.emoji.trim(),
  };
}

/**
 * Checks if an article should be published (not in the future)
 */
export function isArticlePublished(metadata: ArticleMetadata): boolean {
  return metadata.publishedAt <= new Date();
}

/**
 * Gets articles that are ready to be published
 */
export function getPublishedArticles(
  articles: ArticleMetadata[],
): ArticleMetadata[] {
  return articles.filter(isArticlePublished);
}

/**
 * Validates a single frontmatter field according to its validation rules
 */
function validateField(
  fieldName: keyof typeof FRONTMATTER_VALIDATION,
  value: unknown,
  filePath: string,
): void {
  const rules = FRONTMATTER_VALIDATION[fieldName];

  // Check if field is required and missing
  if (
    rules.required &&
    (value === undefined || value === null || value === "")
  ) {
    throw new Error(
      `Missing required frontmatter field "${fieldName}" in ${filePath}`,
    );
  }

  // Skip further validation if field is not required and missing
  if (!rules.required && (value === undefined || value === null)) {
    return;
  }

  // Type validation
  if (rules.type === "string" && typeof value !== "string") {
    throw new Error(
      `Invalid ${fieldName} type in ${filePath}. Expected string, got ${typeof value}.`,
    );
  }

  if (rules.type === "array" && !Array.isArray(value)) {
    throw new Error(
      `Invalid ${fieldName} type in ${filePath}. Expected array, got ${typeof value}.`,
    );
  }

  // String-specific validations
  if (rules.type === "string" && typeof value === "string") {
    if ("minLength" in rules && value.length < rules.minLength) {
      throw new Error(
        `${fieldName} in ${filePath} must be at least ${rules.minLength} characters long.`,
      );
    }

    if ("maxLength" in rules && value.length > rules.maxLength) {
      throw new Error(
        `${fieldName} in ${filePath} must be no more than ${rules.maxLength} characters long.`,
      );
    }

    if ("pattern" in rules && !rules.pattern.test(value)) {
      throw new Error(`${fieldName} in ${filePath} has invalid format.`);
    }
  }

  // Array-specific validations
  if (rules.type === "array" && Array.isArray(value)) {
    if ("minLength" in rules && value.length < rules.minLength) {
      throw new Error(
        `${fieldName} in ${filePath} must have at least ${rules.minLength} items.`,
      );
    }

    if ("maxLength" in rules && value.length > rules.maxLength) {
      throw new Error(
        `${fieldName} in ${filePath} must have no more than ${rules.maxLength} items.`,
      );
    }

    // Validate that all array items are strings for tags
    if (fieldName === "tags") {
      for (const tag of value) {
        if (typeof tag !== "string") {
          throw new Error(
            `All tags in ${filePath} must be strings. Found ${typeof tag}.`,
          );
        }
        if (tag.length === 0) {
          throw new Error(
            `Empty tag found in ${filePath}. All tags must be non-empty strings.`,
          );
        }
      }
    }
  }
}

/**
 * Validates article frontmatter to ensure all required fields are present and properly formatted
 */
function validateFrontmatter(
  frontmatter: unknown,
  filePath: string,
): ArticleFrontmatter {
  // First assert frontmatter is an object
  if (typeof frontmatter !== "object" || frontmatter === null) {
    throw new Error(`Invalid frontmatter in ${filePath}. Expected object.`);
  }

  const fm = frontmatter as Record<string, unknown>;

  // Validate each field according to its rules
  for (const fieldName of Object.keys(FRONTMATTER_VALIDATION) as Array<
    keyof typeof FRONTMATTER_VALIDATION
  >) {
    validateField(fieldName, fm[fieldName], filePath);
  }

  // Additional cross-field validations
  const publishedAt = new Date(fm.publishedAt as string);
  const updatedAt = new Date(fm.updatedAt as string);

  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error(
      `Invalid publishedAt date format in ${filePath}. Expected ISO 8601 format.`,
    );
  }

  if (Number.isNaN(updatedAt.getTime())) {
    throw new Error(
      `Invalid updatedAt date format in ${filePath}. Expected ISO 8601 format.`,
    );
  }

  if (updatedAt < publishedAt) {
    throw new Error(
      `updatedAt cannot be earlier than publishedAt in ${filePath}.`,
    );
  }

  // Check for duplicate tags
  const tags = fm.tags as string[];
  const uniqueTags = new Set(tags);
  if (uniqueTags.size !== tags.length) {
    throw new Error(
      `Duplicate tags found in ${filePath}. All tags must be unique.`,
    );
  }

  // After validation, we can safely cast to ArticleFrontmatter
  return {
    title: fm.title as string,
    slug: fm.slug as string,
    publishedAt: fm.publishedAt as string,
    updatedAt: fm.updatedAt as string,
    tags: fm.tags as string[],
    description: fm.description as string,
    emoji: fm.emoji as string,
  };
}

/**
 * Discovers all MDX files in the blog content directory
 */
export async function discoverArticles(): Promise<string[]> {
  // In Vite environment, use import.meta.glob
  if (Object.keys(mdxModules).length > 0) {
    const moduleKeys = Object.keys(mdxModules);
    console.log("discoverArticles - found modules:", moduleKeys);
    return moduleKeys;
  }

  // In Node.js environment, use file system
  if (!existsSync(BLOG_CONTENT_DIR)) {
    console.log(
      "discoverArticles - blog content directory does not exist:",
      BLOG_CONTENT_DIR,
    );
    return [];
  }

  const articles: string[] = [];
  const entries = await readdir(BLOG_CONTENT_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const indexPath = join(BLOG_CONTENT_DIR, entry.name, "index.mdx");
      if (existsSync(indexPath)) {
        // Convert to the format expected by import.meta.glob
        articles.push(`/contents/blog/${entry.name}/index.mdx`);
      }
    }
  }

  console.log("discoverArticles - found articles:", articles);
  return articles;
}

/**
 * Processes a single MDX file and extracts metadata
 */
export async function processArticle(
  filePath: string,
): Promise<ArticleMetadata> {
  let content: string;

  // Load content using import.meta.glob in Vite environment
  const moduleLoader = mdxModules[filePath];
  if (moduleLoader) {
    content = await moduleLoader();
  } else {
    // In Node.js environment, read from file system
    const absolutePath = join(PROJECT_ROOT, filePath.replace(/^\//, ""));
    if (!existsSync(absolutePath)) {
      throw new Error(`Article not found: ${absolutePath}`);
    }
    content = await readFile(absolutePath, "utf-8");
  }
  const { data: frontmatter, content: mdxContent } = matter(content);

  // Validate frontmatter
  const validatedFrontmatter = validateFrontmatter(frontmatter, filePath);

  // Calculate reading time with enhanced options
  const readingStats = calculateReadingTime(mdxContent);

  // Get article directory and slug from the file path
  // filePath is like "/contents/blog/getting-started/index.mdx"
  const slug = validatedFrontmatter.slug;
  const articleDir = join(PROJECT_ROOT, "contents/blog", slug);

  // Process article images (for content images, not thumbnails)
  const imageResult = await processArticleImages(articleDir, slug);

  // Log any image processing errors
  if (imageResult.errors.length > 0) {
    console.warn(`Image processing warnings for ${slug}:`, imageResult.errors);
  }

  const metadata: ArticleMetadata = {
    slug,
    title: validatedFrontmatter.title,
    description: validatedFrontmatter.description,
    publishedAt: new Date(validatedFrontmatter.publishedAt),
    updatedAt: new Date(validatedFrontmatter.updatedAt),
    tags: validatedFrontmatter.tags,
    emoji: validatedFrontmatter.emoji,
    readingTime: readingStats.minutes,
  };

  // Sanitize and normalize the metadata
  return sanitizeArticleMetadata(metadata);
}

/**
 * Loads raw MDX content for a specific article (without compilation)
 */
export async function loadArticleContent(slug: string): Promise<string | null> {
  const pattern = `/contents/blog/${slug}/index.mdx`;

  // In Vite environment, use import.meta.glob
  const moduleLoader = mdxModules[pattern];
  if (moduleLoader) {
    try {
      const rawContent = await moduleLoader();
      const { content: mdxContent } = matter(rawContent);
      return mdxContent;
    } catch (error) {
      console.error("loadArticleContent - error loading module:", error);
      return null;
    }
  }

  // In Node.js environment, read from file system
  try {
    const absolutePath = join(PROJECT_ROOT, `contents/blog/${slug}/index.mdx`);
    if (!existsSync(absolutePath)) {
      console.log("loadArticleContent - file not found:", absolutePath);
      return null;
    }

    const rawContent = await readFile(absolutePath, "utf-8");
    const { content: mdxContent } = matter(rawContent);
    return mdxContent;
  } catch (error) {
    console.error("loadArticleContent - error reading file:", error);
    return null;
  }
}

/**
 * Processes all articles and generates metadata cache with comprehensive validation
 */
export async function generateArticleCache(): Promise<{
  articles: ArticleMetadata[];
  generatedAt: string;
  errors: string[];
  stats: {
    total: number;
    processed: number;
    failed: number;
  };
}> {
  const articlePaths = await discoverArticles();
  const articles: ArticleMetadata[] = [];
  const errors: string[] = [];
  const slugs = new Set<string>();

  console.log(`Discovered ${articlePaths.length} articles to process`);

  for (const path of articlePaths) {
    try {
      const metadata = await processArticle(path);

      // Check for duplicate slugs across all articles
      if (slugs.has(metadata.slug)) {
        const error = `Duplicate slug "${metadata.slug}" found in ${path}. Slugs must be unique across all articles.`;
        errors.push(error);
        console.error(error);
        continue;
      }

      slugs.add(metadata.slug);
      articles.push(metadata);
      console.log(`✓ Processed article: ${metadata.slug}`);
    } catch (error) {
      const errorMessage = `Failed to process article ${path}: ${error instanceof Error ? error.message : String(error)}`;
      errors.push(errorMessage);
      console.error(errorMessage);
    }
  }

  // Sort articles by publication date (newest first)
  articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  const stats = {
    total: articlePaths.length,
    processed: articles.length,
    failed: articlePaths.length - articles.length,
  };

  console.log(
    `Article processing complete: ${stats.processed}/${stats.total} successful, ${stats.failed} failed`,
  );

  if (errors.length > 0) {
    console.warn(`${errors.length} errors encountered during processing:`);
    errors.forEach((error) => console.warn(`  - ${error}`));
  }

  return {
    articles,
    generatedAt: new Date().toISOString(),
    errors,
    stats,
  };
}
