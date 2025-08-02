import { Link, useSearchParams } from 'react-router';
import { useState } from 'react';
import type { Tag } from '~/lib/blog/tags';

interface TagHeaderProps {
  selectedTag: Tag | null;
  allTags: Tag[];
  articleCount: number;
}

export function TagHeader({ selectedTag, allTags, articleCount }: TagHeaderProps) {
  const [searchParams] = useSearchParams();
  const currentTag = searchParams.get('tag');
  const [iconErrors, setIconErrors] = useState<Set<string>>(new Set());

  const handleIconError = (tagId: string) => {
    setIconErrors(prev => new Set(prev).add(tagId));
  };

  const renderTagIcon = (tag: Tag, size: 'large' | 'small' = 'small') => {
    const iconSize = size === 'large' ? 32 : 16;

    // Check if icon is an SVG file path
    if (tag.icon.endsWith('.svg')) {
      return (
        <img
          src={iconErrors.has(tag.id) ? '/icons/tags/default.svg' : tag.icon}
          alt={`${tag.label} icon`}
          width={iconSize}
          height={iconSize}
          className="flex-shrink-0"
          onError={() => handleIconError(tag.id)}
        />
      );
    }

    // Fallback for emoji or text icons
    return (
      <span
        className={size === 'large' ? 'text-4xl' : 'text-base'}
        role="img"
        aria-label={`${tag.label} icon`}
      >
        {tag.icon}
      </span>
    );
  };

  return (
    <header className="mb-16">
      {/* Breadcrumb and title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-primary dark:bg-primary-foreground rounded-full animate-pulse"></span>
          Browse by Tags
        </div>

        {selectedTag ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              {renderTagIcon(selectedTag, 'large')}
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                {selectedTag.label}
              </h1>
            </div>
            {selectedTag.description && (
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {selectedTag.description}
              </p>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-500">
              {articleCount} {articleCount === 1 ? 'article' : 'articles'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              {articleCount} total {articleCount === 1 ? 'article' : 'articles'}
            </p>
          </div>
        )}
      </div>

      {/* Tag filter buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {/* All articles button */}
        <Link
          to="/tags"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${!currentTag
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
        >
          <span className="text-base">📚</span>
          All Articles
        </Link>

        {/* Individual tag buttons */}
        {allTags.map((tag) => (
          <Link
            key={tag.id}
            to={`/tags?tag=${encodeURIComponent(tag.id)}`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentTag === tag.id
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            {renderTagIcon(tag)}
            {tag.label}
          </Link>
        ))}
      </div>
    </header>
  );
}