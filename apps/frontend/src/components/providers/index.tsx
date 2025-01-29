"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";


export default function Providers({
    children
}: { children: React.ReactNode }) {
	const router = useRouter();

    return (
		<HeroUIProvider navigate={router.push}>
			<ThemeProvider attribute="class" defaultTheme="light">
				<NuqsAdapter>
					<Toaster />
					{children}
				</NuqsAdapter>
			</ThemeProvider>
		</HeroUIProvider>
	);
}
