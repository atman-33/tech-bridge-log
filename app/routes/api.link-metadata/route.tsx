import type { LoaderFunctionArgs } from 'react-router';

interface LinkMetadata {
  title: string;
  description: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  url: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return Response.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Validate URL
    new URL(targetUrl);
  } catch {
    return Response.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    // Fetch the target page
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const metadata = extractMetadata(html, targetUrl);

    return Response.json(metadata, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching link metadata:', error);

    // Return fallback metadata
    const domain = new URL(targetUrl).hostname;
    const fallbackMetadata: LinkMetadata = {
      title: domain.replace('www.', ''),
      description: `Visit ${domain} for more information`,
      siteName: domain.replace('www.', ''),
      url: targetUrl,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
    };

    return Response.json(fallbackMetadata);
  }
}

function extractMetadata(html: string, url: string): LinkMetadata {
  const domain = new URL(url).hostname;

  // Simple regex-based extraction (in production, consider using a proper HTML parser)
  const getMetaContent = (property: string): string | undefined => {
    const patterns = [
      new RegExp(`<meta\\s+property=["']${property}["']\\s+content=["']([^"']+)["']`, 'i'),
      new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${property}["']`, 'i'),
      new RegExp(`<meta\\s+name=["']${property}["']\\s+content=["']([^"']+)["']`, 'i'),
      new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${property}["']`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) return match[1];
    }
    return undefined;
  };

  const getTitleContent = (): string => {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : domain.replace('www.', '');
  };

  const title = getMetaContent('og:title') ||
    getMetaContent('twitter:title') ||
    getTitleContent();

  const description = getMetaContent('og:description') ||
    getMetaContent('twitter:description') ||
    getMetaContent('description') ||
    '';

  const image = getMetaContent('og:image') ||
    getMetaContent('twitter:image') ||
    getMetaContent('twitter:image:src');

  const siteName = getMetaContent('og:site_name') ||
    domain.replace('www.', '');

  const favicon = getMetaContent('icon') ||
    getMetaContent('shortcut icon') ||
    `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return {
    title: title || siteName,
    description: description.substring(0, 200), // Limit description length
    image: image ? makeAbsoluteUrl(image, url) : undefined,
    favicon: makeAbsoluteUrl(favicon, url),
    siteName,
    url,
  };
}

function makeAbsoluteUrl(relativeUrl: string, baseUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return relativeUrl;
  }
}