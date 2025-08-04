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

// Cache for tags data
let tagsCache: Tag[] | null = null;

/**
 * Loads tags metadata from the pre-built JSON file
 */
async function loadTagsMetadata(request?: Request): Promise<Tag[]> {
  if (tagsCache) {
    return tagsCache;
  }

  try {
    // Always fetch from the static file endpoint
    let url = "/tags-metadata.json";

    // If we have a request object (SSR), construct absolute URL
    if (request) {
      const requestUrl = new URL(request.url);
      url = `${requestUrl.origin}/tags-metadata.json`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Tags metadata not found. Run 'npm run blog:build' first.`,
      );
    }

    const content = await response.text();
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
export async function loadTagsConfig(request?: Request): Promise<Tag[]> {
  return await loadTagsMetadata(request);
}

/**
 * Gets a specific tag by ID
 */
export async function getTagById(
  tagId: string,
  request?: Request,
): Promise<Tag | null> {
  const tags = await loadTagsConfig(request);
  return tags.find((tag) => tag.id === tagId) || null;
}

/**
 * Gets multiple tags by their IDs
 */
export async function getTagsByIds(
  tagIds: string[],
  request?: Request,
): Promise<Tag[]> {
  const allTags = await loadTagsConfig(request);
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
  request?: Request,
): Promise<void> {
  try {
    const allTags = await loadTagsConfig(request);
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
  request?: Request,
): Promise<Tag[]> {
  const usedTagIds = new Set<string>();

  for (const article of articles) {
    for (const tag of article.tags) {
      usedTagIds.add(tag);
    }
  }

  return getTagsByIds(Array.from(usedTagIds), request);
}
