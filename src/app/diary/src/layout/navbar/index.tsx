import { auth } from "@/auth/server";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, type NavbarProps } from "@heroui/react";
import Image from "next/image";
import { siteConfig } from "../../constants/siteConfig";
import { AccountDropdown } from "./accountDropdown";
import LoginButton from "./loginButton";

export default async function NavbarComponent(props: NavbarProps) {
    const { session } = await auth({});

    return (
        <Navbar
            {...props}
            classNames={{
                base: "py-4 backdrop-filter-none bg-transparent relative",
                wrapper: "px-4 w-full justify-center bg-transparent",
                item: "hidden md:flex",
            }}
            height="54px"
        >
            <NavbarContent className="gap-4 rounded-full border-small border-default-200/20 bg-background/60 px-4 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
                {/* Logo */}
                <NavbarBrand className="mr-2 w-[40vw] md:w-auto md:max-w-fit" as="a" href="/">
                    <Image
                        src="/diaryLogo.png"
                        alt={`${siteConfig.name} Logo`}
                        width={50}
                        height={50}
                        className="w-9"
                    />
                    <span className="ml-2 font-medium text-lg md:text-xl">{siteConfig.name}</span>
                </NavbarBrand>

                {/* Account Section */}
                <NavbarItem className="ml-auto !flex items-center">
                    {session && <AccountDropdown session={session} />}
                    {!session && <LoginButton />}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
