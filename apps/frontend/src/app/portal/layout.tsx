import { siteConfig } from "./src/constants/siteConfig";
import { Providers } from "./src/components/providers";
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
