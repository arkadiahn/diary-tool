"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push} locale="en-GB" disableRipple={true}>
            <ThemeProvider attribute="class" defaultTheme="system">
                <Toaster position="top-right" />
                {children}
            </ThemeProvider>
        </HeroUIProvider>
    );
}
