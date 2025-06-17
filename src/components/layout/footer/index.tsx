import { siteConfig } from "@/siteConfig";
import { Divider } from "@heroui/react";
import Image from "next/image";

import SystemStatus from "./SystemStatus";
import ThemeSwitch from "./themeSwitch";

export default function Footer() {
    return (
        <footer className="flex w-full flex-col sticky bottom-0">
            <div className="mx-auto w-full max-w-7xl px-3 py-3 md:flex md:items-center md:justify-between lg:px-8 bg-background dark:bg-content1 shadow-2xl rounded-t-xl">
                <div className="flex flex-col items-center justify-center gap-2 md:order-2 md:items-end">
                    <ThemeSwitch />
                </div>
                <div className="mt-4 md:order-1 md:mt-0">
                    <div className="flex items-center justify-center gap-3 md:justify-start">
                        <div className="flex items-center justify-center gap-1">
                            <Image src="/logo.png" alt="GetGas Logo" width={15} height={15} />
                            <span className="text-small font-medium">{siteConfig.name}</span>
                        </div>
                        <Divider className="h-4" orientation="vertical" />
                        <SystemStatus />
                    </div>
                    <p className="text-center text-tiny text-default-400 md:text-start">
                        DiaryTool. Made with ❤️ by{" "}
                        <a href="https://arkadia.hn" target="_blank" rel="noopener noreferrer" className="text-primary">
                            Arkadia Heilbronn gGmbH
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
