import { Logo } from "~/components/logo";
import { SearchBox } from "~/components/search-box";
import { ThemeToggle } from "~/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-18 border-gray-200/50 border-b bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
      <div className="container mx-auto px-2 py-4 sm:px-4">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          <div className="flex-shrink-0">
            <Logo to="/" />
          </div>

          <div className="mx-4 hidden max-w-md flex-1 sm:mx-8 md:block">
            <SearchBox />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="min-w-0 max-w-[160px] flex-1 sm:max-w-[200px] md:hidden">
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
