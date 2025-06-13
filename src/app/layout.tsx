import Providers from "@/components/providers";
import { Open_Sans } from "next/font/google";
import "./globals.css";

/* -------------------------------------------------------------------------- */
/*                                    Fonts                                   */
/* -------------------------------------------------------------------------- */
const openSans = Open_Sans({
    subsets: ["latin"],
    weight: "400",
});

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
				<Providers>{children}</Providers>
            </body>
        </html>
    );
}
