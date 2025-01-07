import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Providers from "./providers";

import "./globals.css";

import Sidebar from "../layout/sidebar";
import Footer from "../layout/footer";

import icRoundCalendarMonth from "@iconify/icons-ic/round-calendar-month";
import icRoundHome from "@iconify/icons-ic/round-home";

/* -------------------------------------------------------------------------- */
/*                                    Fonts                                   */
/* -------------------------------------------------------------------------- */
const openSans = Open_Sans({
    subsets: ["latin"],
    weight: "400",
});

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
export default async function RootLayout({
    params,
    children,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{
        locale: string;
    }>;
}>) {
    const locale = await params;

    return (
        <html suppressHydrationWarning lang="en">
            <body
                suppressHydrationWarning
                className={`${openSans.className} antialiased h-full`}
            >
                <Providers locale={locale.locale}>
                    <div className="flex h-dvh overflow-hidden">
                        <Sidebar
                            items={[
                                {
                                    icon: icRoundHome,
									label: "Home",
                                    href: "/",
                                },
								{
                                    icon: icRoundHome,
									label: "MissionBoard",
                                    href: "/missionboard",
                                },
								{
                                    icon: icRoundCalendarMonth,
									label: "Calendar",
                                    href: "/calendar",
                                },
                            ]}
                        />
                        <div className="flex-1 flex flex-col relative z-10">
                            {children}
							<Footer />
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
