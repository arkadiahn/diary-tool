import { siteConfig } from "@/constants/site";
import { Open_Sans } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "@/providers";
import "./globals.css";

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
        <html suppressHydrationWarning lang="en">
            <body className={`${openSans.className} antialiased`}>
                <Providers>
                    <div className="h-dvh flex flex-col">{children}</div>
                </Providers>
            </body>
        </html>
    );
}
