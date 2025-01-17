import { siteConfig } from "./constants/siteConfig";
import { Providers } from "./components/providers";
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
export default function PortalLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
		<Providers>
			<div className="h-dvh flex flex-col">
				{children}
			</div>
		</Providers>
	)
}
