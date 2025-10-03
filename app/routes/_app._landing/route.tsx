import { Outlet } from "react-router";
import { AppNavLink } from "./components/app-nav-link";

const AppTopLayout = () => (
  <>
    <div className="sticky top-[72px] z-40 border-gray-200/50 border-b bg-white/95 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/95">
      <div className="flex gap-12 rounded-md px-8 text-sm md:px-24">
        <AppNavLink to="/">Blog</AppNavLink>
        <AppNavLink to="/tags">Tags</AppNavLink>
        <AppNavLink to="/apps">Apps</AppNavLink>
      </div>
    </div>
    <div className="py-0">
      <Outlet />
    </div>
  </>
);

export default AppTopLayout;
