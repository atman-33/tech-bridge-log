import { Separator } from '~/components/ui/separator';
import { AppNavLink } from './app-nav-link';
import { Outlet } from 'react-router';

const AppTopLayout = () => {
  return (
    <>
      <div className="flex gap-12 rounded-md px-8 text-sm">
        <AppNavLink to="/">Blog</AppNavLink>
        <AppNavLink to="/Tags">Tags</AppNavLink>
      </div>
      <Separator />
      <div className="py-4">
        <Outlet />
      </div>
    </>
  );
};

export default AppTopLayout;