/**
 * Static Assets Utility
 *
 * Provides unified access to static files across different environments:
 * - Development (Vite): Uses standard fetch()
 * - Production (Cloudflare Workers): Uses ASSETS binding
 * - Build time (Node.js): Falls back to file system access
 */

interface CloudflareContext {
  cloudflare?: {
    env: Env;
  };
}

/**
 * Determines if we have access to Cloudflare Workers ASSETS binding
 */
function hasAssetsBinding(context?: CloudflareContext): boolean {
  return !!context?.cloudflare?.env?.ASSETS;
}

/**
 * Fetches a static asset with automatic fallback between ASSETS and standard fetch
 */
export async function fetchStaticAsset(
  path: string,
  context?: CloudflareContext,
  request?: Request,
): Promise<Response> {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Try Static Assets first if available
  if (hasAssetsBinding(context)) {
    try {
      console.log(
        `[fetchStaticAsset] Trying ASSETS.fetch for ${normalizedPath}`,
      );

      // Create a request URL for ASSETS.fetch()
      const assetUrl = new URL(normalizedPath, "https://example.com");
      const assetRequest = new Request(assetUrl.toString());

      const response =
        await context!.cloudflare!.env.ASSETS.fetch(assetRequest);

      if (response.ok) {
        console.log(
          `[fetchStaticAsset] ASSETS.fetch succeeded for ${normalizedPath}`,
        );
        return response;
      }

      // If not successful, log and fall through to standard fetch
      console.warn(
        `[fetchStaticAsset] ASSETS.fetch failed for ${normalizedPath} (${response.status}), falling back to standard fetch`,
      );
    } catch (error) {
      console.warn(
        `[fetchStaticAsset] ASSETS.fetch error for ${normalizedPath}, falling back to standard fetch:`,
        error,
      );
    }
  }

  // Fallback: Use standard fetch
  console.log(`[fetchStaticAsset] Using standard fetch for ${normalizedPath}`);

  let url = normalizedPath;

  // If we have a request object (SSR), construct absolute URL
  if (request) {
    const requestUrl = new URL(request.url);
    url = `${requestUrl.origin}${normalizedPath}`;
  }

  console.log(`[fetchStaticAsset] Final URL: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Static asset not found: ${normalizedPath} (${response.status})`,
    );
  }

  console.log(
    `[fetchStaticAsset] Standard fetch succeeded for ${normalizedPath}`,
  );
  return response;
}

/**
 * Fetches and parses a JSON static asset
 */
export async function fetchStaticJSON<T>(
  path: string,
  context?: CloudflareContext,
  request?: Request,
): Promise<T> {
  try {
    const response = await fetchStaticAsset(path, context, request);
    const json = await response.json();
    return json as T;
  } catch (error) {
    console.error(`Failed to fetch static JSON ${path}:`, error);
    throw new Error(`Failed to load JSON asset: ${path}`);
  }
}

/**
 * Fetches a text static asset
 */
export async function fetchStaticText(
  path: string,
  context?: CloudflareContext,
  request?: Request,
): Promise<string> {
  try {
    const response = await fetchStaticAsset(path, context, request);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error(`Failed to fetch static text ${path}:`, error);
    throw new Error(`Failed to load text asset: ${path}`);
  }
}

/**
 * Type-safe wrapper for React Router context
 */
export interface ReactRouterContext {
  cloudflare?: {
    env: Env;
  };
}

/**
 * React Router specific helper for fetching static JSON
 */
export async function fetchStaticJSONFromRoute<T>(
  path: string,
  context: ReactRouterContext,
  request?: Request,
): Promise<T> {
  return fetchStaticJSON<T>(path, context, request);
}

/**
 * React Router specific helper for fetching static text
 */
export async function fetchStaticTextFromRoute(
  path: string,
  context: ReactRouterContext,
  request?: Request,
): Promise<string> {
  return fetchStaticText(path, context, request);
}
