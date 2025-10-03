import { Fragment } from 'react';
import { AppCard } from './app-card';
import type { AppItem } from '~/types/app-itme';

interface AppsGridProps {
  apps: AppItem[];
  isLoading?: boolean;
}

export function AppsGrid({ apps, isLoading = false }: AppsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-7xl mx-auto">
      {isLoading
        ? Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={`skeleton-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <>
                  i
                }`}
                className="w-full max-w-sm animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <AppCard isLoading />
              </div>
            ))
        : apps.map((app, index) => (
            <Fragment key={app.title}>
              <div
                className="w-full max-w-sm animate-fade-in animate-duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <AppCard app={app} />
              </div>
            </Fragment>
          ))}
    </div>
  );
}
