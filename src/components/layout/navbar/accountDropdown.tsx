"use client";

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@heroui/react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface AccountDropdownProps {
    session: Session;
}
export function AccountDropdown({ session }: AccountDropdownProps) {
    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <User
                    as="button"
                    name={session.user?.name}
                    description={session.user?.email}
                    className="transition-all flex-row-reverse aria-expanded:scale-1"
                    classNames={{
                        wrapper: "items-end",
                    }}
                    avatarProps={{
                        src: session.user?.image ?? "",
                        alt: session.user?.name ?? "",
                        isBordered: true,
                        size: "sm",
                    }}
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat" disableAnimation={true}>
                <DropdownItem
                    key="profile"
                    className="h-14 gap-2 cursor-default data-[hover=true]:bg-transparent data-[hover=true]:text-foreground"
                >
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{session.user?.email}</p>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
