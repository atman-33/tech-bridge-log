import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationSection {
  id: string;
  title: string;
  level: number;
}

interface NavigationMenuProps {
  content: string;
  className?: string;
}

export function NavigationMenu({ content, className = '' }: NavigationMenuProps) {
  const [sections, setSections] = useState<NavigationSection[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: NavigationSection[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      // Create a simple ID from the heading text
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      items.push({ id, title, level });
    }

    setSections(items);
  }, [content]);

  useEffect(() => {
    if (sections.length === 0) return;

    const observerOptions = {
      rootMargin: '-20% 0% -35% 0%',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all headings
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleSectionClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false); // Close menu after navigation
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Don't render if no sections found
  if (sections.length === 0) {
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
            <div className="p-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Article Sections
              </h3>
              <ul className="space-y-1">
                {sections.map(({ id, title, level }) => (
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
                      {title}
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