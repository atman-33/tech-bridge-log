import { Separator } from '~/components/ui/separator';
import { AppNavLink } from './app-nav-link';
import { Outlet } from 'react-router';

const AppTopLayout = () => {
  return (
    <>
      <div className="sticky top-[75px] z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex gap-8 rounded-md px-8 md:px-24 text-sm">
          <AppNavLink to="/">Blog</AppNavLink>
          <AppNavLink to="/apps">Apps</AppNavLink>
          <AppNavLink to="/tags">Tags</AppNavLink>
        </div>
      </div>
      <div className="py-0">
        <Outlet />
      </div>
    </>
  );
};

export default AppTopLayout;