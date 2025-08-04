import { Outlet } from 'react-router';
import type { Route } from './+types/route';
import { Header } from '~/components/layout/header';
import { Footer } from '~/components/layout/footer';

export const loader = async ({ context }: Route.LoaderArgs) => {
  const contactEmail = context.cloudflare.env.CONTACT_EMAIL;
  return {
    contactEmail,
  };
};

const AppLayout = ({ loaderData }: Route.ComponentProps) => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer contactEmail={loaderData.contactEmail} />
    </>
  );
};

export default AppLayout;