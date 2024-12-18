"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <NuqsAdapter>{children}</NuqsAdapter>
            </ThemeProvider>
        </NextUIProvider>
    );
}
