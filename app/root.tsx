import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { ReactCallRoots } from './components/react-call';
import { AdScripts } from './components/ad-scripts';
import { CustomToaster } from './components/custom-sonner';
import { ThemeProvider } from './components/theme-provider';

export const loader = async ({ }: Route.LoaderArgs) => {
};

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
	{
		rel: "stylesheet",
		href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css",
	},
	{
		rel: 'apple-touch-icon',
		sizes: '180x180',
		href: '/favicons/apple-touch-icon.png',
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '32x32',
		href: '/favicons/favicon-32x32.png',
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '16x16',
		href: '/favicons/favicon-16x16.png',
	},
	{ rel: 'manifest', href: '/site.webmanifest' },
	{ rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
];

export function Layout({ children }: { children: React.ReactNode; }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<AdScripts />
				<Meta />
				<Links />

				{/* Noscript styles for graceful degradation */}
				<noscript>
					<style>
						{`
							/* Hide JavaScript-only elements */
							.js-only {
								display: none !important;
							}
							
							/* Show noscript elements */
							noscript {
								display: block;
							}
							
							/* Default to light theme for noscript users */
							:root {
								--background: 0 0% 100%;
								--foreground: 222.2 84% 4.9%;
								--muted: 210 40% 96%;
								--muted-foreground: 215.4 16.3% 46.9%;
								--popover: 0 0% 100%;
								--popover-foreground: 222.2 84% 4.9%;
								--card: 0 0% 100%;
								--card-foreground: 222.2 84% 4.9%;
								--border: 214.3 31.8% 91.4%;
								--input: 214.3 31.8% 91.4%;
								--primary: 222.2 47.4% 11.2%;
								--primary-foreground: 210 40% 98%;
								--secondary: 210 40% 96%;
								--secondary-foreground: 222.2 47.4% 11.2%;
								--accent: 210 40% 96%;
								--accent-foreground: 222.2 47.4% 11.2%;
								--destructive: 0 84.2% 60.2%;
								--destructive-foreground: 210 40% 98%;
								--ring: 222.2 84% 4.9%;
								--radius: 0.5rem;
							}
							
							/* Hide theme toggle for noscript users */
							.theme-toggle {
								display: none;
							}
						`}
					</style>
				</noscript>
			</head>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					storageKey="acme-theme"
				>
					{children}
				</ThemeProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<>
			<Outlet />
			<ReactCallRoots />
			<CustomToaster />
		</>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
