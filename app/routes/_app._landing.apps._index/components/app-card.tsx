import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

interface AppItem {
  title: string;
  icon: string;
  description: string;
  imageUrl: string;
  appUrl: string;
  tags: string[];
}

interface AppCardProps {
  app: AppItem;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <div className="relative">
        <img
          src={app.imageUrl}
          alt={app.title}
          className="w-full h-48 object-cover rounded-t-lg"
          loading="lazy"
        />
        {app.icon && (
          <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-lg p-1 shadow-md">
            <img
              src={app.icon}
              alt={`${app.title} icon`}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      <CardHeader className="flex-1">
        <CardTitle className="text-xl">{app.title}</CardTitle>
        <CardDescription>{app.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-4">
          {app.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Button asChild className="w-full">
          <a
            href={app.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Visit App
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}