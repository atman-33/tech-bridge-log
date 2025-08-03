import { useHeadings } from '~/hooks/use-headings';
import { useActiveHeading } from '~/hooks/use-active-heading';
import { scrollToHeading } from '~/utils/heading-utils';

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const headings = useHeadings(content);
  const activeId = useActiveHeading(headings);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={`space-y-1 ${className}`}>
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
        Table of Contents
      </h3>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <button
              onClick={() => scrollToHeading(id)}
              className={`
                block w-full text-left text-sm transition-colors hover:text-primary
                ${level === 1 ? 'font-medium' : ''}
                ${level === 2 ? 'pl-3' : ''}
                ${level === 3 ? 'pl-6' : ''}
                ${level === 4 ? 'pl-9' : ''}
                ${level === 5 ? 'pl-12' : ''}
                ${level === 6 ? 'pl-15' : ''}
                ${activeId === id
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
                }
              `}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}