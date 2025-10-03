import { ExternalLink, Globe } from "lucide-react";
import { useEffect, useState } from "react";

type LinkMetadata = {
  title: string;
  description: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  url: string;
};

type LinkCardProps = {
  url: string;
  className?: string;
};

// Decode common HTML entities in a safe, universal way (SSR/CSR)
function decodeHtmlEntities(input: string): string {
  if (!input) {
    return input;
  }

  // Quick replace for the most common entities (works during SSR too)
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'",
    "&#x2F;": "/",
    "&#x60;": "`",
    "&#x3D;": "=",
  };

  const hasBasicEntities = /&(amp|lt|gt|quot|#39|#x27|#x2F|#x60|#x3D);/.test(
    input
  );
  let output = hasBasicEntities
    ? input.replace(
        /&(amp|lt|gt|quot|#39|#x27|#x2F|#x60|#x3D);/g,
        (m) => map[m] || m
      )
    : input;

  // If running in the browser, use DOMParser for broader coverage
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(output, "text/html");
      const text = doc.documentElement.textContent;
      if (text) {
        output = text;
      }
    } catch {
      // noop – fall back to basic replacements
    }
  }

  return output;
}

function isLinkMetadata(data: unknown): data is LinkMetadata {
  return (
    typeof data === "object" &&
    data !== null &&
    "title" in data &&
    "description" in data &&
    "url" in data &&
    // biome-ignore lint/suspicious/noExplicitAny: ignore
    typeof (data as any).title === "string" &&
    // biome-ignore lint/suspicious/noExplicitAny: ignore
    typeof (data as any).description === "string" &&
    // biome-ignore lint/suspicious/noExplicitAny: ignore
    typeof (data as any).url === "string"
  );
}

export function LinkCard({ url, className = "" }: LinkCardProps) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const decodedUrl = decodeHtmlEntities(url.trim());

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          `/api/link-metadata?url=${encodeURIComponent(decodedUrl)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }

        const data = await response.json();

        if (!isLinkMetadata(data)) {
          throw new Error("Invalid metadata response");
        }

        // Normalize/Decode any HTML entities in textual fields from metadata
        const normalized: LinkMetadata = {
          ...data,
          title: decodeHtmlEntities(data.title),
          description: decodeHtmlEntities(data.description || ""),
          siteName: data.siteName
            ? decodeHtmlEntities(data.siteName)
            : undefined,
          url: decodeHtmlEntities(data.url),
        };

        setMetadata(normalized);
      } catch (err) {
        console.error("Error fetching link metadata:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [decodedUrl]);

  if (loading) {
    return (
      <div
        className={`mb-4 animate-pulse rounded-lg border border-border bg-muted/50 p-4 ${className}`}
      >
        <div className="flex items-start space-x-3">
          <div className="h-4 w-4 rounded bg-muted-foreground/20" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-muted-foreground/20" />
            <div className="h-3 w-full rounded bg-muted-foreground/20" />
            <div className="h-3 w-1/2 rounded bg-muted-foreground/20" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div
        className={`mb-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 ${className}`}
      >
        <a
          className="flex items-center space-x-2 text-primary hover:text-primary/80"
          href={decodedUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          <span className="break-all">{decodedUrl}</span>
        </a>
      </div>
    );
  }

  return (
    <div
      className={`mb-4 overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-md ${className}`}
    >
      <a
        className="block p-4 transition-colors hover:bg-muted/50"
        href={decodedUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {metadata.favicon ? (
              <img
                alt=""
                className="h-4 w-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
                src={metadata.favicon}
              />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 line-clamp-2 font-semibold text-foreground">
              {metadata.title}
            </h3>
            {metadata.description && (
              <p className="mb-2 line-clamp-2 text-muted-foreground text-sm">
                {metadata.description}
              </p>
            )}
            <div className="flex items-center space-x-1 text-muted-foreground text-xs">
              <span>{metadata.siteName || new URL(decodedUrl).hostname}</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
          {metadata.image && (
            <div className="flex-shrink-0">
              <img
                alt=""
                className="h-16 w-16 rounded border border-border object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
                src={metadata.image}
              />
            </div>
          )}
        </div>
      </a>
    </div>
  );
}
