import type { Metadata } from "next";
import Script from "next/script";
import { siteConfig } from "./src/constants/siteConfig";

import Footer from "./src/components/layout/footer";
import Navbar from "./src/components/layout/navbar";

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
        <>
            {/* <SidebarLayout>{children}</SidebarLayout> */}
			<div className="h-dvh max-w-dvw flex flex-col">
				<Navbar />
				<main className="flex-1 flex flex-col items-center overflow-x-hidden overflow-y-auto px-6">
					{children}
				</main>
				<Footer />
			</div>
            {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && process.env.NEXT_PUBLIC_UMAMI_URL && (
                <Script
                    async={true}
                    defer={true}
                    src="/script.js"
                    data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
                />
            )}
        </>
    );
}
