import { siteConfig } from "../../../constants/siteConfig";
import { Divider } from "@heroui/react";
import Image from "next/image";

import SystemStatus from "./SystemStatus";
import ThemeSwitch from "./ThemeSwitch";

export default function Footer() {
    return (
        <footer className="flex w-full flex-col">
            <div className="mx-auto w-full max-w-full p-4 pb-5 sm:px-6 sm:py-6 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex flex-col items-center justify-center gap-2 md:order-2 md:items-end">
                    <ThemeSwitch />
                </div>
                <div className="mt-4 md:order-1 md:mt-0">
                    <div className="flex items-center justify-center gap-3 md:justify-start">
                        <div className="flex items-center justify-center gap-1">
                            {/* <Image src="/logo.png" alt="GetGas Logo" width={15} height={15} /> */}
                            <span className="text-small font-medium">{siteConfig.name}</span>
                        </div>
                        <Divider className="h-4" orientation="vertical" />
                        <SystemStatus />
                    </div>
                    <p className="text-center text-tiny text-default-500 md:text-start">
                        &copy; {new Date().getFullYear()} {siteConfig.company}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
