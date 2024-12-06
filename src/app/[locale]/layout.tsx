import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Providers from "./providers";

import "./globals.css";
import { cn } from "@nextui-org/react";
import Header from "../layout/header";

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
                className={cn(openSans.className, "antialiased min-h-dvh")}
            >
                <Providers locale={locale.locale}>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
