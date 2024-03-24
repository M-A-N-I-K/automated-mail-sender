import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Head from "next/head";

import { EdgeStoreProvider } from "@/lib/edgestore";
import { ThemeProvider } from "../components/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MailEase",
	description: "Automated mail sender for efficient email communication",
	icons: {
		icon: [
			{
				media: "prefers-color-scheme: light",
				url: "/logo.svg",
				href: "/logo.svg",
			},
			{
				media: "prefers-color-scheme: dark",
				url: "/logo.svg",
				href: "/logo.svg",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<Head>
				<meta
					property="og:url"
					content="https://automated-mail-sender.vercel.app/"
				/>
				<meta
					property="og:description"
					content="Automated mail sender for efficient email communication"
				/>
				<meta property="og:title" content="Link preview title" />
				<meta property="og:image" content="Link preview image" />
				<meta property="og:type" content="Automated Email Send" />
				<meta property="og:site_name" content="EmailEase" />
			</Head>
			<body className={inter.className}>
				<EdgeStoreProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
						storageKey="notion-theme"
					>
						<Toaster position="bottom-center" />
						{children}
					</ThemeProvider>
				</EdgeStoreProvider>
			</body>
		</html>
	);
}
