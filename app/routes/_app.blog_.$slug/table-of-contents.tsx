import { useHeadings } from '~/hooks/use-headings';
import { useActiveHeading } from '~/hooks/use-active-heading';
import { scrollToHeading } from '~/utils/heading-utils';
import { ProgressTableOfContents } from '~/components/ui/progress-table-of-contents';

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const headings = useHeadings(content);
  const { activeId, readHeadings } = useActiveHeading(headings);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={`${className}`}>
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
        Table of Contents
      </h3>

      <ProgressTableOfContents
        headings={headings}
        activeId={activeId}
        readHeadings={readHeadings}
        onHeadingClick={scrollToHeading}
      />
    </nav>
  );
}