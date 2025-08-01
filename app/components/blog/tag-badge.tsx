import { Link } from 'react-router';
import type { Tag } from '~/lib/blog/tags';

interface TagBadgeProps {
  tag: Tag;
  variant?: 'default' | 'outline' | 'minimal';
  size?: 'sm' | 'md';
  showIcon?: boolean;
  asLink?: boolean;
}

export function TagBadge({
  tag,
  variant = 'default',
  size = 'sm',
  showIcon = true,
  asLink = true
}: TagBadgeProps) {
  const baseClasses = `inline-flex items-center gap-1.5 font-medium transition-all duration-200 ${size === 'sm'
      ? 'px-2.5 py-1 text-xs rounded-md'
      : 'px-3 py-1.5 text-sm rounded-lg'
    }`;

  const variantClasses = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
    outline: 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50',
    minimal: 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
  };

  const content = (
    <>
      {showIcon && (
        <span
          className={size === 'sm' ? 'text-xs' : 'text-sm'}
          role="img"
          aria-label={`${tag.label} icon`}
        >
          {tag.icon}
        </span>
      )}
      <span>{tag.label}</span>
    </>
  );

  const className = `${baseClasses} ${variantClasses[variant]}`;

  if (asLink) {
    return (
      <Link
        to={`/tags?tag=${encodeURIComponent(tag.id)}`}
        className={className}
        title={tag.description}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={className} title={tag.description}>
      {content}
    </span>
  );
}