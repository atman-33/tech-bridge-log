import { useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import type { AppItem } from "~/types/app-itme";

type AppCardProps = {
  app?: AppItem;
  isLoading?: boolean;
};

export function AppCard({ app, isLoading = false }: AppCardProps) {
  const [imageError, setImageError] = useState(false);

  if (isLoading || !app) {
    return (
      <div className="glass glow-on-hover rounded-2xl border border-border/60 bg-background/80 p-6 text-foreground backdrop-blur-md transition-colors dark:border-white/10 dark:bg-white/10">
        <div className="aspect-video overflow-hidden rounded-xl bg-muted/30 dark:bg-white/10">
          <Skeleton className="h-full w-full bg-muted/40 dark:bg-white/20" />
        </div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-6 w-3/4 bg-muted/40 dark:bg-white/20" />
          <Skeleton className="h-4 w-full bg-muted/40 dark:bg-white/20" />
          <Skeleton className="h-4 w-5/6 bg-muted/40 dark:bg-white/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="group glass glow-on-hover overflow-hidden rounded-2xl border border-border/60 bg-background/80 text-foreground shadow-lg backdrop-blur-md transition-all duration-500 hover:rotate-1 hover:scale-105 dark:border-white/10 dark:bg-white/10">
      {/* Image with overlay gradient */}
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center bg-destructive/20 dark:bg-red-500/30">
            <span className="text-destructive dark:text-red-100">
              Image failed to load
            </span>
          </div>
        ) : (
          <img
            alt={app.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={() => setImageError(true)}
            src={app.imageUrl}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3 flex items-center gap-3">
          {app.icon && (
            <div className="relative">
              <img
                alt="App Icon"
                className="h-6 w-6 rounded-lg shadow-lg"
                src={app.icon}
              />
              <div className="absolute inset-0 rounded-lg bg-background/60 dark:bg-white/20" />
            </div>
          )}
          <h3 className="font-semibold text-foreground text-xl tracking-tight dark:text-white">
            {app.title}
          </h3>
        </div>

        <p className="mb-4 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
          {app.description}
        </p>

        {/* Tags with glass effect */}
        <div className="flex flex-wrap gap-2">
          {app.tags.slice(0, 3).map((tag) => (
            <span
              className="glass rounded-full border border-border/40 px-3 py-1 font-medium text-foreground text-xs backdrop-blur-sm transition-colors dark:border-white/20 dark:text-white/90"
              key={tag}
            >
              {tag}
            </span>
          ))}
          {app.tags.length > 3 && (
            <span className="glass rounded-full border border-border/40 px-3 py-1 text-muted-foreground text-xs backdrop-blur-sm transition-colors dark:border-white/20 dark:text-white/80">
              +{app.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <a
        aria-label={`View ${app.title} demo`}
        className="absolute inset-0 z-20"
        href={app.appUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="sr-only">View {app.title} demo</span>
      </a>
    </div>
  );
}
