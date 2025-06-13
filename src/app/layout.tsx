import Providers from "@/components/providers";
import { Open_Sans } from "next/font/google";
import { siteConfig } from "@/siteConfig";
import type { Metadata } from "next";
import "./globals.css";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";


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
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning={true} lang="en">
            <body suppressHydrationWarning={true} className={`${openSans.className} antialiased`}>
				<Providers>
					<div className="h-dvh flex flex-col">
						<Navbar />
						<main className="flex-1 pb-8">{children}</main>
						<Footer />
					</div>
				</Providers>
            </body>
        </html>
    );
}
