import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      // Create a simple ID from the heading text
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      items.push({ id, text, level });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    if (tocItems.length === 0) return;

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
    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className={`space-y-1 ${className}`}>
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
        Table of Contents
      </h3>
      <ul className="space-y-1">
        {tocItems.map(({ id, text, level }) => (
          <li key={id}>
            <button
              onClick={() => handleClick(id)}
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