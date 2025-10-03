import { useState } from "react";
import { Link } from "react-router";
import type { Tag } from "~/lib/blog/tags";

type TagBadgeProps = {
  tag: Tag;
  variant?: "default" | "outline" | "minimal";
  size?: "sm" | "md";
  showIcon?: boolean;
  asLink?: boolean;
};

export function TagBadge({
  tag,
  variant = "default",
  size = "sm",
  showIcon = true,
  asLink = true,
}: TagBadgeProps) {
  const [iconError, setIconError] = useState(false);

  const baseClasses = `inline-flex items-center gap-1.5 font-medium transition-all duration-200 ${
    size === "sm"
      ? "px-2.5 py-1 text-xs rounded-full"
      : "px-3 py-1.5 text-sm rounded-full"
  }`;

  const variantClasses = {
    default:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
    outline:
      "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50",
    minimal:
      "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
  };

  const iconSize = size === "sm" ? 14 : 16;

  const renderIcon = () => {
    if (!(showIcon && tag.icon) || tag.icon.trim() === "") {
      return null;
    }

    // Check if icon is an SVG file path
    if (tag.icon.endsWith(".svg")) {
      return (
        <img
          alt={`${tag.label} icon`}
          className="flex-shrink-0"
          height={iconSize}
          onError={() => setIconError(true)}
          src={iconError ? "/icons/tags/default.svg" : tag.icon}
          width={iconSize}
        />
      );
    }

    // Fallback for emoji or text icons
    return (
      <span
        aria-label={`${tag.label} icon`}
        className={size === "sm" ? "text-xs" : "text-sm"}
        role="img"
      >
        {tag.icon}
      </span>
    );
  };

  const content = (
    <>
      {renderIcon()}
      <span>{tag.label}</span>
    </>
  );

  const className = `${baseClasses} ${variantClasses[variant]}`;

  if (asLink) {
    return (
      <Link
        className={className}
        title={tag.description}
        to={`/tags?tag=${encodeURIComponent(tag.id)}`}
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
