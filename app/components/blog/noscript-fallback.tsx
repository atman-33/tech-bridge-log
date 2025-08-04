import { Link } from 'react-router';

export function NoScriptSearchFallback() {
  return (
    <noscript>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              JavaScript Required for Search
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              Search functionality requires JavaScript to be enabled. You can still browse articles using the links below.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-800/30 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800/50 transition-colors"
              >
                Browse All Articles
              </Link>
              <Link
                to="/tags"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-800/30 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800/50 transition-colors"
              >
                Browse by Tags
              </Link>
            </div>
          </div>
        </div>
      </div>
    </noscript>
  );
}

export function NoScriptThemeFallback() {
  return (
    <noscript>
      <style>
        {`
          /* Fallback styles for users without JavaScript */
          .theme-toggle {
            display: none;
          }
          
          /* Default to light theme for noscript users */
          :root {
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --muted: 210 40% 96%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;
            --border: 214.3 31.8% 91.4%;
            --input: 214.3 31.8% 91.4%;
            --primary: 222.2 47.4% 11.2%;
            --primary-foreground: 210 40% 98%;
            --secondary: 210 40% 96%;
            --secondary-foreground: 222.2 47.4% 11.2%;
            --accent: 210 40% 96%;
            --accent-foreground: 222.2 47.4% 11.2%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 210 40% 98%;
            --ring: 222.2 84% 4.9%;
            --radius: 0.5rem;
          }
        `}
      </style>
    </noscript>
  );
}