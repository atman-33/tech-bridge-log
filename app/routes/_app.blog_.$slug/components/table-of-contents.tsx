import { ProgressTableOfContents } from "~/components/ui/progress-table-of-contents";
import { useActiveHeading } from "~/hooks/use-active-heading";
import { scrollToHeading } from "~/utils/heading-utils";

type TableOfContentsProps = {
  content: string;
  className?: string;
};

export function TableOfContents({ className = "" }: TableOfContentsProps) {
  const { headings, activeId, readHeadings } = useActiveHeading();

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={`${className}`}>
      <h3 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
        Table of Contents
      </h3>

      <ProgressTableOfContents
        activeId={activeId}
        headings={headings}
        onHeadingClick={scrollToHeading}
        readHeadings={readHeadings}
      />
    </nav>
  );
}
