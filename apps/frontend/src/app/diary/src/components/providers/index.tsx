"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextUIProvider } from "@nextui-org/react";
import { configureAuth } from "@arkadia/cnauth";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";


export default function Providers({
    children
}: { children: React.ReactNode }) {
	const router = useRouter();

	configureAuth({
		baseUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`,
		baseApiUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth`,
	});

    return (
        <>
            <NextUIProvider navigate={router.push}>
                <ThemeProvider attribute="class" defaultTheme="light">
					<NuqsAdapter>{children}</NuqsAdapter>
                </ThemeProvider>
            </NextUIProvider>
        </>
    );
}
