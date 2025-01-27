import SessionProviderWrapper from "@/auth/wrapper";
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
    <html suppressHydrationWarning lang="en">
      <body
	  	suppressHydrationWarning
        className={`${openSans.className} antialiased`}
      >
		<SessionProviderWrapper>
			<Providers>
				{children}
			</Providers>
		</SessionProviderWrapper>
      </body>
    </html>
  );
}
