import { Outlet } from "react-router";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import type { Route } from "./+types/route";

// biome-ignore lint/suspicious/useAwait: ignore
export const loader = async ({ context }: Route.LoaderArgs) => {
  const contactEmail = context.cloudflare.env.CONTACT_EMAIL;
  return {
    contactEmail,
  };
};

const AppLayout = ({ loaderData }: Route.ComponentProps) => (
  <>
    <Header />
    <Outlet />
    <Footer contactEmail={loaderData.contactEmail} />
  </>
);

export default AppLayout;
