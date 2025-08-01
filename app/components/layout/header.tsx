import { ThemeToggle } from "~/components/theme-toggle";
import { Logo } from "~/components/logo";
import { SearchBox } from "~/routes/_app/search-box";

export function Header() {

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Logo to="/" />

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <SearchBox />
          </div>

          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <SearchBox className="w-64" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
