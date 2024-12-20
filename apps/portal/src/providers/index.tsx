"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextUIProvider } from "@nextui-org/react";
import { configureAuth } from "@arkadia/cnauth";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
	configureAuth({
		baseUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`,
		baseApiUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth`,
		loginEndpoint: "/login" + (process.env.NODE_ENV === "development" ? "/mock" : "")
	});

    return (
        <NextUIProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <NuqsAdapter>{children}</NuqsAdapter>
            </ThemeProvider>
        </NextUIProvider>
    );
}
