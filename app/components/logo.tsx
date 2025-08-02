import { Link } from "react-router";

interface LogoProps {
  to: string;
  className?: string;
}

export function Logo({ to, className = "" }: LogoProps) {
  return (
    <Link to={to} className={`flex items-center gap-2 sm:gap-3 group ${className}`}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <img
          src="/favicons/favicon-32x32.png"
          alt="Logo"
          className="w-6 h-6 sm:w-8 sm:h-8"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
          Tech Bridge
        </span>
        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">
          Log
        </span>
      </div>
    </Link>
  );
}