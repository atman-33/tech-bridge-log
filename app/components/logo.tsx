import { Link } from "react-router";

type LogoProps = {
  to: string;
  className?: string;
};

export function Logo({ to, className = "" }: LogoProps) {
  return (
    <Link
      className={`group flex items-center gap-2 sm:gap-3 ${className}`}
      to={to}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10">
        <img
          alt="Logo"
          className="h-6 w-6 sm:h-8 sm:w-8"
          src="/favicons/favicon-32x32.png"
        />
      </div>
      <div className="flex flex-col">
        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text font-bold text-lg text-transparent leading-tight sm:text-xl">
          Tech Bridge
        </span>
        <span className="font-medium text-gray-600 text-xs leading-tight sm:text-sm dark:text-gray-400">
          Log
        </span>
      </div>
    </Link>
  );
}
