import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { Tag } from "~/lib/blog/tags";

type TagHeaderProps = {
  selectedTag: Tag | null;
  allTags: Tag[];
  articleCount: number;
};

export function TagHeader({
  selectedTag,
  allTags,
  articleCount,
}: TagHeaderProps) {
  const [searchParams] = useSearchParams();
  const currentTag = searchParams.get("tag");
  const [iconErrors, setIconErrors] = useState<Set<string>>(new Set());

  const handleIconError = (tagId: string) => {
    setIconErrors((prev) => new Set(prev).add(tagId));
  };

  const renderTagIcon = (tag: Tag, size: "large" | "small" = "small") => {
    // Return null if no icon is provided
    if (!tag.icon || tag.icon.trim() === "") {
      return null;
    }

    const iconSize = size === "large" ? 32 : 16;

    // Check if icon is an SVG file path
    if (tag.icon.endsWith(".svg")) {
      return (
        <img
          alt={`${tag.label} icon`}
          className="flex-shrink-0"
          height={iconSize}
          onError={() => handleIconError(tag.id)}
          src={iconErrors.has(tag.id) ? "/icons/tags/default.svg" : tag.icon}
          width={iconSize}
        />
      );
    }

    // Fallback for emoji or text icons
    return (
      <span
        aria-label={`${tag.label} icon`}
        className={size === "large" ? "text-4xl" : "text-base"}
        role="img"
      >
        {tag.icon}
      </span>
    );
  };

  return (
    <header className="mb-16">
      {/* Breadcrumb and title */}
      <div className="mb-8 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-medium text-primary text-sm dark:bg-primary/20 dark:text-primary-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary dark:bg-primary-foreground" />
          Browse by Tags
        </div>

        {selectedTag ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              {renderTagIcon(selectedTag, "large")}
              <h1 className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text font-bold text-4xl text-transparent tracking-tight dark:from-slate-100 dark:via-slate-200 dark:to-slate-300">
                {selectedTag.label}
              </h1>
            </div>
            {selectedTag.description && (
              <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                {selectedTag.description}
              </p>
            )}
            <p className="text-slate-500 text-sm dark:text-slate-500">
              {articleCount} {articleCount === 1 ? "article" : "articles"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-500 text-sm dark:text-slate-500">
              {articleCount} total {articleCount === 1 ? "article" : "articles"}
            </p>
          </div>
        )}
      </div>

      {/* Tag filter buttons */}
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {/* All articles button */}
        <Link
          className={`inline-flex h-9 items-center gap-2 rounded-full px-4 py-2 font-medium text-sm transition-all duration-200 ${
            currentTag
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              : "bg-primary text-primary-foreground shadow-md"
          }`}
          to="/tags"
        >
          <span className="text-base">📚</span>
          All Articles
        </Link>

        {/* Individual tag buttons */}
        {allTags
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((tag) => {
            const tagIcon = renderTagIcon(tag);
            return (
              <Link
                className={`inline-flex items-center ${tagIcon ? "gap-2" : ""} rounded-full px-4 py-2 font-medium text-sm transition-all duration-200 ${
                  currentTag === tag.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
                key={tag.id}
                to={`/tags?tag=${encodeURIComponent(tag.id)}`}
              >
                {tagIcon}
                {tag.label}
              </Link>
            );
          })}
      </div>
    </header>
  );
}
