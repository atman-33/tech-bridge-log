import { getAuth } from "~/lib/auth/auth.server";
import type { Route } from "./+types/route";

// biome-ignore lint/suspicious/useAwait: ignore
export async function loader({ context, request }: Route.LoaderArgs) {
  const auth = getAuth(context);
  return auth.handler(request);
}

// biome-ignore lint/suspicious/useAwait: ignore
export async function action({ context, request }: Route.ActionArgs) {
  const auth = getAuth(context);
  return auth.handler(request);
}
