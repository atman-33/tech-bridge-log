// biome-ignore lint/correctness/useJsonImportAttributes: ignore
import appsData from "~/contents/apps.json";
import type { Route } from "./+types/route";
import { AppsGrid } from "./components/apps-grid";

export function meta(): Route.MetaDescriptors {
  return [
    { title: "Apps - Tech Bridge Log" },
    {
      name: "description",
      content: "Showcase of web applications and projects",
    },
  ];
}

// biome-ignore lint/suspicious/useAwait: ignore
export async function loader() {
  return { apps: appsData };
}

export default function AppsPage({ loaderData }: Route.ComponentProps) {
  const { apps } = loaderData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 font-bold text-4xl">Apps</h1>
        <p className="text-lg text-muted-foreground">
          Explore a collection of web applications and projects showcasing
          modern development practices.
        </p>
      </div>
      <AppsGrid apps={apps} />
    </div>
  );
}
