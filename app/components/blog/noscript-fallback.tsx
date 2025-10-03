import { Link } from "react-router";

export function NoScriptSearchFallback() {
  return (
    <noscript>
      <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <div>
            <h3 className="mb-1 font-medium text-yellow-800 dark:text-yellow-200">
              JavaScript Required for Search
            </h3>
            <p className="mb-3 text-sm text-yellow-700 dark:text-yellow-300">
              Search functionality requires JavaScript to be enabled. You can
              still browse articles using the links below.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                className="inline-flex items-center rounded-md bg-yellow-100 px-3 py-1.5 font-medium text-sm text-yellow-800 transition-colors hover:bg-yellow-200 dark:bg-yellow-800/30 dark:text-yellow-200 dark:hover:bg-yellow-800/50"
                to="/"
              >
                Browse All Articles
              </Link>
              <Link
                className="inline-flex items-center rounded-md bg-yellow-100 px-3 py-1.5 font-medium text-sm text-yellow-800 transition-colors hover:bg-yellow-200 dark:bg-yellow-800/30 dark:text-yellow-200 dark:hover:bg-yellow-800/50"
                to="/tags"
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
