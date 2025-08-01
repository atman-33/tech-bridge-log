import { useLoaderData, useSearchParams } from 'react-router';
import type { Route } from './+types/route';
import { SearchResults } from './search-results';
import type { SearchIndex } from '~/lib/blog/search-index';

export const meta: Route.MetaFunction = ({ location }) => {
  const url = new URL(location.pathname + location.search, 'https://example.com');
  const query = url.searchParams.get('q') || '';

  return [
    { title: query ? `Search results for "${query}"` : 'Search' },
    { name: 'description', content: query ? `Search results for "${query}" in our tech blog` : 'Search through our technical articles and tutorials' },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';

  // Load search index from public directory
  // In a real app, you might want to cache this or load it differently
  let searchIndex: SearchIndex | null = null;
  try {
    const response = await fetch(new URL('/search-index.json', request.url));
    if (response.ok) {
      searchIndex = await response.json() as SearchIndex;
    }
  } catch (error) {
    console.error('Failed to load search index:', error);
  }

  return {
    query,
    searchIndex,
  };
};

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  const { query, searchIndex } = loaderData;
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get('q') || query;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search</h1>
          {currentQuery && (
            <p className="text-muted-foreground">
              Results for "{currentQuery}"
            </p>
          )}
        </div>

        <SearchResults
          query={currentQuery}
          searchIndex={searchIndex}
        />
      </div>
    </div>
  );
}