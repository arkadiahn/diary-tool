import { ScrollShadow } from "@nextui-org/react";
import React from "react";

import { AcmeIcon } from "./acme";
import { sectionItems } from "./sidebar-items";

import SidebarContent from "./sidebar";
import AccountHandler from "./accountHandler";

export default function Sidebar() {
    return (
        <>
            <div
                className={`
                fixed inset-y-0 left-0 z-40 
                w-full sm:w-72 translate-x-0
                transition-transform duration-300 ease-in-out
                sm:relative sm:translate-x-0
                flex h-full flex-col border-r-small border-divider p-6
            `}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
                            <AcmeIcon className="text-background" />
                        </div>
                        <span className="text-small font-bold uppercase">
                            OpenSpace
                        </span>
                    </div>
                </div>

                <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
                    <SidebarContent
                        defaultSelectedKey="home"
                        items={sectionItems}
                    />
                </ScrollShadow>

                <AccountHandler />
            </div>
        </>
    );
}
