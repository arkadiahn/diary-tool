"use client";

import { Icon } from "@iconify/react";
import { ScrollShadow, useDisclosure } from "@nextui-org/react";
import React, { useState } from "react";

import { AcmeIcon } from "./acme";
import { sectionItems } from "./sidebar-items";

import SidebarContent from "./sidebar";
import AccountHandler from "./accountHandler";
import LoginModal from "./loginModal";

export default function Sidebar() {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <div
                className={`
                fixed inset-y-0 left-0 z-40 
                w-full sm:w-72
                ${sidebarIsOpen ? "translate-x-0" : "-translate-x-full"}
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
                    <button
                        type="button"
                        className="block sm:hidden"
                        onClick={() => setSidebarIsOpen(false)}
                    >
                        <Icon
                            icon="solar:close-circle-line-duotone"
                            width={24}
                        />
                    </button>
                </div>

                <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
                    <SidebarContent
                        defaultSelectedKey="home"
                        items={sectionItems}
                    />
                </ScrollShadow>

                <AccountHandler onLogin={onOpen} />
            </div>

            <button
                type="button"
                className="fixed right-4 top-4 z-50 block sm:hidden"
                onClick={() => setSidebarIsOpen(true)}
            >
                <Icon icon="solar:menu-line-duotone" width={24} />
            </button>

            {sidebarIsOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 sm:hidden"
                    onClick={() => setSidebarIsOpen(false)}
                    onKeyDown={() => setSidebarIsOpen(false)}
                />
            )}

            <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
    );
}
