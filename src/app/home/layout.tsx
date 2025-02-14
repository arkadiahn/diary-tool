import type { Metadata } from "next";
import Script from "next/script";
import SidebarLayout from "./src/components/layout/sidebarLayout";
import { siteConfig } from "./src/constants/siteConfig";

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
            <SidebarLayout>{children}</SidebarLayout>
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
