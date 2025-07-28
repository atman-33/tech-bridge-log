import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, readFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface ArticleMetadata {
  slug: string;
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  thumbnail: string;
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
  thumbnail: string;
}

const BLOG_CONTENT_DIR = "contents/blog";
const PUBLIC_ASSETS_DIR = "public/blog-assets";

/**
 * Validates article frontmatter to ensure all required fields are present
 */
function validateFrontmatter(
  frontmatter: unknown,
  filePath: string,
): ArticleFrontmatter {
  const required = [
    "title",
    "slug",
    "publishedAt",
    "updatedAt",
    "tags",
    "description",
    "thumbnail",
  ];

  // First assert frontmatter is an object
  if (typeof frontmatter !== "object" || frontmatter === null) {
    throw new Error(`Invalid frontmatter in ${filePath}. Expected object.`);
  }

  const fm = frontmatter as Record<string, unknown>;

  for (const field of required) {
    if (!fm[field]) {
      throw new Error(
        `Missing required frontmatter field "${field}" in ${filePath}`,
      );
    }
  }

  // Validate data types
  if (typeof fm.title !== "string") {
    throw new Error(`Invalid title type in ${filePath}. Expected string.`);
  }

  if (typeof fm.slug !== "string") {
    throw new Error(`Invalid slug type in ${filePath}. Expected string.`);
  }

  if (!Array.isArray(fm.tags)) {
    throw new Error(`Invalid tags type in ${filePath}. Expected array.`);
  }

  // After validation, we can safely cast to ArticleFrontmatter
  return {
    title: fm.title as string,
    slug: fm.slug as string,
    publishedAt: fm.publishedAt as string,
    updatedAt: fm.updatedAt as string,
    tags: fm.tags as string[],
    description: fm.description as string,
    thumbnail: fm.thumbnail as string,
  };
}

/**
 * Discovers all MDX files in the blog content directory
 */
export async function discoverArticles(): Promise<string[]> {
  if (!existsSync(BLOG_CONTENT_DIR)) {
    return [];
  }

  const articles: string[] = [];
  const entries = await readdir(BLOG_CONTENT_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const articleDir = join(BLOG_CONTENT_DIR, entry.name);
      const indexPath = join(articleDir, "index.mdx");

      if (existsSync(indexPath)) {
        articles.push(indexPath);
      }
    }
  }

  return articles;
}

/**
 * Copies images from article directory to public assets directory
 */
async function copyArticleAssets(
  articleDir: string,
  slug: string,
): Promise<void> {
  const publicDir = join(PUBLIC_ASSETS_DIR, slug);

  // Ensure public directory exists
  if (!existsSync(dirname(publicDir))) {
    await mkdir(dirname(publicDir), { recursive: true });
  }
  if (!existsSync(publicDir)) {
    await mkdir(publicDir, { recursive: true });
  }

  const entries = await readdir(articleDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name !== "index.mdx") {
      const ext = extname(entry.name).toLowerCase();
      const imageExtensions = [
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".svg",
        ".webp",
      ];

      if (imageExtensions.includes(ext)) {
        const sourcePath = join(articleDir, entry.name);
        const destPath = join(publicDir, entry.name);

        try {
          await copyFile(sourcePath, destPath);
        } catch (error) {
          console.warn(
            `Failed to copy asset ${sourcePath} to ${destPath}:`,
            error,
          );
        }
      }
    }
  }
}

/**
 * Processes a single MDX file and extracts metadata
 */
export async function processArticle(
  filePath: string,
): Promise<ArticleMetadata> {
  const content = await readFile(filePath, "utf-8");
  const { data: frontmatter, content: mdxContent } = matter(content);

  // Validate frontmatter
  const validatedFrontmatter = validateFrontmatter(frontmatter, filePath);

  // Calculate reading time
  const readingStats = readingTime(mdxContent);

  // Get article directory and slug
  const articleDir = dirname(filePath);
  const slug = validatedFrontmatter.slug;

  // Copy article assets to public directory
  await copyArticleAssets(articleDir, slug);

  // Process thumbnail path
  let thumbnailPath = validatedFrontmatter.thumbnail;
  if (thumbnailPath.startsWith("./")) {
    thumbnailPath = `/blog-assets/${slug}/${thumbnailPath.slice(2)}`;
  }

  return {
    slug,
    title: validatedFrontmatter.title,
    description: validatedFrontmatter.description,
    publishedAt: new Date(validatedFrontmatter.publishedAt),
    updatedAt: new Date(validatedFrontmatter.updatedAt),
    tags: validatedFrontmatter.tags,
    thumbnail: thumbnailPath,
    readingTime: readingStats.minutes,
  };
}

/**
 * Loads and compiles MDX content for a specific article
 */
export async function loadArticleContent(slug: string): Promise<string | null> {
  const articlePath = join(BLOG_CONTENT_DIR, slug, "index.mdx");

  if (!existsSync(articlePath)) {
    return null;
  }

  const content = await readFile(articlePath, "utf-8");
  const { content: mdxContent } = matter(content);

  try {
    const compiled = await compile(mdxContent, {
      outputFormat: "function-body",
      development: process.env.NODE_ENV === "development",
    });

    return String(compiled);
  } catch (error) {
    console.error(`Failed to compile MDX for ${slug}:`, error);
    return null;
  }
}

/**
 * Processes all articles and generates metadata cache
 */
export async function generateArticleCache(): Promise<{
  articles: ArticleMetadata[];
  generatedAt: string;
}> {
  const articlePaths = await discoverArticles();
  const articles: ArticleMetadata[] = [];

  for (const path of articlePaths) {
    try {
      const metadata = await processArticle(path);
      articles.push(metadata);
    } catch (error) {
      console.error(`Failed to process article ${path}:`, error);
    }
  }

  // Sort articles by publication date (newest first)
  articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return {
    articles,
    generatedAt: new Date().toISOString(),
  };
}
