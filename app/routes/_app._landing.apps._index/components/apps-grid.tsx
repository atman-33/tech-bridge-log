import { Fragment } from "react";
import type { AppItem } from "~/types/app-itme";
import { AppCard } from "./app-card";

type AppsGridProps = {
  apps: AppItem[];
  isLoading?: boolean;
};

export function AppsGrid({ apps, isLoading = false }: AppsGridProps) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 justify-items-center gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? new Array(6).fill(0).map((_, i) => (
            <div
              className="w-full max-w-sm animate-fade-in"
              key={`skeleton-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <>
                i
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <AppCard isLoading />
            </div>
          ))
        : apps.map((app, index) => (
            <Fragment key={app.title}>
              <div
                className="w-full max-w-sm animate-duration-700 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <AppCard app={app} />
              </div>
            </Fragment>
          ))}
    </div>
  );
}
