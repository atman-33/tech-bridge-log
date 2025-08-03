import { useState, useEffect } from 'react';
import { ExternalLink, Globe } from 'lucide-react';

interface LinkMetadata {
  title: string;
  description: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  url: string;
}

interface LinkCardProps {
  url: string;
  className?: string;
}

function isLinkMetadata(data: unknown): data is LinkMetadata {
  return (
    typeof data === 'object' &&
    data !== null &&
    'title' in data &&
    'description' in data &&
    'url' in data &&
    typeof (data as any).title === 'string' &&
    typeof (data as any).description === 'string' &&
    typeof (data as any).url === 'string'
  );
}

export function LinkCard({ url, className = '' }: LinkCardProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`/api/link-metadata?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch metadata');
        }

        const data = await response.json();

        if (!isLinkMetadata(data)) {
          throw new Error('Invalid metadata response');
        }

        setMetadata(data);
      } catch (err) {
        console.error('Error fetching link metadata:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  if (loading) {
    return (
      <div className={`mb-4 border border-border rounded-lg p-4 bg-muted/50 animate-pulse ${className}`}>
        <div className="flex items-start space-x-3">
          <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-full"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className={`mb-4 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors ${className}`}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-primary hover:text-primary/80"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          <span className="break-all">{url}</span>
        </a>
      </div>
    );
  }

  return (
    <div className={`mb-4 border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {metadata.favicon ? (
              <img
                src={metadata.favicon}
                alt=""
                className="w-4 h-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <Globe className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              {metadata.title}
            </h3>
            {metadata.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {metadata.description}
              </p>
            )}
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>{metadata.siteName || new URL(url).hostname}</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
          {metadata.image && (
            <div className="flex-shrink-0">
              <img
                src={metadata.image}
                alt=""
                className="w-16 h-16 object-cover rounded border border-border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </a>
    </div>
  );
}