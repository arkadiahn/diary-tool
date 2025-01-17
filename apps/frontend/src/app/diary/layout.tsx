import { siteConfig } from "./src/constants/siteConfig";
import Providers from "./src/components/providers";
import { Metadata } from "next";

/* -------------------------------------------------------------------------- */
/*                                  Metadata                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description,
};


/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Providers>
			{children}
		</Providers>
	);
}
