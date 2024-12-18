import { siteConfig } from "@/constants/site";
import NextLink from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <header className="absolute flex w-full justify-between p-4 z-50">
            <NextLink href="/" className="flex items-center gap-2">
                <Image
                    src="/logo.png"
                    alt={`${siteConfig.name} Logo`}
                    width={40}
                    height={40}
                    className="w-7 sm:w-8 md:w-10"
                />
                <span className="font-bold text-2xl sm:text-3xl">
                    {siteConfig.name}
                </span>
            </NextLink>
        </header>
    );
}
