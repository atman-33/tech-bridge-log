import type { HeadingItem } from '~/types/heading';

interface ProgressTableOfContentsProps {
  headings: HeadingItem[];
  activeId: string;
  readHeadings: Set<string>;
  onHeadingClick: (id: string) => void;
  className?: string;
}

export function ProgressTableOfContents({
  headings,
  activeId,
  readHeadings,
  onHeadingClick,
  className = '',
}: ProgressTableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Base progress line - full height */}
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border"></div>

      {/* Active progress line - shows reading progress */}
      <div
        className="absolute left-2 top-0 w-0.5 bg-primary transition-all duration-500 ease-out"
        style={{
          height: `${(Array.from(readHeadings).length / headings.length) * 100}%`,
        }}
      />

      <ul className="space-y-0 relative">
        {headings.map(({ id, text, level }) => {
          const isActive = activeId === id;
          const isRead = readHeadings.has(id);

          return (
            <li key={id} className="relative py-2">
              {/* Dot indicator */}
              <div
                className={`
                  absolute left-0 top-3 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10
                  ${isActive
                    ? 'bg-primary border-primary scale-125 shadow-lg shadow-primary/25'
                    : isRead
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border hover:border-primary/50'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute inset-1 bg-background rounded-full"></div>
                )}
              </div>

              <button
                onClick={() => onHeadingClick(id)}
                className={`
                  block w-full text-left text-sm transition-all duration-200 pl-6 py-2 pr-2 rounded-r-md hover:bg-muted/50
                  ${level === 1 ? 'font-semibold' : level === 2 ? 'font-medium' : ''}
                  ${level === 2 ? 'ml-2' : ''}
                  ${level === 3 ? 'ml-4' : ''}
                  ${level === 4 ? 'ml-6' : ''}
                  ${level === 5 ? 'ml-8' : ''}
                  ${level === 6 ? 'ml-10' : ''}
                  ${isActive
                    ? 'text-primary font-medium bg-primary/5'
                    : isRead
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {text}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}