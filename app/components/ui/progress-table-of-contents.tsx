import type { HeadingItem } from "~/types/heading";

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
  className = "",
}: ProgressTableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Base progress line - full height */}
      <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-border" />

      {/* Active progress line - shows reading progress */}
      <div
        className="absolute top-0 left-2 w-0.5 bg-primary transition-all duration-500 ease-out"
        style={{
          height: `${(Array.from(readHeadings).length / headings.length) * 100}%`,
        }}
      />

      <ul className="relative space-y-0">
        {headings.map(({ id, text, level }) => {
          const isActive = activeId === id;
          const isRead = readHeadings.has(id);
          const isSmallDot = level >= 3;
          const dotSize = isSmallDot ? "w-3 h-3" : "w-4 h-4";
          const dotPosition = isSmallDot ? "top-2" : "top-1.5";
          const innerDotInset = isSmallDot ? "inset-0.5" : "inset-1";

          return (
            <li className="relative py-0" key={id}>
              {/* Dot indicator */}
              <div
                className={`absolute ${dotPosition} ${dotSize} z-10 rounded-full border-2 transition-all duration-300 ${isSmallDot ? "left-[3px]" : "left-[1px]"}
                  ${
                    isActive
                      ? "scale-125 border-primary bg-primary shadow-lg shadow-primary/25"
                      : isRead
                        ? "border-primary bg-primary"
                        : "border-border bg-background hover:border-primary/50"
                  }
                `}
              >
                {isActive && (
                  <div
                    className={`absolute ${innerDotInset} rounded-full bg-background`}
                  />
                )}
              </div>

              <button
                className={`block w-full rounded-r-md py-1 pr-2 pl-6 text-left text-sm transition-all duration-200 hover:bg-muted/50 ${level === 1 ? "font-semibold" : level === 2 ? "font-medium" : ""}
                  ${level === 2 ? "ml-2" : ""}
                  ${level === 3 ? "ml-4" : ""}
                  ${level === 4 ? "ml-6" : ""}
                  ${level === 5 ? "ml-8" : ""}
                  ${level === 6 ? "ml-10" : ""}
                  ${
                    isActive
                      ? "bg-primary/5 font-medium text-primary"
                      : isRead
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                  }
                `}
                onClick={() => onHeadingClick(id)}
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
