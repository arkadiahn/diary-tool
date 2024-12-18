"use client";

import { I18nProviderClient } from "@/locales/client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({
    children,
    locale,
}: { children: React.ReactNode; locale: string }) {
    return (
        <>
            <NextUIProvider>
                <ThemeProvider attribute="class" defaultTheme="system">
                    <I18nProviderClient locale={locale}>
                        <NuqsAdapter>{children}</NuqsAdapter>
                    </I18nProviderClient>
                </ThemeProvider>
            </NextUIProvider>
        </>
    );
}
