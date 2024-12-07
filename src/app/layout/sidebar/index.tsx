"use client";

import { Icon } from "@iconify/react";
import { Avatar, Button, ScrollShadow } from "@nextui-org/react";
import React, { useState } from "react";

import { AcmeIcon } from "./acme";
import { sectionItems } from "./sidebar-items";

import SidebarContent from "./sidebar";

export default function Sidebar() {
    const [loggedIn] = useState(true);

    return (
        <div className="relative flex h-full w-72 flex-col border-r-small border-divider p-6">
            <div className="flex items-center gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
                    <AcmeIcon className="text-background" />
                </div>
                <span className="text-small font-bold uppercase">
                    OpenSpace
                </span>
            </div>

            <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
                <SidebarContent
                    defaultSelectedKey="home"
                    items={sectionItems}
                />
            </ScrollShadow>

            <div className="mt-auto flex flex-col gap-2">
                {!loggedIn && (
                    <Button
                        className="justify-start text-default-500 data-[hover=true]:text-foreground"
                        startContent={
                            <Icon
                                className="rotate-180 text-default-500"
                                icon="solar:minus-circle-line-duotone"
                                width={24}
                            />
                        }
                        variant="light"
                    >
                        Log Out
                    </Button>
                )}
                {loggedIn && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 px-2">
                            <Avatar
                                size="sm"
                                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                            />
                            <div className="flex flex-col">
                                <p className="text-small font-medium text-default-600">
                                    John Doe
                                </p>
                                {/* <p className="text-tiny text-default-400">
                                    Product Designer
                                </p> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
