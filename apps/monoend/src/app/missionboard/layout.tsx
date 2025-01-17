import SidebarLayout from "./src/components/layout/sidebarLayout";
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
export default function MissionBoardLayout({ children }: { children: React.ReactNode }) {
	return (
		<Providers>
			<SidebarLayout>
				{children}
			</SidebarLayout>
		</Providers>
	);
}
