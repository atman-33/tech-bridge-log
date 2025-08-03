import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useHeadings } from '~/hooks/use-headings';
import { useActiveHeading } from '~/hooks/use-active-heading';
import { scrollToHeading } from '~/utils/heading-utils';

interface NavigationMenuProps {
  content: string;
  className?: string;
}

export function NavigationMenu({ content, className = '' }: NavigationMenuProps) {
  const headings = useHeadings(content);
  const activeId = useActiveHeading(headings);
  const [isOpen, setIsOpen] = useState(false);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
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
      <button
        onClick={toggleMenu}
        className="fixed top-20 right-4 z-50 p-3 bg-background border border-border rounded-full shadow-lg hover:bg-muted transition-colors cursor-pointer"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Navigation Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Content */}
          <nav className="fixed top-20 right-4 left-4 z-50 bg-background border border-border rounded-lg shadow-xl max-h-[calc(100vh-6rem)] overflow-y-auto">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Article Sections
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X size={16} />
              </button>
            </div>

            {/* Menu content */}
            <div className="p-4">
              <ul className="space-y-1">
                {headings.map(({ id, text, level }) => (
                  <li key={id}>
                    <button
                      onClick={() => handleSectionClick(id)}
                      className={`
                        block w-full text-left text-sm transition-colors hover:text-primary py-2 px-2 rounded hover:bg-muted
                        ${level === 1 ? 'font-medium' : ''}
                        ${level === 2 ? 'pl-4' : ''}
                        ${level === 3 ? 'pl-6' : ''}
                        ${level === 4 ? 'pl-8' : ''}
                        ${level === 5 ? 'pl-10' : ''}
                        ${level === 6 ? 'pl-12' : ''}
                        ${activeId === id
                          ? 'text-primary font-medium bg-muted'
                          : 'text-muted-foreground'
                        }
                      `}
                    >
                      {text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}