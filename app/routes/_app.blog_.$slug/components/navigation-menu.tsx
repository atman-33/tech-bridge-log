import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ProgressTableOfContents } from "~/components/ui/progress-table-of-contents";
import { useActiveHeading } from "~/hooks/use-active-heading";
import { scrollToHeading } from "~/utils/heading-utils";

type NavigationMenuProps = {
  content: string;
  className?: string;
};

export function NavigationMenu({ className = "" }: NavigationMenuProps) {
  const { headings, activeId, readHeadings } = useActiveHeading();
  const [isOpen, setIsOpen] = useState(false);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSectionClick = (id: string) => {
    scrollToHeading(id);
    setIsOpen(false); // Close menu after navigation
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Don't render if no headings found
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`md:hidden ${className}`}>
      {/* Menu Toggle Button */}
      {/** biome-ignore lint/a11y/useButtonType: ignore */}
      <button
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="fixed top-20 right-4 z-50 cursor-pointer rounded-full border border-border bg-background p-3 shadow-lg transition-colors hover:bg-muted"
        onClick={toggleMenu}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Navigation Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          {/** biome-ignore lint/a11y/noStaticElementInteractions: ignore */}
          {/** biome-ignore lint/a11y/useKeyWithClickEvents: ignore */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Content */}
          <nav className="fixed top-20 right-4 left-4 z-50 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg border border-border bg-background shadow-xl">
            {/* Header with close button */}
            <div className="flex items-center justify-between border-border border-b p-4">
              <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                Article Sections
              </h3>
              {/** biome-ignore lint/a11y/useButtonType: ignore */}
              <button
                aria-label="Close navigation menu"
                className="cursor-pointer rounded-md p-1 transition-colors hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Menu content */}
            <div className="p-4">
              <ProgressTableOfContents
                activeId={activeId}
                headings={headings}
                onHeadingClick={handleSectionClick}
                readHeadings={readHeadings}
              />
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
