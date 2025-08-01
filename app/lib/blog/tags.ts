import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface Tag {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

interface TagsMetadata {
  tags: Tag[];
  generatedAt: string;
}

// Get the current file's directory and resolve project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "../../..");

// Cache for tags data
let tagsCache: Tag[] | null = null;

// Use import.meta.glob to load tags metadata at build time (Vite + SSR compatible)
// This will be undefined in Node.js environment
const tagsModule =
  typeof import.meta.glob !== "undefined"
    ? import.meta.glob("/public/tags-metadata.json", { as: "raw" })
    : {};

/**
 * Loads tags metadata from the pre-built JSON file
 */
async function loadTagsMetadata(): Promise<Tag[]> {
  if (tagsCache) {
    return tagsCache;
  }

  let content: string;

  // Load content using import.meta.glob in Vite environment
  const moduleLoader = tagsModule["/public/tags-metadata.json"];
  if (moduleLoader) {
    content = await moduleLoader();
  } else {
    // In Node.js environment, read from file system
    const tagsMetadataPath = join(PROJECT_ROOT, "public/tags-metadata.json");
    if (!existsSync(tagsMetadataPath)) {
      throw new Error(
        `Tags metadata not found: ${tagsMetadataPath}. Run 'npm run blog:build' first.`,
      );
    }
    content = await readFile(tagsMetadataPath, "utf-8");
  }

  try {
    const metadata: TagsMetadata = JSON.parse(content);

    if (!metadata.tags || !Array.isArray(metadata.tags)) {
      throw new Error("Invalid tags metadata format");
    }

    tagsCache = metadata.tags;
    return tagsCache;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse tags metadata: ${error.message}`);
    }
    throw new Error("Failed to parse tags metadata: Unknown error");
  }
}

/**
 * Loads and validates the tags configuration
 */
export async function loadTagsConfig(): Promise<Tag[]> {
  return loadTagsMetadata();
}

/**
 * Gets a specific tag by ID
 */
export async function getTagById(tagId: string): Promise<Tag | null> {
  const tags = await loadTagsConfig();
  return tags.find((tag) => tag.id === tagId) || null;
}

/**
 * Gets multiple tags by their IDs
 */
export async function getTagsByIds(tagIds: string[]): Promise<Tag[]> {
  const allTags = await loadTagsConfig();
  const tagMap = new Map(allTags.map((tag) => [tag.id, tag]));

  return tagIds
    .map((id) => tagMap.get(id))
    .filter((tag): tag is Tag => tag !== undefined);
}

/**
 * Validates that all article tags exist in the tags configuration
 * Note: This validation is now primarily done at build time
 */
export async function validateArticleTags(
  articleTags: string[],
  articleSlug: string,
): Promise<void> {
  try {
    const allTags = await loadTagsConfig();
    const validTagIds = new Set(allTags.map((tag) => tag.id));

    const invalidTags = articleTags.filter((tag) => !validTagIds.has(tag));

    if (invalidTags.length > 0) {
      console.warn(
        `Article "${articleSlug}" contains invalid tags: ${invalidTags.join(", ")}. ` +
          `All tags must be defined in contents/tags.json.`,
      );
    }
  } catch (error) {
    // Don't throw in runtime, just log the warning
    console.warn(
      `Could not validate tags for article "${articleSlug}":`,
      error,
    );
  }
}

/**
 * Gets all unique tags used across articles
 */
export async function getUsedTags(
  articles: { tags: string[] }[],
): Promise<Tag[]> {
  const usedTagIds = new Set<string>();

  for (const article of articles) {
    for (const tag of article.tags) {
      usedTagIds.add(tag);
    }
  }

  return getTagsByIds(Array.from(usedTagIds));
}
