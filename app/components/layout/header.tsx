import { ThemeToggle } from "~/components/theme-toggle";
import { Logo } from "~/components/logo";
import { SearchBox } from "~/routes/_app/search-box";

export function Header() {

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 h-18">
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div className="flex justify-between items-center gap-1 sm:gap-2">
          <div className="flex-shrink-0">
            <Logo to="/" />
          </div>

          <div className="flex-1 max-w-md mx-4 sm:mx-8 hidden md:block">
            <SearchBox />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="md:hidden flex-1 min-w-0 max-w-[160px] sm:max-w-[200px]">
              <SearchBox className="w-full" />
            </div>
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
