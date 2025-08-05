import type { Route } from './+types/route';
import { AppCard } from './app-card';
import appsData from '~/contents/apps.json';

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Apps - Tech Bridge Log' },
    { name: 'description', content: 'Showcase of web applications and projects' },
  ];
}

export async function loader() {
  return { apps: appsData };
}

export default function AppsPage({ loaderData }: Route.ComponentProps) {
  const { apps } = loaderData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Apps</h1>
        <p className="text-lg text-muted-foreground">
          Explore a collection of web applications and projects showcasing modern development practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, index) => (
          <AppCard key={index} app={app} />
        ))}
      </div>
    </div>
  );
}