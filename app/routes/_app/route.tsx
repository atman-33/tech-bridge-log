import { Outlet, redirect } from 'react-router';
import type { Route } from './+types/route';
import { Header } from '~/routes/_app/components/header';
import { Footer } from '~/components/layout/footer';
import { getAuth } from '~/lib/auth/auth.server';

export const loader = async ({ request, context }: Route.LoaderArgs) => {
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