import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import AccountHandler from "./accountHandler";
import Image from "next/image";

import logo from "../../../../icon.png";

export default function MainNavbar() {
    return (
        <Navbar maxWidth="full">
			<NavbarBrand className="gap-2 flex-grow-0 w-fit" as="a" href="/">
				<Image src={logo} alt="MissionBoard" width={26} height={26} />
				<h1 className="text-3xl font-bold">MissionBoard</h1>
			</NavbarBrand>
			<NavbarContent justify="end">
				<NavbarItem>
					<AccountHandler />
				</NavbarItem>
			</NavbarContent>
		</Navbar>
    )
}
