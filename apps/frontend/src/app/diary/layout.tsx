import { siteConfig } from "./src/constants/siteConfig";
import { Metadata } from "next";

import Navbar from "./src/layout/navbar";
import Footer from "./src/layout/footer";


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
		<div className="h-dvh flex flex-col">
			<Navbar />
			<main className="flex-1 pb-8">
				{children}
			</main>
			<Footer />
		</div>
	);
}
